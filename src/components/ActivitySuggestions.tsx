"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {GenerateActivityIdeaOutput} from "@/ai/flows/generate-activity-idea";

interface ActivitySuggestionsProps {
    suggestions: GenerateActivityIdeaOutput[];
}

const ActivitySuggestions: React.FC<ActivitySuggestionsProps> = ({suggestions}) => {
    return (
        <div>
            {suggestions && (
                <Card className="w-[80%] mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Aktivitäten Vorschläge:</CardTitle>
                        <CardDescription>Hier sind die generierten Vorschläge basierend auf deiner Konfiguration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {suggestions.map((activity, index) => (
                            <div key={index} className="border rounded-md p-4">
                                <h3 className="text-xl font-semibold">{activity.title}</h3>
                                <p>{activity.description}</p>
                                <img src={activity.imageUrl} alt={activity.title} className="rounded-md w-full h-auto"/>
                                <div>
                                    <h4 className="text-lg font-semibold">Materialien</h4>
                                    <ul>
                                        {activity.materials.map((material, index) => (
                                            <li key={index}>{material}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Anleitung</h4>
                                    <p>{activity.instructions}</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Sicherheitstipps</h4>
                                    <p>{activity.safetyTips}</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Pädagogische Vorteile</h4>
                                    <ul>
                                        {activity.educationalBenefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                                <p>Geschätzte Kosten: ${activity.costEstimate}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ActivitySuggestions;
