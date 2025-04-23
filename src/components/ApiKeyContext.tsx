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
            // Try to load from localStorage first
            const storedKeys = localStorage.getItem('apiKeys');
            if (storedKeys) {
                setApiKeys(JSON.parse(storedKeys));
            } else {
                // If not in localStorage, load from database
                const keys = await getApiKeys();
                setApiKeys(keys);
                localStorage.setItem('apiKeys', JSON.stringify(keys)); // Store in localStorage
            }
        };

        loadApiKeys();
    }, []);

    useEffect(() => {
        // Save API keys to localStorage whenever they change
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }, [apiKeys]);

    const addApiKey = async (apiKey: ApiKey) => {
        await addApiKeyToDb(apiKey);
        setApiKeys(prevKeys => [...prevKeys, apiKey]);
    };

    const updateApiKey = async (id: string, apiKey: Partial<ApiKey>) => {
        await updateApiKeyInDb(id, apiKey);
        setApiKeys(prevKeys =>
            prevKeys.map(key =>
                key.id === id ? { ...key, ...apiKey } : key
            )
        );
    };

    const deleteApiKey = async (id: string) => {
        try {
            await deleteApiKeyFromDb(id);
            setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
        } catch (error) {
            console.error("Error deleting API key:", error);
            // Optionally handle the error, e.g., show a toast notification
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
