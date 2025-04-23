"use client";

import {generateActivityIdea} from "@/ai/flows/generate-activity-idea";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import React, {useState, useRef, useEffect} from "react";
import {useToast} from "@/hooks/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {Activity} from "lucide-react";

const VoiceToTextBrainstorming = () => {
    const [altersgruppe, setAltersgruppe] = useState('');
    const [drinnenDraussen, setDrinnenDraussen] = useState('');
    const [wetter, setWetter] = useState('');
    const [verfuegbareZeit, setVerfuegbareZeit] = useState('');
    const [llmModell, setLlmModell] = useState('');

    const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { toast } = useToast();


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
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = handleDataAvailable;
            mediaRecorder.current.onstop = handleStop;
            mediaRecorder.current.start();
            audioChunks.current = [];
            console.log('Recording started');
        } catch (err:any) {
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
        const audioBlobber = new Blob(audioChunks.current, {type: 'audio/wav'});
        setAudioBlob(audioBlobber);
        setTranscription('Transcribing...'); // Initial feedback
        transcribeAudio(audioBlobber);
    };


    const transcribeAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        try {
            // const response = await fetch('/api/transcribe', {  // Replace with your API endpoint
            //     method: 'POST',
            //     body: formData,
            // });
            //
            // if (!response.ok) {
            //     throw new Error(`Transcription failed: ${response.statusText}`);
            // }
            //
            // const data = await response.json();
            // setTranscription(data.transcription);
            setTranscription('Fake transcription');
        } catch (error:any) {
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
                    <Textarea type="text" value={transcription} readOnly/>
                </div>
            )}
            {audioBlob && (
                <audio controls src={URL.createObjectURL(audioBlob)}/>
            )}
        </div>
    );
};

export default VoiceToTextBrainstorming;
