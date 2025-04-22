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

export async function pingApiKey(apiKey: string): Promise<boolean> {
  // Replace with actual API ping logic
  // This is a placeholder to simulate an API ping
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = apiKey.startsWith('sk-'); // OpenAI keys start with "sk-"
      resolve(isSuccess);
    }, 1000);
  });
};
