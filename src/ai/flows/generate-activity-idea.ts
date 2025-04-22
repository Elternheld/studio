// src/ai/flows/generate-activity-idea.ts
'use server';
/**
 * @fileOverview Generates activity ideas based on child's age, location, weather, and available time.
 *
 * - generateActivityIdea - A function that generates activity ideas.
 * - GenerateActivityIdeaInput - The input type for the generateActivityIdea function.
 * - GenerateActivityIdeaOutput - The return type for the generateActivityIdea function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Weather, getWeather} from '@/services/weather';

const GenerateActivityIdeaInputSchema = z.object({
  ageGroup: z.string().describe('The age group of the child (e.g., Kleinkind, Vorschulkind, Grundschulkind).'),
  indoorOutdoor: z.string().describe('The location type (Drinnen or Draußen).'),
  weather: z.string().describe('The weather conditions (e.g., sonnig, regnerisch, bewölkt).'),
  timeAvailable: z.number().describe('The available time in minutes.'),
  ersteGedanken: z.string().optional().describe('Freitext field for initial thoughts and ideas.'),
});
export type GenerateActivityIdeaInput = z.infer<typeof GenerateActivityIdeaInputSchema>;

const GenerateActivityIdeaOutputSchema = z.object({
  title: z.string().describe('The title of the activity.'),
  description: z.string().describe('A brief description of the activity.'),
  instructions: z.string().describe('Step-by-step instructions for the activity.'),
  materials: z.array(z.string()).describe('A list of materials needed for the activity.'),
  costEstimate: z.number().describe('The estimated cost of the activity in USD.'),
  safetyTips: z.string().describe('Important safety tips for the activity.'),
  educationalBenefits: z.array(z.string()).describe('The educational benefits of the activity.'),
  imageUrl: z.string().describe('A URL of an image representing the activity. Use https://picsum.photos/200/300 for placeholder'),
});
export type GenerateActivityIdeaOutput = z.infer<typeof GenerateActivityIdeaOutputSchema>;

export async function generateActivityIdea(input: GenerateActivityIdeaInput): Promise<GenerateActivityIdeaOutput> {
  return generateActivityIdeaFlow(input);
}

const generateActivityPrompt = ai.definePrompt({
  name: 'generateActivityPrompt',
  input: {
    schema: z.object({
      ageGroup: z.string().describe('The age group of the child (e.g., Kleinkind, Vorschulkind, Grundschulkind).'),
      indoorOutdoor: z.string().describe('The location type (Drinnen or Draußen).'),
      weather: z.string().describe('The weather conditions (e.g., sonnig, regnerisch, bewölkt).'),
      timeAvailable: z.number().describe('The available time in minutes.'),
      ersteGedanken: z.string().optional().describe('Freitext field for initial thoughts and ideas.'),
    }),
  },
  output: {
    schema: GenerateActivityIdeaOutputSchema,
  },
  prompt: `You are a creative activity planner for children.

  Generate an engaging activity idea based on the following criteria:
  - Age Group: {{ageGroup}}
  - Location: {{indoorOutdoor}}
  - Weather: {{weather}}
  - Available Time: {{timeAvailable}} minutes
  - Additional Notes: {{ersteGedanken}}

  The response should contain:
  - A title for the activity.
  - A brief description of the activity.
  - Step-by-step instructions for the activity.
  - A list of materials needed for the activity.
  - An estimated cost of the activity in USD.
  - Important safety tips for the activity.
  - A list of educational benefits of the activity.
  - A URL of an image representing the activity. Use https://picsum.photos/200/300 for placeholder
`,
});

const generateActivityIdeaFlow = ai.defineFlow<
  typeof GenerateActivityIdeaInputSchema,
  typeof GenerateActivityIdeaOutputSchema
>(
  {
    name: 'generateActivityIdeaFlow',
    inputSchema: GenerateActivityIdeaInputSchema,
    outputSchema: GenerateActivityIdeaOutputSchema,
  },
  async input => {
    const {output} = await generateActivityPrompt(input);
    return output!;
  }
);
