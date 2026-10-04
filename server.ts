import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// POST /api/gemini/generate
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const {
      model = 'gemini-3.5-flash',
      prompt,
      systemInstruction,
      responseMimeType,
      temperature = 0.7,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const ai = getGeminiClient();
    const config: any = {
      temperature,
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      return res.json({ text: response.text });
    } catch (modelErr: any) {
      console.warn(`Model ${model} failed (${modelErr.message}). Retrying with gemini-3.1-flash-lite...`);
      if (model !== 'gemini-3.1-flash-lite') {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config,
        });
        return res.json({ text: fallbackResponse.text });
      }
      throw modelErr;
    }
  } catch (err: any) {
    console.error('Error generating content:', err);
    return res.status(500).json({ error: err.message || 'AI Generation failed' });
  }
});

// POST /api/gemini/chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const {
      model = 'gemini-3.1-flash-lite',
      messages,
      systemInstruction,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing messages array' });
    }

    const ai = getGeminiClient();
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text }],
    }));

    try {
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      return res.json({ text: response.text });
    } catch (modelErr: any) {
      console.warn(`Chat model ${model} failed (${modelErr.message}). Retrying with gemini-3.1-flash-lite...`);
      if (model !== 'gemini-3.1-flash-lite') {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: formattedContents,
          config: systemInstruction ? { systemInstruction } : undefined,
        });
        return res.json({ text: fallbackResponse.text });
      }
      throw modelErr;
    }
  } catch (err: any) {
    console.error('Error in AI Copilot chat:', err);
    return res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// POST /api/gemini/analyze-image
app.post('/api/gemini/analyze-image', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt = 'Analyze this content screenshot/visual and extract actionable ideas, hook angles, and structure for social media content.',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const ai = getGeminiClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          prompt,
        ],
      });
      return res.json({ text: response.text });
    } catch (err: any) {
      console.warn('analyze-image fallback to gemini-3.1-flash-image or flash-lite...');
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          prompt,
        ],
      });
      return res.json({ text: fallbackResponse.text });
    }
  } catch (err: any) {
    console.error('Error in analyze-image:', err);
    return res.status(500).json({ error: err.message || 'Image analysis failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Flow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
