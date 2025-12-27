import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Theme {
  id: string
  created_at: string
  updated_at: string
  name: string
  description?: string
  author: string
  media: MediaConfig
  colors: ColorConfig
  text_content: TextConfig
  is_public: boolean
  likes: number
  views: number
  thumbnail_url?: string
}

export interface MediaConfig {
  hero: MediaItem
  slide0: MediaItem
  slide1: MediaItem
  slide2: MediaItem
  slide3: MediaItem
  slide4: MediaItem
}

export interface MediaItem {
  url: string
  type: 'video' | 'image'
}

export interface ColorConfig {
  accentOrange: string
  accentSage: string
  accentSlate: string
  bgCream: string
  bgDark: string
  accentTaupe: string
}

export interface TextConfig {
  hero: {
    tagline: string
    headline: string
    subheadline: string
  }
  slides: {
    label: string
    title: string
    subtitle: string
    desc: string
  }[]
  footer: {
    tagline: string
    cta: string
  }
}

// API functions
export async function getTheme(id: string): Promise<Theme | null> {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching theme:', error)
    return null
  }
  return data
}

export async function getPublicThemes(limit = 20): Promise<Theme[]> {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching themes:', error)
    return []
  }
  return data || []
}

export async function getPopularThemes(limit = 20): Promise<Theme[]> {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('is_public', true)
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching themes:', error)
    return []
  }
  return data || []
}

export async function saveTheme(theme: Partial<Theme>): Promise<Theme | null> {
  const { data, error } = await supabase
    .from('themes')
    .insert(theme)
    .select()
    .single()
  
  if (error) {
    console.error('Error saving theme:', error)
    return null
  }
  return data
}

export async function updateTheme(id: string, updates: Partial<Theme>): Promise<Theme | null> {
  const { data, error } = await supabase
    .from('themes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating theme:', error)
    return null
  }
  return data
}

export async function incrementLikes(themeId: string): Promise<void> {
  await supabase.rpc('increment_likes', { theme_id: themeId })
}

export async function incrementViews(themeId: string): Promise<void> {
  await supabase.rpc('increment_views', { theme_id: themeId })
}

export async function uploadMedia(file: File): Promise<string | null> {
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.type.split('/')[1] || 'jpg'}`
  
  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, file)
  
  if (error) {
    console.error('Error uploading file:', error)
    return null
  }
  
  const { data } = supabase.storage.from('media').getPublicUrl(fileName)
  return data.publicUrl
}

// Pexels API
const PEXELS_KEY = 'JvHx5PnVieFkLRf42pUYRhIpF5stIfaJmjvSntlDXYOzwy1nmXGhpI6S'

export async function searchPexelsVideos(query: string) {
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12`,
    { headers: { Authorization: PEXELS_KEY } }
  )
  const data = await res.json()
  return data.videos || []
}

export async function searchPexelsImages(query: string) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
    { headers: { Authorization: PEXELS_KEY } }
  )
  const data = await res.json()
  return data.photos || []
}
