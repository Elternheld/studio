"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { useApiKeyContext } from "@/components/ApiKeyContext";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {pingApiKey} from "@/services/api-key-service";

export default function ApiManagerPage() {
  const [apiKey, setApiKey] = React.useState('');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [organisation, setOrganisation] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [project, setProject] = React.useState('');
  const { toast: useToastHook } = useToast()
    const { apiKeys, addApiKey, deleteApiKey } = useApiKeyContext();
    const [visibleKeys, setVisibleKeys] = React.useState<{ [key: string]: boolean }>({});
    const [selectedApiKey, setSelectedApiKey] = React.useState<string | undefined>(undefined);
    const [pingResult, setPingResult] = React.useState<{ time: number | null, active: boolean | null }>({
        time: null,
        active: null
    });


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

    const handleChangeProject = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProject(event.target.value);
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
            model: project, // You might want to add a model selection field
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
            setProject('');

        // Show a success message
        useToastHook({
            title: "Success",
            description: "API Key saved."
        });
    };

    const handleDeleteApiKey = (id: string) => {
        deleteApiKey(id);
        useToastHook({
            title: "Success",
            description: "API Key deleted."
        });
    };

    const toggleApiKeyVisibility = (id: string) => {
        setVisibleKeys(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handlePingApiKey = async () => {
        if (!selectedApiKey) {
            useToastHook({
                title: "Error",
                description: "No API Key selected.",
                variant: "destructive",
            });
            return;
        }

        const startTime = performance.now();
        const isActive = await pingApiKey(selectedApiKey);
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        setPingResult({
            time: timeTaken,
            active: isActive,
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
                <Label htmlFor="project">Project</Label>
                <Input
                    type="text"
                    id="project"
                    placeholder="Enter name of project"
                    value={project}
                    onChange={handleChangeProject}
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
                        {apiKeys.map((key) => {
                            const isVisible = visibleKeys[key.id] ?? false;

                            return (
                                <div key={key.id} className="border rounded-md p-4 flex items-center justify-between">
                                    <div>
                                        <p><strong>Organisation:</strong> {key.organisation}</p>
                                        <p><strong>Project:</strong> {key.model}</p>
                                        <p>
                                            <strong>API Key:</strong>
                                            {isVisible ? key.key : '********************'}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleApiKeyVisibility(key.id)}
                                                className="inline-block ml-2"
                                            >
                                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteApiKey(key.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        )}

        <Card className="w-[80%] mx-auto mt-8">
            <CardHeader>
                <CardTitle>API Test</CardTitle>
                <CardDescription>Test the connectivity of your API keys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="apiKey">Select API Key</Label>
                    <Select onValueChange={setSelectedApiKey}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an API Key" />
                        </SelectTrigger>
                        <SelectContent>
                            {apiKeys.map((key) => (
                                <SelectItem key={key.id} value={key.key}>
                                    {key.organisation} - {key.model}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handlePingApiKey}>Ping API</Button>
                {pingResult.time !== null && (
                    <div>
                        <p>Ping Time: {pingResult.time.toFixed(2)} ms</p>
                        <p>Status: {pingResult.active ? "Active" : "Inactive"}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}



