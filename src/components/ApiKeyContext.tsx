"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getApiKeys, addApiKey as addApiKeyToDb, updateApiKey as updateApiKeyInDb, deleteApiKey as deleteApiKeyFromDb } from "@/services/api-key-service";


// Define the type for the API key
interface ApiKey {
    id: string;
    provider: string;
    model: string;
    key: string;
    userId: string;
    isActive: boolean;
    organisation: string;
    description: string;
    apiKeyType: string;
    accountType: string;
    userOrganisation: string;
    project: string;
}

// Define the context type
interface ApiKeyContextType {
    apiKeys: ApiKey[];
    addApiKey: (apiKey: ApiKey) => void;
    updateApiKey: (id: string, apiKey: Partial<ApiKey>) => void;
    deleteApiKey: (id: string) => void;
}

// Create the context with a default value
const ApiKeyContext = createContext<ApiKeyContextType>({
    apiKeys: [],
    addApiKey: () => { },
    updateApiKey: () => { },
    deleteApiKey: () => { },
});

// Create a provider component
interface ApiKeyProviderProps {
    children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

    useEffect(() => {
        const loadApiKeys = async () => {
            try {
                const keys = await getApiKeys();
                setApiKeys(keys);
            } catch (error) {
                console.error("Failed to load API keys:", error);
            }
        };

        loadApiKeys();
    }, []);


    const addApiKey = async (apiKey: ApiKey) => {
        try {
            await addApiKeyToDb(apiKey);
            setApiKeys(prevKeys => [...prevKeys, apiKey]);
        } catch (error) {
            console.error("Error adding API key:", error);
        }
    };

    const updateApiKey = async (id: string, apiKey: Partial<ApiKey>) => {
        try {
            await updateApiKeyInDb(id, apiKey);
            setApiKeys(prevKeys =>
                prevKeys.map(key =>
                    key.id === id ? { ...key, ...apiKey } : key
                )
            );
        } catch (error) {
            console.error("Error updating API key:", error);
        }
    };

    const deleteApiKey = async (id: string) => {
        try {
            await deleteApiKeyFromDb(id);
            setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
        } catch (error) {
            console.error("Error deleting API key:", error);
        }
    };


    return (
        <ApiKeyContext.Provider value={{ apiKeys, addApiKey, updateApiKey, deleteApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

// Create a hook to use the context
export const useApiKeyContext = () => useContext(ApiKeyContext);
