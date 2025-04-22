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
import {Label} from "@/components/ui/label";

const VoiceToTextBrainstorming = () => {
  const [voiceInput, setVoiceInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [ageGroup, setAgeGroup] = useState('');
  const [indoorOutdoor, setIndoorOutdoor] = useState('');
  const [weather, setWeather] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [llmModel, setLlmModel] = useState('');

  const handleBrainstorm = async () => {
    try {
      const result = await brainstormActivityIdeas({ voiceInput } as BrainstormActivityIdeasInput);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to brainstorm activities:", error);
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

  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Brainstorming mit Sprach-Eingabe</CardTitle>
          <CardDescription>
            Nutze deine Stimme, um Ideen zu sammeln und Vorschläge zu erhalten.
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

          {suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">Vorschläge:</h3>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
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
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToTextBrainstorming;
