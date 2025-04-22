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
  childAge: z.number().describe('The age of the child in years.'),
  locationType: z.enum(['indoor', 'outdoor']).describe('The location type (indoor or outdoor).'),
  weatherDescription: z.string().describe('A description of the weather conditions.'),
  availableTime: z.number().describe('The available time in minutes.'),
  locationLat: z.number().optional().describe('The latitude of the location. Required if weather is to be fetched.'),
  locationLng: z.number().optional().describe('The longitude of the location. Required if weather is to be fetched.'),
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
  imageUrl: z.string().describe('A URL of an image representing the activity.'),
});
export type GenerateActivityIdeaOutput = z.infer<typeof GenerateActivityIdeaOutputSchema>;

export async function generateActivityIdea(input: GenerateActivityIdeaInput): Promise<GenerateActivityIdeaOutput> {
  return generateActivityIdeaFlow(input);
}

const generateActivityPrompt = ai.definePrompt({
  name: 'generateActivityPrompt',
  input: {
    schema: z.object({
      childAge: z.number().describe('The age of the child in years.'),
      locationType: z.enum(['indoor', 'outdoor']).describe('The location type (indoor or outdoor).'),
      weatherDescription: z.string().describe('A description of the weather conditions.'),
      availableTime: z.number().describe('The available time in minutes.'),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('The title of the activity.'),
      description: z.string().describe('A brief description of the activity.'),
      instructions: z.string().describe('Step-by-step instructions for the activity.'),
      materials: z.array(z.string()).describe('A list of materials needed for the activity.'),
      costEstimate: z.number().describe('The estimated cost of the activity in USD.'),
      safetyTips: z.string().describe('Important safety tips for the activity.'),
      educationalBenefits: z.array(z.string()).describe('The educational benefits of the activity.'),
      imageUrl: z.string().describe('A URL of an image representing the activity.'),
    }),
  },
  prompt: `You are a creative activity planner for children.

  Generate an engaging activity idea for a child who is {{childAge}} years old, considering it will be done {{locationType}}.
  The weather is: {{weatherDescription}}.
  The activity should take approximately {{availableTime}} minutes.

  The response should contain:
  - A title for the activity.
  - A brief description of the activity.
  - Step-by-step instructions for the activity.
  - A list of materials needed for the activity.
  - An estimated cost of the activity in USD.
  - Important safety tips for the activity.
  - A list of educational benefits of the activity.
  - A URL of an image representing the activity.
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
    let weatherDescription = input.weatherDescription;

    // If no weather description is provided, and location coordinates are, fetch the weather
    if (!weatherDescription && input.locationLat && input.locationLng) {
      const weather: Weather = await getWeather({
        lat: input.locationLat,
        lng: input.locationLng,
      });
      weatherDescription = `The weather is ${weather.conditions} and the temperature is ${weather.temperatureFarenheit}F.`
    }

    const {output} = await generateActivityPrompt({
      ...input,
      weatherDescription,
    });
    return output!;
  }
);
