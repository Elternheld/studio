"use server"

import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/db";

const CONTENTS_COLLECTION = "contents";

export async function getContents() {
    try {
        const querySnapshot = await getDocs(collection(db, CONTENTS_COLLECTION));
        const contents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return contents;
    } catch (error) {
        console.error("Error fetching contents:", error);
        throw error;
    }
}

export async function addContent(content: any) {
    try {
        await addDoc(collection(db, CONTENTS_COLLECTION), content);
    } catch (error) {
        console.error("Error adding content:", error);
        throw error;
    }
}

export async function updateContent(id: string, content: any) {
    try {
        const contentDoc = doc(db, CONTENTS_COLLECTION, id);
        await updateDoc(contentDoc, content);
    } catch (error) {
        console.error("Error updating content:", error);
        throw error;
    }
}

export async function deleteContent(id: string) {
    try {
        const contentDoc = doc(db, CONTENTS_COLLECTION, id);
        await deleteDoc(contentDoc);
    } catch (error) {
        console.error("Error deleting content:", error);
        throw error;
    }
}
