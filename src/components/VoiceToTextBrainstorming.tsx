"use client";

import React, { useState } from 'react';
import { brainstormActivityIdeas, BrainstormActivityIdeasInput } from '@/ai/flows/brainstorm-activity-ideas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from "lucide-react";

const VoiceToTextBrainstorming = () => {
  const [voiceInput, setVoiceInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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
          <p>In Kürze verfügbar...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToTextBrainstorming;
