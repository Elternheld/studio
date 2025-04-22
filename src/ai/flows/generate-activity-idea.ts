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
  prompt: `Du bist ein kreativer Aktivitätsplaner für Kinder.

  Generiere eine ansprechende Aktivitätsidee für ein Kind im Alter von {{ageGroup}} Jahren, wobei berücksichtigt wird, dass sie {{indoorOutdoor}} durchgeführt wird.
  Das Wetter ist: {{weather}}.
  Die Aktivität sollte etwa {{timeAvailable}} Minuten dauern.
  Zusätzliche Hinweise: {{ersteGedanken}}

  Die Antwort sollte Folgendes enthalten:
  - Einen Titel für die Aktivität.
  - Eine kurze Beschreibung der Aktivität.
  - Schritt-für-Schritt-Anleitungen für die Aktivität.
  - Eine Liste der für die Aktivität benötigten Materialien.
  - Eine geschätzte Kosten der Aktivität in USD.
  - Wichtige Sicherheitshinweise für die Aktivität.
  - Eine Liste der pädagogischen Vorteile der Aktivität.
  `,
});

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the activity.'),
      description: z.string().describe('A brief description of the activity.'),
    }),
  },
  output: {
    schema: z.object({
      imageUrl: z.string().describe('A URL of an image representing the activity.'),
    }),
  },
  prompt: `Erstelle eine Bild-URL, die das folgende Ereignis darstellt.
  Name: {{title}}
  Beschreibung: {{description}}
`
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
    if(output){
      const imagePromptOutput = await generateImagePrompt(output);
      return {
        ...output,
        imageUrl: imagePromptOutput.imageUrl
      };
    }
    return output!;
  }
);
