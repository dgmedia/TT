const SUPABASE_URL = 'https://wteiewheqyrbhxjzthcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZWlld2hlcXlyYmh4anp0aGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDQ3MDEsImV4cCI6MjA4MjM4MDcwMX0.-tIiLKyRzsmD4MYTahTJLXHDeeMWPPNzBAigH5UzHDA';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Theme ID is required' });
    }

    try {
        // Fetch theme
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/themes?id=eq.${id}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to load theme' });
        }

        const data = await response.json();
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Theme not found' });
        }

        // Increment view count (fire and forget)
        fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ theme_id: id })
        }).catch(() => {});

        return res.status(200).json({ theme: data[0] });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
