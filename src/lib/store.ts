import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { MediaConfig, ColorConfig, TextConfig } from './supabase'

// Default values
export const defaultMedia: MediaConfig = {
  hero: { url: 'https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_25fps.mp4', type: 'video' },
  slide0: { url: 'https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4', type: 'video' },
  slide1: { url: 'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4', type: 'video' },
  slide2: { url: 'https://videos.pexels.com/video-files/1093662/1093662-uhd_2560_1440_30fps.mp4', type: 'video' },
  slide3: { url: 'https://videos.pexels.com/video-files/3015510/3015510-uhd_2560_1440_24fps.mp4', type: 'video' },
  slide4: { url: 'https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4', type: 'video' },
}

export const defaultColors: ColorConfig = {
  accentOrange: '#e85d24',
  accentSage: '#7d8c6e',
  accentSlate: '#4a5568',
  bgCream: '#f5f3ef',
  bgDark: '#1a1a1a',
  accentTaupe: '#a39b8b',
}

export const defaultText: TextConfig = {
  hero: {
    tagline: 'Future Natural',
    headline: 'Smooth Layers',
    subheadline: 'Buttery smooth scrolling with video backgrounds',
  },
  slides: [
    { label: 'Feature 01', title: '100% Electric', subtitle: 'Zero emissions, endless adventure', desc: 'No more fossil fuels, buzzing generators, and propane tanks. Power for days with clean, silent energy.' },
    { label: 'Feature 02', title: 'Magic Hitch', subtitle: 'Self-positioning connection', desc: 'With one touch, sense, self-position, and safely attach to your tow vehicle. Effortless connection.' },
    { label: 'Feature 03', title: 'Easy Tow', subtitle: 'Dual-motor active towing', desc: "The world's first dual-motor active towing system. Improved efficiency with unwavering confidence." },
    { label: 'Feature 04', title: 'Remote Control', subtitle: 'Full maneuverability via app', desc: 'Never back up again. Fully remote-controllable positioning. Pivot effortlessly into tight spots.' },
    { label: 'Feature 05', title: 'InstaCamp', subtitle: 'One-touch setup', desc: 'Be camp-ready in seconds. One touch sets up leveling, stairs, thermostat, and lights automatically.' },
  ],
  footer: {
    tagline: 'The Future is Natural',
    cta: 'Get Started',
  },
}

// Theme state atoms
export const mediaAtom = atom<MediaConfig>(defaultMedia)
export const colorsAtom = atom<ColorConfig>(defaultColors)
export const textAtom = atom<TextConfig>(defaultText)
export const themeIdAtom = atom<string | null>(null)

// UI state atoms
export const activeSlideAtom = atom<number>(0)
export const isSavingAtom = atom<boolean>(false)
export const toastAtom = atom<{ message: string; type: 'success' | 'error' } | null>(null)

// Persisted atoms
export const favoritesAtom = atomWithStorage<string[]>('pebbleFavorites', [])
export const darkModeAtom = atomWithStorage<boolean>('pebbleDarkMode', true)

// Derived atoms
export const currentSlideMediaAtom = atom((get) => {
  const media = get(mediaAtom)
  const activeIndex = get(activeSlideAtom)
  const key = activeIndex === -1 ? 'hero' : `slide${activeIndex}` as keyof MediaConfig
  return media[key]
})

// Actions
export const resetThemeAtom = atom(
  null,
  (get, set) => {
    set(mediaAtom, defaultMedia)
    set(colorsAtom, defaultColors)
    set(textAtom, defaultText)
    set(themeIdAtom, null)
  }
)
