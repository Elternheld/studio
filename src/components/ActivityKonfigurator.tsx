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
import {generateActivityIdea, GenerateActivityIdeaOutput} from "@/ai/flows/generate-activity-idea";

const activityConfigSchema = z.object({
    ageGroup: z.string().describe("The age group of the child (e.g., Kleinkind, Vorschulkind, Grundschulkind)."),
    indoorOutdoor: z.string().describe("The location type (Drinnen or Draußen)."),
    weather: z.string().describe("The weather conditions (e.g., sonnig, regnerisch, bewölkt)."),
    timeAvailable: z.number().describe("The available time in minutes."),
    ersteGedanken: z.string().optional().describe("Freitext field for initial thoughts and ideas."),
});

export default function ActivityKonfigurator() {
    const [activity, setActivity] = useState<GenerateActivityIdeaOutput | null>(null);

    const form = useForm<z.infer<typeof activityConfigSchema>>({
        resolver: zodResolver(activityConfigSchema),
        defaultValues: {
            ageGroup: "Kleinkind",
            indoorOutdoor: "Drinnen",
            weather: "Sonnig",
            timeAvailable: 60,
            ersteGedanken: "",
        },
    });

    async function onSubmit(values: z.infer<typeof activityConfigSchema>) {
        console.log(values);
        try {
            const result = await generateActivityIdea(values);
            setActivity(result);
        } catch (error) {
            console.error("Failed to generate activity:", error);
            // Handle error appropriately (e.g., display an error message)
        }
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
                <ActivitySuggestions suggestions={[activity]} />
            )}
        </div>
    );
}

