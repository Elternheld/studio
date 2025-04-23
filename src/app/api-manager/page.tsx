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

const AVAILABLE_ORGANISATIONS = [
    "OpenAI",
    "Anthropic",
    "Google",
    "AssemblyAI",
]

const LLM_MODELS = {
    OpenAI: ["gpt-3.5-turbo", "gpt-4", "gpt-4o"],
    Anthropic: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    Google: ["gemini-1.5-pro-latest", "gemini-1.0-pro-latest", "gemini-2.0-flash"],
    AssemblyAI: [], // AssemblyAI does not have LLM models
};

const API_KEY_TYPES = ["LLM-Model", "3rd Party Provider"]

const ACCOUNT_TYPES = ["Service Account", "Customer Account", "Admin Account"]

export default function ApiManagerPage() {
  const [apiKey, setApiKey] = React.useState('');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [organisation, setOrganisation] = React.useState('');
  const [description, setDescription] = React.useState('');
    const [llmModel, setLlmModel] = React.useState('');
    const [user, setUser] = React.useState('');
  const { toast: useToastHook } = useToast()
    const { apiKeys, addApiKey, updateApiKey, deleteApiKey } = useApiKeyContext();
    const [visibleKeys, setVisibleKeys] = React.useState<{ [key: string]: boolean }>({});
    const [selectedApiKey, setSelectedApiKey] = React.useState<string | undefined>(undefined);
    const [pingResult, setPingResult] = React.useState<{ time: number | null, active: boolean | null }>({
        time: null,
        active: null
    });

    const [apiKeyType, setApiKeyType] = React.useState('');
    const [accountType, setAccountType] = React.useState('');
    const [userOrganisation, setUserOrganisation] = React.useState('');


  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleChangeApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

    const handleChangeOrganisation = (value: string) => {
        setOrganisation(value);
        setLlmModel(''); // Reset LLM model when organization changes
    };

    const handleChangeApiKeyType = (value: string) => {
        setApiKeyType(value);
        setLlmModel('');
    };

    const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleChangeLlmModel = (value: string) => {
        setLlmModel(value);
    };

    const handleChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    };

    const handleChangeAccountType = (value: string) => {
        setAccountType(value);
    };

    const handleChangeUserOrganisation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserOrganisation(event.target.value);
    };


    const handleSaveApiKey = async () => {
        if (!apiKey || !organisation  || !user || !userOrganisation) {
            useToastHook({
                title: "Error",
                description: "Please fill in all the required fields.",
                variant: "destructive",
            });
            return;
        }

        const newApiKey = {
            id: String(Date.now()), // Generate a unique ID (not ideal, but works without a database)
            provider: organisation,
            model: llmModel,
            key: apiKey,
            userId: user,
            isActive: true,
            organisation: organisation,
            description: description,
            apiKeyType: apiKeyType,
            accountType: accountType,
            userOrganisation: userOrganisation
        };

        try {
            await addApiKey(newApiKey);
            useToastHook({
                title: "Success",
                description: "API Key saved successfully.",
            });
        } catch (error: any) {
            console.error("Error saving API key:", error);
            useToastHook({
                title: "Error",
                description: `Failed to save API key: ${error.message}`,
                variant: "destructive",
            });
            return;
        }

        // Clear all input fields
        setApiKey('');
        setShowApiKey(false);
        setOrganisation('');
        setDescription('');
        setLlmModel('');
        setUser('');
        setApiKeyType('');
        setAccountType('');
        setUserOrganisation('');
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
        const isActive = await pingApiKey(selectedApiKey, organisation);
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        setPingResult({
            time: timeTaken,
            active: isActive.success,
        });

        useToastHook({
            title: "API Test",
            description: isActive.message,
         });
    };

    const handleApiKeySelection = (apiKeyToSelect: string) => {
        const selectedKey = apiKeys.find(key => key.key === apiKeyToSelect);
        if (selectedKey) {
            setSelectedApiKey(selectedKey.key);
            setApiKey(selectedKey.key);
            setOrganisation(selectedKey.organisation);
            setDescription(selectedKey.description);
            setLlmModel(selectedKey.model);
            setUser(selectedKey.userId);
            setApiKeyType(selectedKey.apiKeyType);
            setAccountType(selectedKey.accountType);
            setUserOrganisation(selectedKey.userOrganisation);
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
            <Label htmlFor="organisation">Service Provider</Label>
              <Select onValueChange={handleChangeOrganisation} value={organisation}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a Service Provider" />
                  </SelectTrigger>
                  <SelectContent>
                      {AVAILABLE_ORGANISATIONS.map((org) => (
                          <SelectItem key={org} value={org}>
                              {org}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>

            {organisation !== '' && (
                <div>
                    <Label htmlFor="apiKeyType">Type of API Key</Label>
                    <Select onValueChange={handleChangeApiKeyType} value={apiKeyType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select API Key Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {API_KEY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {apiKeyType === 'LLM-Model' && organisation !== '' && (
                <div>
                    <Label htmlFor="llmModel">LLM Model</Label>
                    <Select onValueChange={handleChangeLlmModel} value={llmModel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an LLM Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {LLM_MODELS[organisation as keyof typeof LLM_MODELS]?.map((model) => (
                                <SelectItem key={model} value={model}>
                                    {model}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div>
                <Label htmlFor="user">User</Label>
                <Input
                    type="text"
                    id="user"
                    placeholder="Enter name of user"
                    value={user}
                    onChange={handleChangeUser}
                />
            </div>

            <div>
                <Label htmlFor="userOrganisation">User Organisation</Label>
                <Input
                    type="text"
                    id="userOrganisation"
                    placeholder="Enter name of user organisation"
                    value={userOrganisation}
                    onChange={handleChangeUserOrganisation}
                />
            </div>

            <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select onValueChange={handleChangeAccountType} value={accountType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {ACCOUNT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                                        <p><strong>Service Provider:</strong> {key.organisation}</p>
                                        <p><strong>Type:</strong> {key.apiKeyType}</p>
                                        {key.apiKeyType === 'LLM-Model' && (
                                            <p><strong>LLM Model:</strong> {key.model}</p>
                                        )}
                                        <p><strong>User:</strong> {key.userId}</p>
                                        <p><strong>User Organisation:</strong> {key.userOrganisation}</p>
                                        <p><strong>Account Type:</strong> {key.accountType}</p>
                                        <p>
                                            <strong>API Key:</strong>
                                            {isVisible ? key.key : "*".repeat(10)}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleApiKeyVisibility(key.id)}
                                            >
                                                {isVisible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                            </Button>
                                        </p>
                                        <p><strong>Description:</strong> {key.description}</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteApiKey(key.id)}
                                    >
                                        <Trash className="h-4 w-4"/>
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
                <CardDescription>Select an API key to test the connection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Label htmlFor="selectApiKey">Select API Key</Label>
                    <Select onValueChange={handleApiKeySelection}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an API Key to test" />
                        </SelectTrigger>
                        <SelectContent>
                            {apiKeys.map((key) => (
                                <SelectItem key={key.id} value={key.key}>
                                    {key.organisation} - {key.model}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePingApiKey}>Test API Key</Button>
 
                 {pingResult.active !== null && (
                     <div>
                         <p>API Status: {pingResult.active ? "Active" : "Inactive"}</p>
                         {pingResult.active && <p>Response Time: {pingResult.time?.toFixed(2)} ms</p>}
                     </div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}
