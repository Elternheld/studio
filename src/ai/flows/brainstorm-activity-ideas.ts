// src/ai/flows/brainstorm-activity-ideas.ts
'use server';
/**
 * @fileOverview Brainstorms activity ideas using voice input and provides suggestions from an AI assistant.
 *
 * - brainstormActivityIdeas - A function that handles the brainstorming process.
 * - BrainstormActivityIdeasInput - The input type for the brainstormActivityIdeas function.
 * - BrainstormActivityIdeasOutput - The return type for the brainstormActivityIdeas function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const BrainstormActivityIdeasInputSchema = z.object({
  voiceInput: z.string().describe('The voice input from the parent.'),
});
export type BrainstormActivityIdeasInput = z.infer<typeof BrainstormActivityIdeasInputSchema>;

const BrainstormActivityIdeasOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of activity suggestions.'),
});
export type BrainstormActivityIdeasOutput = z.infer<typeof BrainstormActivityIdeasOutputSchema>;

export async function brainstormActivityIdeas(input: BrainstormActivityIdeasInput): Promise<BrainstormActivityIdeasOutput> {
  return brainstormActivityIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainstormActivityIdeasPrompt',
  input: {
    schema: z.object({
      voiceInput: z.string().describe('The voice input from the parent.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z.array(z.string()).describe('An array of activity suggestions.'),
    }),
  },
  prompt: `You are a helpful AI assistant that helps parents brainstorm activity ideas for their children.

The parent has provided the following voice input: {{{voiceInput}}}

Generate a list of activity suggestions based on the parent's input.`, 
});

const brainstormActivityIdeasFlow = ai.defineFlow<
  typeof BrainstormActivityIdeasInputSchema,
  typeof BrainstormActivityIdeasOutputSchema
>(
  {
    name: 'brainstormActivityIdeasFlow',
    inputSchema: BrainstormActivityIdeasInputSchema,
    outputSchema: BrainstormActivityIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
