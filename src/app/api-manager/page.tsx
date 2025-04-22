"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Copy, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { getApiKeys } from "@/services/api-key-service";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function ApiManagerPage() {
  const [apiKey, setApiKey] = React.useState('');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [organisation, setOrganisation] = React.useState('');
  const { toast: useToastHook } = useToast()

  // Mock API Keys (because persistent storage is unavailable)
  const [apiKeys, setApiKeys] = React.useState([
    { id: '1', provider: 'OpenAI', model: 'GPT-3', key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', userId: 'user1', isActive: true, organisation: 'OpenAI' },
    { id: '2', provider: 'Anthropic', model: 'Claude', key: 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', userId: 'user1', isActive: false, organisation: 'Anthropic' },
  ]);

    const [selectedApiKeyId, setSelectedApiKeyId] = React.useState<string | null>(null);
    const [editMode, setEditMode] = React.useState(false);

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleChangeApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

    const handleChangeOrganisation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrganisation(event.target.value);
    };


    const handleSaveApiKey = async () => {
        // Basic validation
        if (!apiKey || !organisation) {
            useToastHook({
                title: "Error",
                description: "API Key and Organisation cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        // Create a new API key object
        const newApiKey = {
            id: String(Date.now()), // Generate a unique ID (not ideal, but works without a database)
            provider: organisation, // Assuming provider is the same as organisation for simplicity
            model: 'Unknown', // You might want to add a model selection field
            key: apiKey,
            userId: 'current-user', // Replace with actual user ID
            isActive: true,
            organisation: organisation,
        };

        // Update the state with the new API key
        setApiKeys(prevKeys => [...prevKeys, newApiKey]);

        // Clear the input fields
        setApiKey('');
        setOrganisation('');

        // Show a success message
        useToastHook({
            title: "Success",
            description: "API Key saved."
        });
    };

    const handleCopyApiKey = (apiKey: string) => {
        navigator.clipboard.writeText(apiKey);
        useToastHook({
            description: "API Key copied to clipboard."
        });
    };

    const handleDeleteApiKey = (id: string) => {
        setSelectedApiKeyId(id); // Set the ID of the API key to be deleted
    };

    const confirmDeleteApiKey = () => {
        if (selectedApiKeyId) {
            setApiKeys(prevKeys => prevKeys.filter(key => key.id !== selectedApiKeyId));
            setSelectedApiKeyId(null); // Clear the selected API key ID
            useToastHook({
                description: "API Key deleted."
            });
        }
    };

    const cancelDeleteApiKey = () => {
        setSelectedApiKeyId(null); // Clear the selected API key ID
    };

    const handleEditApiKey = (id: string) => {
        const apiKeyToEdit = apiKeys.find(key => key.id === id);
        if (apiKeyToEdit) {
            setSelectedApiKeyId(id);
            setApiKey(apiKeyToEdit.key);
            setOrganisation(apiKeyToEdit.organisation);
            setEditMode(true);
        }
    };

    const handleUpdateApiKey = () => {
        if (selectedApiKeyId) {
            setApiKeys(prevKeys =>
                prevKeys.map(key =>
                    key.id === selectedApiKeyId ? { ...key, key: apiKey, organisation: organisation } : key
                )
            );
            setApiKey('');
            setOrganisation('');
            setEditMode(false);
            setSelectedApiKeyId(null);
            useToastHook({
                description: "API Key updated."
            });
        }
    };


  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>API Manager</CardTitle>
          <CardDescription>Manage your API keys for various AI services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="organisation">Organisation</Label>
            <Input
                type="text"
                id="organisation"
                placeholder="Enter issuer organisation of API key"
                value={organisation}
                onChange={handleChangeOrganisation}
                />
            <CardDescription>Enter issuer organisation of API key</CardDescription>
          </div>
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={handleChangeApiKey}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShowApiKey}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
            {editMode ? (
                <Button onClick={handleUpdateApiKey}>Update API Key</Button>
            ) : (
                <Button onClick={handleSaveApiKey}>Save API Key</Button>
            )}
        </CardContent>
      </Card>

        <Card className="w-[80%] mx-auto mt-8">
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>List of all API Keys</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <div className="grid gap-4">
                        {apiKeys.map((apiKey) => (
                            <div key={apiKey.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{apiKey.organisation} - {apiKey.model}</p>
                                        <p className="text-sm text-muted-foreground">ID: {apiKey.id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="icon" onClick={() => handleCopyApiKey(apiKey.key)}>
                                            <Copy className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleEditApiKey(apiKey.id)}>
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Diese Aktion kann nicht rückgängig gemacht werden.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={cancelDeleteApiKey}>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={confirmDeleteApiKey}>Löschen</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
        {/* Confirmation Dialog */}
        {selectedApiKeyId && (
            <div>
            </div>
        )}
    </div>
  );
}

