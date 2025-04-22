"use server"

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/db";

const ACTIVITIES_COLLECTION = "activities";

export async function addActivity(activity: any) {
    try {
        await addDoc(collection(db, ACTIVITIES_COLLECTION), activity);
    } catch (error) {
        console.error("Error adding activity:", error);
        throw error;
    }
}
