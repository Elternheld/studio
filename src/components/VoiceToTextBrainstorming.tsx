"use client";

import {generateActivityIdea} from "@/ai/flows/generate-activity-idea";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import React, {useState} from "react";

const VoiceToTextBrainstorming = () => {
    const [altersgruppe, setAltersgruppe] = useState('');
    const [drinnenDraussen, setDrinnenDraussen] = useState('');
    const [wetter, setWetter] = useState('');
    const [verfuegbareZeit, setVerfuegbareZeit] = useState('');
    const [llmModell, setLlmModell] = useState('');

    const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState('');


    return (
        <div>
        </div>
    );
};

export default VoiceToTextBrainstorming;
