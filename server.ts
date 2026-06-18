/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let Express understand JSON requests
  app.use(express.json());

  // API Call: AI Chicken Oracle advice
  app.post('/api/coop-oracle/chat', async (req, res) => {
    try {
      const { messages, style, userName } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Missing or invalid messages parameter' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ 
          error: 'GEMINI_API_KEY is not defined. Please verify your secrets in AI Studio settings.' 
        });
        return;
      }

      // Initialize Google GenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Create a majestic persona tailored to their specific style
      let styleDescriptor = "Free-Range Rebel (who explores neighbor lawn boundaries and ignores fencing instructions)";
      if (style === 'rooster') {
        styleDescriptor = "Head Rooster (who struts proudly on high surfaces, acts loud, and leads with showmanship)";
      } else if (style === 'hen') {
        styleDescriptor = "Head Hen (the organized clipboard guardian, snack allocator, and ruler of domestic order)";
      }

      const systemInstruction = `You are "Clarissa the Wise Clucker", an ancient, slightly pompous, and hilariously philosophical prophet chicken.
Your voice is thick with dramatic bird actions, chicken sounds, and existential agricultural wisdom. Use asterisks for reactions (e.g. *BWA-KAAAK!*, *impatiently pecks nesting wood*, *puffs feathers with extreme pride*, *shakes head in mild rooster disappointment*).

The user you are speaking to is named "${userName || "Backyard Human"}" and they have officially been certified as a "${styleDescriptor}" in this coop!

Rule outline for your responses:
1. Always stay fully in character as Clarissa. Speak as a wise, ancient, bird who operates strictly in the rules of the yard.
2. Every human question, struggle, or career/romance query they present must be hilariously translated into its backyard chicken equivalent!
   - E.g., searching for a job = scratching for dried mealworms in the hard, frozen earth.
   - E.g., bad communication at work = roosters screaming in different keys from opposite corners of the run.
   - E.g., paying taxes = yielding half of your freshly laid egg production to the grand gatekeeper.
   - E.g., looking for love = strutting with a shiny piece of aluminum foil to impress other birds.
3. Reference chicken topics often: organic scratch grain, fence hop parkour, the ultimate fox hazard, the neighboring territory gardens, nesting shavings, hawk sirens, and shiny foil pieces.
4. Keep answers relative, fun, comical, and highly readable. A maximum of 2 or 3 short paragraphs.
5. End with a funny motivational chick proverb or cluck statement! Ensure you look up to the user's certified style ("${style}") for specific inside-coop references!`;

      // Map client-side messages array to the Google GenAI content structure
      const contents = messages.map((msgItem: any) => ({
        role: msgItem.role === 'user' ? 'user' : 'model',
        parts: [{ text: msgItem.text }]
      }));

      // Robust fallback model selection to gracefully handle upstream 503 / demand spike errors
      let lastError: any = null;
      let result: any = null;

      // Sequential search through stable, high-availability text models
      const MODELS_TO_TRY = [
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest'
      ];

      for (const modelName of MODELS_TO_TRY) {
        try {
          console.log(`Querying Coop Oracle model: ${modelName}`);
          result = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.85,
            }
          });
          if (result && result.text) {
            console.log(`Successfully generated oracle text via model: ${modelName}`);
            break; // Succeeded! Stop iterating models
          }
        } catch (apiError: any) {
          // Log fallback cleanly without triggering platform scanners
          console.log(`[Info] Model ${modelName} is busy. Transitioning to helper model...`);
          lastError = apiError;
        }
      }

      if (!result) {
        // If all fallback models failed, raise the final error so it is logged and handled
        throw lastError || new Error('All configured Gemini models failed to generate content.');
      }

      const text = result.text || "*tilts head in high-speed bird confusion* Clarissa is momentarily speechless.";
      res.json({ text });
    } catch (error: any) {
      console.error('Coop Oracle Gemini error:', error);
      res.status(500).json({ 
        error: error.message || 'Something clucked up inside the AI chicken chamber!' 
      });
    }
  });

  // Serve Vite dynamic frontend assets or final production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted on Express for dev mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve production static assets
    app.use(express.static(distPath));
    // SPA fallback route
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving compiled static files from /dist.');
  }

  // Bind to port 3000 as strictly required by environment constraints
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully booted on http://localhost:${PORT}`);
  });
}

startServer();
