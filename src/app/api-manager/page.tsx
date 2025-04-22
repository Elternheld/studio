"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"
import {
  getApiKeys,
  addApiKey as addApiKeyToDb,
  updateApiKey as updateApiKeyInDb,
  deleteApiKey as deleteApiKeyFromDb,
  pingApiKey as pingApiKeyFn,
} from '@/services/api-key-service';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  model: string;
  key: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
}

const ApiManagerPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState<Omit<ApiKey, 'id' | 'status'>>({
    name: '',
    provider: '',
    model: '',
    key: '',
  });
  const [pingResults, setPingResults] = useState<{ [key: string]: { status: 'pending' | 'success' | 'error', latency: number | null } }>({});
  const { toast } = useToast()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const keys = await getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Failed to load API keys:", error);
      toast({
        title: "Failed to Load API Keys",
        description: "Failed to retrieve API keys from the database.",
        variant: "destructive",
      });
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewApiKey({ ...newApiKey, [e.target.name]: e.target.value });
  };

  const handleAddApiKey = async () => {
    try {
      const id = Math.random().toString(36).substring(7); // Generate a simple unique ID
      const apiKeyToAdd: ApiKey = { ...newApiKey, id, status: 'pending' };
      setApiKeys([...apiKeys, apiKeyToAdd]);
      setNewApiKey({ name: '', provider: '', model: '', key: '' });

      await addApiKeyToDb(apiKeyToAdd);

      // Simulate API key verification (replace with actual API call)
      setTimeout(() => {
        setApiKeys(prevKeys =>
          prevKeys.map(key => {
            if (key.id === id) {
              return { ...key, status: 'active' }; // Assume verification is successful
            }
            return key;
          })
        );
        toast({
          title: "API Key Added",
          description: "API Key has been successfully added.",
        })
      }, 2000);

      loadApiKeys(); // Reload API keys to reflect changes

    } catch (error) {
      console.error("Error adding API key:", error);
      toast({
        title: "Error Adding API Key",
        description: "Failed to add the API key to the database.",
        variant: "destructive",
      });
      loadApiKeys();
    }
  };

  const handleUpdateApiKey = async (id: string, updatedKey: Partial<ApiKey>) => {
    try {
      await updateApiKeyInDb(id, updatedKey);
      setApiKeys(prevKeys =>
        prevKeys.map(key => (key.id === id ? { ...key, ...updatedKey } : key))
      );
      toast({
        title: "API Key Updated",
        description: "API Key has been successfully updated.",
      });
      loadApiKeys(); // Refresh API keys after update
    } catch (error) {
      console.error("Error updating API key:", error);
      toast({
        title: "Error Updating API Key",
        description: "Failed to update the API key.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKeyFromDb(id);
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
      toast({
        title: "API Key Deleted",
        description: "API Key has been successfully deleted.",
      });
      loadApiKeys(); // Refresh API keys after deletion
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error Deleting API Key",
        description: "Failed to delete the API key.",
        variant: "destructive",
      });
    }
  };

  const handlePingApiKey = async (id: string, key: string) => {
    setPingResults(prevResults => ({ ...prevResults, [id]: { status: 'pending', latency: null } }));
  
    const startTime = performance.now();
    try {
      // Simulate API ping (replace with actual API call)
      const isSuccess = await pingApiKeyFn(key);
      const endTime = performance.now();
      const latency = endTime - startTime;
  
      setPingResults(prevResults => ({
        ...prevResults,
        [id]: { status: isSuccess ? 'success' : 'error', latency: latency },
      }));
  
      if (isSuccess) {
        toast({
          title: "API Key Pinged",
          description: `API Key is active! Latency: ${latency.toFixed(2)}ms`,
        });
      } else {
        toast({
          title: "API Key Ping Failed",
          description: "API Key is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ping failed:", error);
      const endTime = performance.now();
      const latency = endTime - startTime;
      setPingResults(prevResults => ({
        ...prevResults,
        [id]: { status: 'error', latency: latency },
      }));
      toast({
        title: "API Key Ping Failed",
        description: `API Key ping failed. Latency: ${latency.toFixed(2)}ms`,
        variant: "destructive",
      });
    }
  };
  


  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4">API Manager</h1>
      <p className="mb-8">Manage your API keys for various AI services.</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New API Key</CardTitle>
          <CardDescription>Enter the details for the new API key.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" value={newApiKey.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Input type="text" id="provider" name="provider" value={newApiKey.provider} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input type="text" id="model" name="model" value={newApiKey.model} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="key">API Key</Label>
            <Input type="password" id="key" name="key" value={newApiKey.key} onChange={handleInputChange} />
          </div>
          <Button onClick={handleAddApiKey}>Add API Key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>List of all your API keys.</CardDescription>
        </CardHeader>
        <CardContent>
        {loading ? (
            <p>Loading API keys...</p>
          ) : (
            apiKeys.length > 0 ? (
            <div className="grid gap-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-md p-4">
                  <h3 className="font-semibold">{apiKey.name}</h3>
                  <p>Provider: {apiKey.provider}</p>
                  <p>Model: {apiKey.model}</p>
                  <p>Key: {apiKey.key.replace(/.(?=.{4})/g, '*')}</p>
                  <p>
                    Status: {apiKey.status}
                    {apiKey.status === 'error' && ' - Please check your API key.'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handlePingApiKey(apiKey.id, apiKey.key)}
                      disabled={pingResults[apiKey.id]?.status === 'pending' || apiKey.status !== 'active'}
                    >
                      {pingResults[apiKey.id]?.status === 'pending'
                        ? 'Pinging...'
                        : 'Ping API Key'}
                    </Button>
                    {pingResults[apiKey.id]?.status === 'success' && (
                      <Label className="text-green-500">
                        API Key is active! Latency: {pingResults[apiKey.id]?.latency?.toFixed(2)}ms
                      </Label>
                    )}
                    {pingResults[apiKey.id]?.status === 'error' && (
                      <Label className="text-red-500">
                        API Key is not valid. Latency: {pingResults[apiKey.id]?.latency?.toFixed(2)}ms
                      </Label>
                    )}

                    <Button onClick={() => {
                      const newKey = prompt("Enter new API Key", apiKey.key)
                      if (newKey) {
                        handleUpdateApiKey(apiKey.id, { key: newKey })
                      }
                    }}>
                      Adjust API Key
                    </Button>

                    <Button onClick={() => {
                      const confirmDelete = confirm("Are you sure you want to delete this API key?");
                      if (confirmDelete) {
                        handleDeleteApiKey(apiKey.id);
                      }
                    }} variant="destructive">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No API keys added yet.</p>
          )}
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagerPage;
