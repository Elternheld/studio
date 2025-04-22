"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import {
    getContents,
    addContent as addContentToDb,
    updateContent as updateContentInDb,
    deleteContent as deleteContentFromDb,
} from "@/services/content-service";

// Define the type for the content
interface Content {
    id: string;
    title: string;
    description: string;
    body: string;
}

export default function ContentPage() {
    const [contents, setContents] = useState<Content[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [body, setBody] = useState('');
    const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const loadContents = async () => {
            const initialContents = await getContents();
            setContents(initialContents);
        };

        loadContents();
    }, []);

    const handleAddContent = async () => {
        if (!title || !description || !body) {
            toast({
                title: "Error",
                description: "Title, Description, and Body cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        const newContent: Content = {
            id: String(Date.now()), // Ideally, use a proper ID generation
            title,
            description,
            body,
        };

        await addContentToDb(newContent);
        setContents(prevContents => [...prevContents, newContent]);
        setTitle('');
        setDescription('');
        setBody('');

        toast({
            title: "Success",
            description: "Content added."
        });
    };

    const handleUpdateContent = async () => {
        if (!selectedContentId) {
            toast({
                title: "Error",
                description: "No Content selected for update.",
                variant: "destructive",
            });
            return;
        }

        const updatedContent: Partial<Content> = {
            title,
            description,
            body,
        };

        await updateContentInDb(selectedContentId, updatedContent);
        setContents(prevContents =>
            prevContents.map(content =>
                content.id === selectedContentId ? { ...content, ...updatedContent } : content
            )
        );
        setTitle('');
        setDescription('');
        setBody('');
        setSelectedContentId(null);

        toast({
            title: "Success",
            description: "Content updated."
        });
    };

    const handleDeleteContent = async (id: string) => {
        await deleteContentFromDb(id);
        setContents(prevContents => prevContents.filter(content => content.id !== id));

        toast({
            title: "Success",
            description: "Content deleted."
        });
    };

    const handleSelectContent = (id: string) => {
        const selectedContent = contents.find(content => content.id === id);
        if (selectedContent) {
            setSelectedContentId(selectedContent.id);
            setTitle(selectedContent.title);
            setDescription(selectedContent.description);
            setBody(selectedContent.body);
        }
    };

    return (
        <div className="container py-12">
            <Card className="w-[80%] mx-auto">
                <CardHeader>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Manage all the content for your website here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="body">Body</Label>
                        <Textarea
                            id="body"
                            placeholder="Enter body content"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleAddContent}>Add Content</Button>
                        <Button variant="secondary" size="sm">Data Import via CSV</Button>
                    </div>
                    {selectedContentId && (
                        <Button onClick={handleUpdateContent}>Update Content</Button>
                    )}
                </CardContent>
            </Card>

            {contents.length > 0 && (
                <Card className="w-[80%] mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Existing Content</CardTitle>
                        <CardDescription>Manage existing content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {contents.map((content) => (
                                <div key={content.id} className="border rounded-md p-4 flex items-center justify-between">
                                    <div>
                                        <p><strong>Title:</strong> {content.title}</p>
                                        <p><strong>Description:</strong> {content.description}</p>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleSelectContent(content.id)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteContent(content.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
