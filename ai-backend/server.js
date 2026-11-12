const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());
app.use(cors());

// Cliente de OpenAI apuntando a OpenRouter
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://tu-sitio-web.com',
    'X-Title': 'Mi Aplicativo Web',
  },
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const messages = [...(history || []), { role: 'user', content: message }];

    const completion = await openrouter.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: messages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error al comunicarse con OpenRouter:', error);
    res.status(500).json({ error: 'Error interno al procesar la solicitud con la IA' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});