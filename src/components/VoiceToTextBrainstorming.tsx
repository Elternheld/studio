"use client";

import React, { useState } from 'react';
import { brainstormActivityIdeas, BrainstormActivityIdeasInput } from '@/ai/flows/brainstorm-activity-ideas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { addActivity } from "@/services/activity-service";
import {useToast} from "@/hooks/use-toast";

interface Activity {
    id: string;
    title: string;
    description: string;
    instructions: string;
    materials: string[];
    costEstimate: number;
    safetyTips: string;
    benefits: string[];
    imageUrl: string;
    createdBy: string; // Reference to users (replace with actual user ID)
    generatedBy: string; // Model name
    createdAt: number; // Timestamp
}

const VoiceToTextBrainstorming = () => {
  const [voiceInput, setVoiceInput] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [ageGroup, setAgeGroup] = useState('');
  const [indoorOutdoor, setIndoorOutdoor] = useState('');
  const [weather, setWeather] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [llmModel, setLlmModel] = useState('');
  const { toast } = useToast();


  const handleBrainstorm = async () => {
    try {
      const result = await brainstormActivityIdeas({ voiceInput } as BrainstormActivityIdeasInput);
        if (result.suggestions && Array.isArray(result.suggestions)) {
            const newActivities = result.suggestions.map(suggestion => ({
                id: uuidv4(),
                title: 'Activity Idea', // default title
                description: suggestion, // Use suggestion as description
                instructions: '',
                materials: [],
                costEstimate: 0,
                safetyTips: '',
                benefits: [],
                imageUrl: 'https://picsum.photos/200/300', // placeholder image
                createdBy: 'user-id', // Replace with actual user ID
                generatedBy: llmModel || 'DefaultModel',
                createdAt: Date.now(),
            }));
            setActivities(newActivities);
        } else {
            console.error("Unexpected format for suggestions:", result.suggestions);
            toast({
                title: "Error",
                description: "Failed to generate activities due to unexpected format.",
                variant: "destructive",
            });
        }

    } catch (error) {
      console.error("Failed to brainstorm activities:", error);
        toast({
            title: "Error",
            description: "Failed to brainstorm activities.",
            variant: "destructive",
        });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement actual voice recording logic here using Web Speech API or a library
    // For now, it just toggles the recording state
  };

    const handleSaveConfig = async () => {
        // Implement logic to save the configuration
        console.log("Saving configuration:", {
            ageGroup,
            indoorOutdoor,
            weather,
            timeAvailable,
            llmModel,
        });
        // Here you would typically make an API call to save the configuration to a database
    };

    const handleGenerateSuggestions = async () => {
        try {
            const result = await brainstormActivityIdeas({
                voiceInput: `${voiceInput}.
                Consider these parameters: Age Group: ${ageGroup}, Indoor/Outdoor: ${indoorOutdoor}, Weather: ${weather}, Time Available: ${timeAvailable}, LLM Model: ${llmModel}`
            } as BrainstormActivityIdeasInput);

            if (result.suggestions && Array.isArray(result.suggestions)) {
                const newActivities = result.suggestions.map(suggestion => ({
                    id: uuidv4(),
                    title: 'Activity Idea', // default title
                    description: suggestion, // Use suggestion as description
                    instructions: '',
                    materials: [],
                    costEstimate: 0,
                    safetyTips: '',
                    benefits: [],
                    imageUrl: 'https://picsum.photos/200/300', // placeholder image
                    createdBy: 'user-id', // Replace with actual user ID
                    generatedBy: llmModel || 'DefaultModel',
                    createdAt: Date.now(),
                }));
                setActivities(newActivities);
            } else {
                console.error("Unexpected format for suggestions:", result.suggestions);
                toast({
                    title: "Error",
                    description: "Failed to generate activities due to unexpected format.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to brainstorm activities:", error);
            toast({
                title: "Error",
                description: "Failed to brainstorm activities.",
                variant: "destructive",
            });
        }
    };

    const handleSaveActivity = async (activity: Activity) => {
        try {
            await addActivity(activity);
            toast({
                title: "Success",
                description: "Activity saved successfully!",
            });
        } catch (error) {
            console.error("Error saving activity:", error);
            toast({
                title: "Error",
                description: "Failed to save activity.",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Brainstorming mit Sprach-Eingabe</CardTitle>
          <CardDescription>
            Nutze deine Stimme, um Ideen zu sammeln und Aktivitäten-Vorschläge zu erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold">Sprach-Eingabe</h3>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={toggleRecording}>
              {isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
              <Mic className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Deine Sprach-Eingabe wird hier angezeigt..."
            value={voiceInput}
            onChange={(e) => setVoiceInput(e.target.value)}
          />
          <Button onClick={handleBrainstorm}>Vorschläge generieren</Button>

          {activities.length > 0 && (
              <div>
                  <h3 className="text-xl font-semibold">Aktivitäten Vorschläge:</h3>
                  <ul>
                      {activities.map((activity, index) => (
                          <li key={index} className="py-2">
                              <div className="flex justify-between items-center">
                                  <span>{activity.description}</span>
                                  <Button size="sm" onClick={() => handleSaveActivity(activity)}>
                                      Save Activity
                                  </Button>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>
          )}
          <h3 className="text-xl font-semibold mt-4">Konfigurator</h3>
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="ageGroup">Age Group</Label>
                    <Input
                        type="text"
                        id="ageGroup"
                        placeholder="Enter age group"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="indoorOutdoor">Indoor/Outdoor</Label>
                    <Input
                        type="text"
                        id="indoorOutdoor"
                        placeholder="Enter indoor/outdoor"
                        value={indoorOutdoor}
                        onChange={(e) => setIndoorOutdoor(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="weather">Weather</Label>
                    <Input
                        type="text"
                        id="weather"
                        placeholder="Enter weather"
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="timeAvailable">Time Available</Label>
                    <Input
                        type="text"
                        id="timeAvailable"
                        placeholder="Enter time available"
                        value={timeAvailable}
                        onChange={(e) => setTimeAvailable(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="llmModel">LLM Model</Label>
                    <Input
                        type="text"
                        id="llmModel"
                        placeholder="Enter LLM Model"
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                    />
                </div>
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
                <Button onClick={handleGenerateSuggestions}>Vorschläge generieren</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToTextBrainstorming;
