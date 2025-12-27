# Pebble Studio (Next.js)

A modern scroll experience builder with video backgrounds, built with Next.js 15.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Jotai
- **Animations**: GSAP + ScrollTrigger
- **Charts**: VisActor
- **Database**: Supabase
- **Deployment**: Vercel

## Features

- 🎬 **Media Panel** - Upload images or search Pexels for videos/images
- 🎨 **Colors Panel** - AI-powered color generation or manual pickers
- ✏️ **Content Panel** - Edit all text content
- 🌐 **Gallery** - Browse, like, and use community themes
- 📊 **Admin Dashboard** - Analytics with VisActor charts

## Getting Started

1. Clone and install:
```bash
git clone <repo>
cd pebble-next
npm install
```

2. Set up environment:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and Groq keys
```

3. Download fonts (Instrument Serif):
Place `InstrumentSerif-Regular.ttf` and `InstrumentSerif-Italic.ttf` in `/public/fonts/`

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Pages

- `/` - Landing page
- `/studio` - Theme editor
- `/preview` - Live preview with scroll animations
- `/admin` - Analytics dashboard

## Supabase Setup

Run the SQL from the old project to create the `themes` table and `media` storage bucket.

## Deploy to Vercel

```bash
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
