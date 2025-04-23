"use client";

import React from "react";
import ActivityKonfigurator from "@/components/ActivityKonfigurator";
import ActivitySuggestions from "@/components/ActivitySuggestions";
import VoiceToTextBrainstorming from "@/components/VoiceToTextBrainstorming";

const UseCase1Page = () => {
    return (
        <div className="container py-12">
            <ActivityKonfigurator />
            <VoiceToTextBrainstorming/>
            <ActivitySuggestions />
        </div>
    );
};

export default UseCase1Page;
