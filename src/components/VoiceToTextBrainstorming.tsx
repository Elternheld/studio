"use client";

import { generateActivityIdea } from "@/ai/flows/generate-activity-idea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useEffect } from "react";
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
    const [assembly, setAssembly] = useState<any>(null);


    useEffect(() => {
        const loadAssemblyAI = async () => {
            const assemblyApiKey = apiKeys.find(key => key.organisation === "AssemblyAI")?.key || "";
            if (!assemblyApiKey) {
                toast({
                    title: "Error",
                    description: "No AssemblyAI API key found. Please add in API Manager.",
                    variant: "destructive",
                });
                return;
            }

            try {
                const assemblyModule = await import('@assemblyai/node');
                const assemblyClient = assemblyModule.default({
                    apiKey: assemblyApiKey,
                });
                setAssembly(() => assemblyClient);
            } catch (error) {
                console.error("Error importing AssemblyAI:", error);
                toast({
                    title: "Error",
                    description: `Error importing AssemblyAI: ${(error as Error).message}`,
                    variant: "destructive",
                });
            }
        };

        loadAssemblyAI();
    }, [apiKeys, toast]);

    useEffect(() => {
        if (recording) {
            startRecording();
        } else {
            stopRecording();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = handleDataAvailable;
            mediaRecorder.current.onstop = handleStop;
            mediaRecorder.current.start();
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
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
            console.log('Recording stopped');
        }
    };

    const handleDataAvailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
    };

    const handleStop = () => {
        const audioBlobber = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlobber);
        setTranscription('Transcribing...'); // Initial feedback
        transcribeAudio(audioBlobber);
    };


    const transcribeAudio = async (blob: Blob) => {
        if (!assembly) {
            toast({
                title: "Error",
                description: "AssemblyAI not initialized. Please check your API key.",
                variant: "destructive",
            });
            setTranscription('Transcription failed: AssemblyAI not initialized.');
            return;
        }

        const file = new File([blob], "recording.wav");

        try {
            assembly.transcribe({
                audio: file,
            })
                .then((transcript: { text: string; }) => {
                    console.log("Transcript:", transcript);
                    setTranscription(transcript.text || 'No transcription available.');
                })
                .catch((error: any) => {
                    console.error("Error transcribing audio:", error);
                    setTranscription('Transcription failed.');
                    toast({
                        title: "Error",
                        description: `Transcription failed: ${error.message}`,
                        variant: "destructive",
                    });
                });


        } catch (error: any) {
            console.error('Transcription error:', error);
            setTranscription('Transcription failed.');
            toast({
                title: "Error",
                description: `Transcription failed: ${error.message}`,
                variant: "destructive",
            });
        }
    };


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
