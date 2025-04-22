"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

const ApiManagerPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [organisation, setOrganisation] = useState('');
  const { toast } = useToast()

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
            toast({
                title: "Error",
                description: "API Key and Organisation cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        // TODO: save api key
        toast({
            title: "Success",
            description: "API Key saved."
        })
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
                placeholder="Enter your Organisation"
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
          <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagerPage;
