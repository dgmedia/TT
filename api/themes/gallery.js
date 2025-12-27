const SUPABASE_URL = 'https://wteiewheqyrbhxjzthcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZWlld2hlcXlyYmh4anp0aGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDQ3MDEsImV4cCI6MjA4MjM4MDcwMX0.-tIiLKyRzsmD4MYTahTJLXHDeeMWPPNzBAigH5UzHDA';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { sort = 'recent', limit = 20 } = req.query;

    try {
        // Build query based on sort option
        let orderBy = 'created_at.desc';
        if (sort === 'popular') orderBy = 'likes.desc';
        if (sort === 'views') orderBy = 'views.desc';

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/themes?is_public=eq.true&select=id,name,description,author,colors,created_at,likes,views&order=${orderBy}&limit=${limit}`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Supabase error:', error);
            return res.status(response.status).json({ error: 'Failed to load themes' });
        }

        const themes = await response.json();
        return res.status(200).json({ themes });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
