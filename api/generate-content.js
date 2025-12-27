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
                        content: `You are a website content generator. Given a business/brand description, generate compelling website content.

Respond ONLY with a valid JSON object in this exact format, no markdown, no explanation:
{
    "hero": {
        "tagline": "Short tagline (3-5 words)",
        "headline": "Main headline (2-4 words)",
        "subheadline": "Descriptive subheadline (8-15 words)"
    },
    "slides": [
        {
            "label": "Feature 01",
            "title": "Feature name (2-3 words)",
            "subtitle": "Brief subtitle (3-6 words)",
            "desc": "Feature description (15-25 words)"
        },
        {
            "label": "Feature 02",
            "title": "Feature name",
            "subtitle": "Brief subtitle",
            "desc": "Feature description"
        },
        {
            "label": "Feature 03",
            "title": "Feature name",
            "subtitle": "Brief subtitle",
            "desc": "Feature description"
        },
        {
            "label": "Feature 04",
            "title": "Feature name",
            "subtitle": "Brief subtitle",
            "desc": "Feature description"
        },
        {
            "label": "Feature 05",
            "title": "Feature name",
            "subtitle": "Brief subtitle",
            "desc": "Feature description"
        }
    ],
    "footer": {
        "tagline": "Closing tagline (4-8 words)",
        "cta": "Call to action button text (2-3 words)"
    }
}

Make the content compelling, professional, and tailored to the brand description. Use active voice and benefit-focused language.`
                    },
                    {
                        role: 'user',
                        content: `Generate website content for: ${prompt}`
                    }
                ],
                temperature: 0.8,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API error:', error);
            return res.status(response.status).json({ error: 'Groq API error' });
        }

        const data = await response.json();
        const contentStr = data.choices[0]?.message?.content;

        if (!contentStr) {
            return res.status(500).json({ error: 'No response from Groq' });
        }

        // Parse the JSON from the response
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ error: 'Invalid response format', raw: contentStr });
        }

        const content = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ content });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
