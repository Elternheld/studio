import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use a getter function to access the API key so that it can be dynamically updated.
function getApiKey() {
  return process.env.GOOGLE_GENAI_API_KEY;
}

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});


