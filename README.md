# Pebble Studio - Vercel + Supabase Deployment

A visual dashboard for customizing video backgrounds and colors, with cloud save, theme gallery, and shareable links powered by Supabase.

## Quick Deploy to Vercel

### 1. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to SQL Editor → New Query
3. Paste contents of `supabase-schema.sql` and click Run
4. Go to Project Settings → API and copy your `anon` `public` key

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Deploy
```bash
cd pebble-vercel
vercel
```

### 4. Add Environment Variables
In Vercel dashboard (Settings → Environment Variables):
```
DEEPSEEK_API_KEY = your-deepseek-key
SUPABASE_ANON_KEY = your-supabase-anon-key
```

### 5. Redeploy
```bash
vercel --prod
```

## Project Structure

```
pebble-vercel/
├── api/
│   ├── generate-colors.js   # DeepSeek color generation
│   ├── generate-content.js  # DeepSeek content generation
│   └── themes/
│       ├── save.js          # Save theme to Supabase
│       ├── [id].js          # Load theme by ID
│       ├── gallery.js       # List public themes
│       └── like.js          # Like a theme
├── public/
│   ├── index.html           # Studio dashboard
│   ├── pebble-dynamic.html  # Preview site
│   └── theme.html           # Shareable theme loader
├── supabase-schema.sql      # Database schema
├── vercel.json
└── package.json
```

## How It Works

1. **Studio Dashboard** (`/`) - Customize videos and colors
2. **Color Generation** - Type a description, AI generates matching colors
3. **Preview Site** (`/pebble-dynamic.html`) - See your changes live

## API Endpoints

### POST /api/generate-colors
Generates a color palette from a description.

Request:
```json
{
    "prompt": "warm sunset with orange and purple"
}
```

Response:
```json
{
    "colors": {
        "accentOrange": "#f97316",
        "accentSage": "#fb923c",
        "accentSlate": "#9333ea",
        "bgCream": "#fef3c7",
        "bgDark": "#1e1b4b",
        "accentTaupe": "#c2410c"
    }
}
```

### POST /api/generate-content
Generates all website text content from a brand description.

Request:
```json
{
    "prompt": "A luxury electric camper van company"
}
```

Response:
```json
{
    "content": {
        "hero": {
            "tagline": "Adventure Reimagined",
            "headline": "Electric Freedom",
            "subheadline": "Explore the world in silent luxury"
        },
        "slides": [...],
        "footer": {
            "tagline": "Your Journey Awaits",
            "cta": "Reserve Now"
        }
    }
}
```

## Local Development

```bash
# Create .env.local with your API key
cp .env.example .env.local

# Run locally
vercel dev
```

Then open http://localhost:3000

## Features

- 🎬 **Video Search** - Search Pexels for background videos
- 🖼️ **Image Upload** - Upload your own images or search Pexels
- 🎨 **AI Colors** - Describe colors naturally, AI generates palette
- ✏️ **Content Editor** - Edit all text: hero, slides, footer
- 🤖 **AI Content** - Generate all website copy from a brand description
- ⚡ **Quick Themes** - One-click theme application
- 💾 **Auto-save** - Changes persist in localStorage
