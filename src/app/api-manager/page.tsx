"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  model: string;
  key: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
}

const dummyApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'OpenAI API Key',
    provider: 'OpenAI',
    model: 'GPT-4',
    key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    status: 'active',
  },
  {
    id: '2',
    name: 'Google AI API Key',
    provider: 'GoogleAI',
    model: 'Gemini Pro',
    key: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    status: 'inactive',
  },
];

const ApiManagerPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(dummyApiKeys);
  const [newApiKey, setNewApiKey] = useState<Omit<ApiKey, 'id' | 'status'>>({
    name: '',
    provider: '',
    model: '',
    key: '',
  });
  const [pingResults, setPingResults] = useState<{ [key: string]: 'success' | 'error' }>({});
    const { toast } = useToast()

  useEffect(() => {
    // Load API keys from local storage or database here
    // For now, using dummy data
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewApiKey({ ...newApiKey, [e.target.name]: e.target.value });
  };

  const handleAddApiKey = () => {
    const id = Math.random().toString(36).substring(7); // Generate a simple unique ID
    const apiKeyToAdd: ApiKey = { ...newApiKey, id, status: 'pending' };
    setApiKeys([...apiKeys, apiKeyToAdd]);
    setNewApiKey({ name: '', provider: '', model: '', key: '' });

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
  };

  const handlePingApiKey = async (id: string, key: string) => {
    // In a real application, you would make an API call to check the key's validity
    // Here, we simulate the ping with a timeout
    setPingResults(prevResults => ({ ...prevResults, [id]: 'pending' }));
    
    // Simulate API ping (replace with actual API call)
    setTimeout(() => {
      // Simulate success or failure based on the API key (for demonstration)
      const isSuccess = key.startsWith('sk-'); // OpenAI keys start with "sk-"
      setPingResults(prevResults => ({ ...prevResults, [id]: isSuccess ? 'success' : 'error' }));
      if (isSuccess) {
        toast({
          title: "API Key Pinged",
          description: "API Key has been successfully pinged.",
        })
      }
      else {
        toast({
          title: "API Key Ping Failed",
          description: "API Key ping failed.",
          variant: "destructive",
        })
      }
    }, 2000);
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
          {apiKeys.length > 0 ? (
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
                  <Button
                    onClick={() => handlePingApiKey(apiKey.id, apiKey.key)}
                    disabled={pingResults[apiKey.id] === 'pending' || apiKey.status !== 'active'}
                  >
                    {pingResults[apiKey.id] === 'pending'
                      ? 'Pinging...'
                      : 'Ping API Key'}
                  </Button>
                  {pingResults[apiKey.id] === 'success' && (
                    <Label className="text-green-500">API Key is active!</Label>
                  )}
                  {pingResults[apiKey.id] === 'error' && (
                    <Label className="text-red-500">API Key is not valid.</Label>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No API keys added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagerPage;
