"use client";

import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Slider} from '@/components/ui/slider';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import ActivitySuggestions from "@/components/ActivitySuggestions";

const activityConfigSchema = z.object({
    ageGroup: z.string(),
    indoorOutdoor: z.string(),
    weather: z.string(),
    timeAvailable: z.number(),
    ersteGedanken: z.string(),
});

export default function ActivityKonfigurator() {
    const [activity, setActivity] = useState<any>(null);

    const form = useForm<z.infer<typeof activityConfigSchema>>({
        resolver: zodResolver(activityConfigSchema),
        defaultValues: {
            ageGroup: "",
            indoorOutdoor: "",
            weather: "",
            timeAvailable: 60,
            ersteGedanken: "",
        },
    });

    async function onSubmit(values: z.infer<typeof activityConfigSchema>) {
        console.log(values);

        // Simuliere generierte Vorschläge
        const mockSuggestions = [
            {
                id: "1",
                title: "Kreatives Malen",
                description: "Ein entspannendes Malerlebnis.",
                instructions: "Verschiedene Maltechniken ausprobieren.",
                materials: ["Farben", "Pinsel", "Papier"],
                costEstimate: 10,
                safetyTips: "Auf gute Belüftung achten.",
                benefits: ["Kreativität", "Entspannung"],
                imageUrl: "https://picsum.photos/200/300",
                createdBy: "user123",
                generatedBy: "GPT-3",
                createdAt: new Date().toISOString(),
            },
            {
                id: "2",
                title: "Gemeinsames Kochen",
                description: "Ein lustiges Kocherlebnis.",
                instructions: "Einfaches Rezept auswählen.",
                materials: ["Zutaten", "Kochutensilien"],
                costEstimate: 15,
                safetyTips: "Auf Hygiene achten.",
                benefits: ["Teamwork", "Kochen lernen"],
                imageUrl: "https://picsum.photos/200/300",
                createdBy: "user456",
                generatedBy: "GPT-3",
                createdAt: new Date().toISOString(),
            },
        ];
        setActivity(mockSuggestions);
    }

    return (
        <div>
            <Card className="w-[80%] mx-auto">
                <CardHeader>
                    <CardTitle>Konfigurator</CardTitle>
                    <CardDescription>Konfiguriere die Parameter für die Aktivitätsvorschläge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="ageGroup"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Altersgruppe</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Wähle eine Altersgruppe"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Kleinkind">Kleinkind</SelectItem>
                                                <SelectItem value="Vorschulkind">Vorschulkind</SelectItem>
                                                <SelectItem value="Grundschulkind">Grundschulkind</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Bitte wähle die Altersgruppe deines Kindes aus.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="indoorOutdoor"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Ort</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Wähle einen Ort"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Drinnen">Drinnen</SelectItem>
                                                <SelectItem value="Draußen">Draußen</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Bitte wähle den Ort der Aktivität.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weather"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Wetter</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Wähle das Wetter"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Sonnig">Sonnig</SelectItem>
                                                <SelectItem value="Regnerisch">Regnerisch</SelectItem>
                                                <SelectItem value="Bewölkt">Bewölkt</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Bitte wähle das aktuelle Wetter aus.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timeAvailable"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Verfügbare Zeit (Minuten)</FormLabel>
                                        <FormControl>
                                            <Slider
                                                defaultValue={[field.value]}
                                                max={180}
                                                min={15}
                                                step={15}
                                                onValueChange={(value) => field.onChange(value[0])}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Bitte gib die verfügbare Zeit in Minuten an (15-180).
                                        </FormDescription>
                                        <FormMessage/>
                                        <Label className={cn("text-sm text-muted-foreground ml-1 mt-1")}>
                                            {form.getValues("timeAvailable")} Minuten
                                        </Label>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ersteGedanken"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Erste Gedanken - Freitext</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Hier kannst du deine ersten Gedanken und Ideen notieren." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Teile uns deine ersten Ideen und Gedanken mit, um die Vorschläge noch besser zu machen.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Konfiguration speichern</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            {activity && (
                <ActivitySuggestions suggestions={activity} />
            )}
        </div>
    );
}
