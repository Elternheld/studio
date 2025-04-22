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
  const [altersgruppe, setAltersgruppe] = useState('');
  const [drinnenDraussen, setDrinnenDraussen] = useState('');
  const [wetter, setWetter] = useState('');
  const [verfuegbareZeit, setVerfuegbareZeit] = useState('');
  const [llmModell, setLlmModell] = useState('');
    const [ersteGedanken, setErsteGedanken] = useState('');

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
                generatedBy: llmModell || 'DefaultModel',
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
            altersgruppe,
            drinnenDraussen,
            wetter,
            verfuegbareZeit,
            llmModell,
        });
        // Here you would typically make an API call to save the configuration to a database
        handleGenerateSuggestions()
    };

    const handleGenerateSuggestions = async () => {
        try {
            const result = await brainstormActivityIdeas({
                voiceInput: `${voiceInput}.
                Consider these parameters: Altersgruppe: ${altersgruppe}, Drinnen/Draußen: ${drinnenDraussen}, Wetter: ${wetter}, Verfügbare Zeit: ${verfuegbareZeit}, LLM Modell: ${llmModell}. Erste Gedanken: ${ersteGedanken}`
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
                    generatedBy: llmModell || 'DefaultModel',
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
            <h3 className="text-xl font-semibold mt-4">Konfigurator</h3>
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="altersgruppe">Altersgruppe</Label>
                    <Input
                        type="text"
                        id="altersgruppe"
                        placeholder="Gib die Altersgruppe ein"
                        value={altersgruppe}
                        onChange={(e) => setAltersgruppe(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="drinnenDraussen">Drinnen/Draußen</Label>
                    <Input
                        type="text"
                        id="drinnenDraussen"
                        placeholder="Gib Drinnen/Draußen ein"
                        value={drinnenDraussen}
                        onChange={(e) => setDrinnenDraussen(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="wetter">Wetter</Label>
                    <Input
                        type="text"
                        id="wetter"
                        placeholder="Gib das Wetter ein"
                        value={wetter}
                        onChange={(e) => setWetter(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="verfuegbareZeit">Verfügbare Zeit</Label>
                    <Input
                        type="text"
                        id="verfuegbareZeit"
                        placeholder="Gib die verfügbare Zeit ein"
                        value={verfuegbareZeit}
                        onChange={(e) => setVerfuegbareZeit(e.target.value)}
                    />
                </div>
                  <div>
                      <Label htmlFor="ersteGedanken">Erste Gedanken - Freitext</Label>
                      <Textarea
                          id="ersteGedanken"
                          placeholder="Gib deine ersten Gedanken ein"
                          value={ersteGedanken}
                          onChange={(e) => setErsteGedanken(e.target.value)}
                      />
                  </div>
                <div>
                    <Label htmlFor="llmModell">LLM Modell</Label>
                    <Input
                        type="text"
                        id="llmModell"
                        placeholder="Gib das LLM Modell ein"
                        value={llmModell}
                        onChange={(e) => setLlmModell(e.target.value)}
                    />
                </div>
                <Button onClick={handleSaveConfig}>Konfiguration speichern</Button>
            </div>
            

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
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToTextBrainstorming;
