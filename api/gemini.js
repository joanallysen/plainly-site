// Vercel serverless function: /api/gemini
// Keeps the real Gemini API key on the server. The frontend never sees it.
// Set GEMINI_API_KEY as an environment variable in your hosting dashboard.
// Get a free key (no card required) at https://aistudio.google.com

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your hosting dashboard.' });
    return;
  }

  try {
    const { system, messages, max_tokens } = req.body || {};
    const userText = (messages && messages[0] && messages[0].content) || '';

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system || '' }] },
          contents: [{ role: 'user', parts: [{ text: userText }] }],
          generationConfig: {
            maxOutputTokens: max_tokens || 1000,
            temperature: 0.4
          }
        })
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json(data);
      return;
    }

    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map(p => p.text || '').join('');

    // Normalized to look like an Anthropic response, so the frontend doesn't
    // need separate parsing logic per provider.
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
};
