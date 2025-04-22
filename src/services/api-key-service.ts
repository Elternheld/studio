"use server"

import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/db";

const API_KEYS_COLLECTION = "api_keys";

export async function getApiKeys() {
    try {
        const querySnapshot = await getDocs(collection(db, API_KEYS_COLLECTION));
        const apiKeys = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return apiKeys;
    } catch (error) {
        console.error("Error fetching API keys:", error);
        throw error;
    }
}

export async function addApiKey(apiKey: any) {
    try {
        await addDoc(collection(db, API_KEYS_COLLECTION), apiKey);
    } catch (error) {
        console.error("Error adding API key:", error);
        throw error;
    }
}

export async function updateApiKey(id: string, apiKey: any) {
    try {
        const apiKeyDoc = doc(db, API_KEYS_COLLECTION, id);
        await updateDoc(apiKeyDoc, apiKey);
    } catch (error) {
        console.error("Error updating API key:", error);
        throw error;
    }
}

export async function deleteApiKey(id: string) {
    try {
        const apiKeyDoc = doc(db, API_KEYS_COLLECTION, id);
        await deleteDoc(apiKeyDoc);
    } catch (error) {
        console.error("Error deleting API key:", error);
        throw error;
    }
}

export async function pingApiKey(apiKey: string, organisation: string): Promise<{ success: boolean, message: string, time: number }> {
    const startTime = performance.now();
    let success = false;
    let message = "Unknown Error";

    try {
        // Replace with actual API ping logic based on the organisation
        if (organisation === "OpenAI") {
            // Example for OpenAI (replace with actual OpenAI API call)
            const response = await fetch("https://api.openai.com/v1/engines", {  // Example endpoint
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                }
            });

            if (response.ok) {
                success = true;
                message = "OpenAI API is active and working.";
            } else {
                message = `OpenAI API check failed: ${response.status} - ${response.statusText}`;
            }
        } else if (organisation === "Anthropic") {
            // Example for Anthropic (replace with actual Anthropic API call)
            const response = await fetch("https://api.anthropic.com/v1/models", {  // Example endpoint
                headers: {
                    "x-api-key": apiKey,
                }
            });

            if (response.ok) {
                success = true;
                message = "Anthropic API is active and working.";
            } else {
                message = `Anthropic API check failed: ${response.status} - ${response.statusText}`;
            }
        } else if (organisation === "Google") {
             const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);


            if (response.ok) {
                success = true;
                message = "Google API is active and working.";
            } else {
                message = `Google API check failed: ${response.status} - ${response.statusText}`;
            }

        }
        else {
            message = "Unsupported organisation.  Cannot validate API key.";
        }


    } catch (error:any) {
        message = `API check failed: ${error.message}`;
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    return { success, message, time: timeTaken };
};


