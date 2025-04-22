"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GenerateActivityIdeaInput, generateActivityIdea } from '@/ai/flows/generate-activity-idea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const activityFormSchema = z.object({
  childAge: z.number().min(0).max(12),
  locationType: z.enum(['indoor', 'outdoor']),
  weatherDescription: z.string().optional(),
  availableTime: z.number().min(15).max(180),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

export default function ActivityGenerator() {
  const [activity, setActivity] = useState<any>(null);

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      childAge: 5,
      locationType: 'indoor',
      availableTime: 60,
    },
  });

  async function onSubmit(values: z.infer<typeof activityFormSchema>) {
    try {
      const result = await generateActivityIdea(values as GenerateActivityIdeaInput);
      setActivity(result);
    } catch (error) {
      console.error("Failed to generate activity:", error);
      // Optionally set an error state to display to the user
    }
  }

  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Aktivitäts-Generator</CardTitle>
          <CardDescription>Fülle die Details aus, um eine Aktivität zu generieren.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="childAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alter des Kindes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Alter in Jahren" {...field} />
                    </FormControl>
                    <FormDescription>Bitte gib das Alter deines Kindes an.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ort</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle einen Ort" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="indoor">Drinnen</SelectItem>
                        <SelectItem value="outdoor">Draußen</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Bitte wähle den Ort der Aktivität.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weatherDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wetter</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Beschreibe das Wetter (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Beschreibe das Wetter, um die Aktivität besser anzupassen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableTime"
                render={({ field }) => (
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
                    <FormMessage />
                    <Label className={cn("text-sm text-muted-foreground ml-1 mt-1")}>
                      {form.getValues("availableTime")} Minuten
                    </Label>
                  </FormItem>
                )}
              />

              <Button type="submit">Aktivität generieren</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {activity && (
        <Card className="w-[80%] mx-auto mt-8">
          <CardHeader>
            <CardTitle>{activity.title}</CardTitle>
            <CardDescription>{activity.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <img src={activity.imageUrl} alt={activity.title} className="rounded-md w-full h-auto" />
            <div>
              <h3 className="text-xl font-semibold">Materialien</h3>
              <ul>
                {activity.materials.map((material: string, index: number) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Anleitung</h3>
              <p>{activity.instructions}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Sicherheitstipps</h3>
              <p>{activity.safetyTips}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Pädagogische Vorteile</h3>
              <ul>
                {activity.educationalBenefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <p>Geschätzte Kosten: ${activity.costEstimate}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
