import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY
    
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a color palette generator. Given a description, generate a cohesive color palette with exactly 6 colors. Return ONLY a JSON object with these exact keys:
{
  "accentOrange": "#hex",
  "accentSage": "#hex", 
  "accentSlate": "#hex",
  "bgCream": "#hex",
  "bgDark": "#hex",
  "accentTaupe": "#hex"
}
No explanation, just the JSON.`,
          },
          {
            role: 'user',
            content: `Generate a color palette for: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }

    const colors = JSON.parse(jsonMatch[0])
    return NextResponse.json({ colors })
    
  } catch (error) {
    console.error('Color generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
