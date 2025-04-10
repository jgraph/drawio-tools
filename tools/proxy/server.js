// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    const { messages } = req.body;

    console.log('Received messages:', messages);

    const result = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: req.headers['model'],
        max_tokens: 1024,
        messages: messages,
      },
      {
        headers: {
          'x-api-key': req.headers['x-api-key'],
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        }
      }
    );

    console.log('Claude API response:', result.data);

    res.json(result.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to reach Claude API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});