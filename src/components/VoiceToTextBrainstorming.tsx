"use client";

import { generateActivityIdea } from "@/ai/flows/generate-activity-idea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "lucide-react";
import { useApiKeyContext } from "@/components/ApiKeyContext";

const VoiceToTextBrainstorming = () => {
    const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { toast } = useToast();
    const { apiKeys } = useApiKeyContext();
    const [geminiApiKey, setGeminiApiKey] = useState<string>('');


    useEffect(() => {
        const loadGeminiApiKey = async () => {
            const key = apiKeys.find(key => key.organisation === "Google")?.key || "";
            setGeminiApiKey(key);

            if (!key) {
                toast({
                    title: "Error",
                    description: "No Google API key found. Please add in API Manager.",
                    variant: "destructive",
                });
            }
        };

        loadGeminiApiKey();
    }, [apiKeys, toast]);

    useEffect(() => {
        if (recording) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [recording]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = handleDataAvailable;
            mediaRecorder.current.onstop = handleStop;
            audioRecorder.current.start();
            audioChunks.current = [];
            console.log('Recording started');
        } catch (err: any) {
            console.error('Error accessing microphone:', err);
            toast({
                title: "Error",
                description: `Error accessing microphone: ${err.message}`,
                variant: "destructive",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
            console.log('Recording stopped');
        }
    }, []);

    const handleDataAvailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
    };

    const handleStop = useCallback(() => {
        const audioBlobber = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlobber);
        setTranscription('Transcribing...'); // Initial feedback
        transcribeAudio(audioBlobber);
    }, []);

    const transcribeAudio = useCallback(async (blob: Blob) => {
        if (!geminiApiKey) {
            toast({
                title: "Error",
                description: "Gemini API key not found. Please check your API key.",
                variant: "destructive",
            });
            setTranscription('Transcription failed: Gemini API key not initialized.');
            return;
        }

        const file = new File([blob], "recording.wav");

        try {
            // Here you would implement the logic to send the audio file
            // to the Gemini API for transcription.
            // This is a placeholder - replace with your actual Gemini API call.
            const response = await fetch("/api/transcribe", {
                method: "POST",
                headers: {
                    "Content-Type": "audio/wav",
                    "x-api-key": geminiApiKey,
                },
                body: file,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Transcript:", data);
            setTranscription(data.transcription || 'No transcription available.');

        } catch (error: any) {
            console.error('Transcription error:', error);
            setTranscription('Transcription failed.');
            toast({
                title: "Error",
                description: `Transcription failed: ${error.message}`,
                variant: "destructive",
            });
        }
    }, [geminiApiKey, toast]);

    const toggleRecording = () => {
        setRecording(!recording);
    };

    return (
        <div>
            <Label className="text-xl font-semibold">Brainstorming - ElternHeld Voice Bot</Label>
            <div>
                <Button variant="outline" onClick={toggleRecording}>
                    {recording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
                    <Activity className="ml-2 h-4 w-4" />
                </Button>
            </div>
            {transcription && (
                <div>
                    <Label>Transkription</Label>
                    <Textarea type="text" value={transcription} readOnly />
                </div>
            )}
            {audioBlob && (
                <audio controls src={URL.createObjectURL(audioBlob)} />
            )}
        </div>
    );
};

export default VoiceToTextBrainstorming;
