"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the API key
interface ApiKey {
    id: string;
    provider: string;
    model: string;
    key: string;
    userId: string;
    isActive: boolean;
    organisation: string;
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
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
        { id: '1', provider: 'OpenAI', model: 'GPT-3', key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', userId: 'user1', isActive: true, organisation: 'OpenAI' },
        { id: '2', provider: 'Anthropic', model: 'Claude', key: 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', userId: 'user1', isActive: false, organisation: 'Anthropic' },
    ]);

    const addApiKey = (apiKey: ApiKey) => {
        setApiKeys(prevKeys => [...prevKeys, apiKey]);
    };

    const updateApiKey = (id: string, apiKey: Partial<ApiKey>) => {
        setApiKeys(prevKeys =>
            prevKeys.map(key =>
                key.id === id ? { ...key, ...apiKey } : key
            )
        );
    };

    const deleteApiKey = (id: string) => {
        setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
    };

    return (
        <ApiKeyContext.Provider value={{ apiKeys, addApiKey, updateApiKey, deleteApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

// Create a hook to use the context
export const useApiKeyContext = () => useContext(ApiKeyContext);
