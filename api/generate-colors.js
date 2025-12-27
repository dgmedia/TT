export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are a color palette generator for websites. Given a description, generate a cohesive color palette.

Respond ONLY with a valid JSON object in this exact format, no markdown, no explanation:
{
    "accentOrange": "#hexcode",
    "accentSage": "#hexcode",
    "accentSlate": "#hexcode",
    "bgCream": "#hexcode",
    "bgDark": "#hexcode",
    "accentTaupe": "#hexcode"
}

Where:
- accentOrange: Primary accent (buttons, highlights) - should be vibrant
- accentSage: Secondary accent (subtle highlights)
- accentSlate: Tertiary accent (text, borders)
- bgCream: Light background color
- bgDark: Dark background color
- accentTaupe: Neutral accent

Ensure colors are harmonious and match the user's description.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API error:', error);
            return res.status(response.status).json({ error: 'Groq API error' });
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            return res.status(500).json({ error: 'No response from Groq' });
        }

        // Parse the JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ error: 'Invalid response format', raw: content });
        }

        const colors = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ colors });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
