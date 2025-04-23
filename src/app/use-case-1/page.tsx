"use client";

import React from "react";
import ActivityKonfigurator from "@/components/ActivityKonfigurator";
import ActivitySuggestions from "@/components/ActivitySuggestions";
import VoiceToTextBrainstorming from "@/components/VoiceToTextBrainstorming";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const UseCase1Page = () => {
    return (
        <div className="container py-12">
            <Card className="w-[80%] mx-auto">
                <CardHeader>
                    <CardTitle>Konfigurator</CardTitle>
                    <CardDescription>Konfiguriere die Parameter für die Aktivitätsvorschläge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ActivityKonfigurator/>
                </CardContent>
            </Card>

            <Card className="w-[80%] mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Brainstorming - ElternHeld Voice Bot</CardTitle>
                    <CardDescription>Brainstorme neue Ideen mit unserem Voice Bot.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VoiceToTextBrainstorming/>
                </CardContent>
            </Card>
            <ActivitySuggestions/>
        </div>
    );
};

export default UseCase1Page;
