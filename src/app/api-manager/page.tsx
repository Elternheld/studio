"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { useApiKeyContext } from "@/components/ApiKeyContext";
import {Textarea} from "@/components/ui/textarea";

export default function ApiManagerPage() {
  const [apiKey, setApiKey] = React.useState('');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [organisation, setOrganisation] = React.useState('');
    const [description, setDescription] = React.useState('');
  const { toast: useToastHook } = useToast()
    const { apiKeys, addApiKey } = useApiKeyContext();

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleChangeApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

    const handleChangeOrganisation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrganisation(event.target.value);
    };

    const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
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
            description: description,
        };

        // Update the state with the new API key
        addApiKey(newApiKey);

        // Clear the input fields
        setApiKey('');
        setOrganisation('');
            setDescription('');

        // Show a success message
        useToastHook({
            title: "Success",
            description: "API Key saved."
        });
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
          </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter a description for the API key"
                    value={description}
                    onChange={handleChangeDescription}
                />
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
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </CardContent>
      </Card>

        {apiKeys.length > 0 && (
            <Card className="w-[80%] mx-auto mt-8">
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>List of saved API keys.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {apiKeys.map((key) => (
                            <div key={key.id} className="border rounded-md p-4">
                                <p><strong>Organisation:</strong> {key.organisation}</p>
                                <p><strong>Project:</strong> {key.model}</p>
                                <p><strong>API Key:</strong> {key.key}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

