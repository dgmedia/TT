'use client'

import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { favoritesAtom, mediaAtom, colorsAtom, textAtom, themeIdAtom } from '@/lib/store'
import { getPublicThemes, getPopularThemes, getTheme, incrementLikes, type Theme } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Heart, TrendingUp, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'browse' | 'favorites' | 'popular'

export function GalleryPanel() {
  const [favorites, setFavorites] = useAtom(favoritesAtom)
  const [, setMedia] = useAtom(mediaAtom)
  const [, setColors] = useAtom(colorsAtom)
  const [, setText] = useAtom(textAtom)
  const [, setThemeId] = useAtom(themeIdAtom)
  
  const [tab, setTab] = useState<Tab>('browse')
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadThemes()
  }, [tab, favorites])

  const loadThemes = async () => {
    setIsLoading(true)
    let data: Theme[] = []

    if (tab === 'favorites' && favorites.length > 0) {
      // Load favorite themes by IDs
      const promises = favorites.map((id) => getTheme(id))
      const results = await Promise.all(promises)
      data = results.filter((t): t is Theme => t !== null)
    } else if (tab === 'popular') {
      data = await getPopularThemes()
    } else {
      data = await getPublicThemes()
    }

    setThemes(data)
    setIsLoading(false)
  }

  const loadTheme = async (theme: Theme) => {
    if (theme.media) setMedia(theme.media)
    if (theme.colors) setColors(theme.colors)
    if (theme.text_content) setText(theme.text_content)
    setThemeId(theme.id)
    toast('Theme loaded!', 'success')
  }

  const toggleFavorite = async (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (favorites.includes(themeId)) {
      setFavorites(favorites.filter((id) => id !== themeId))
      toast('Removed from favorites', 'success')
    } else {
      setFavorites([...favorites, themeId])
      await incrementLikes(themeId)
      toast('Added to favorites! ❤️', 'success')
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'browse', label: 'Browse All', icon: <Grid3X3 className="w-4 h-4" /> },
    { key: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
    { key: 'popular', label: 'Popular', icon: <TrendingUp className="w-4 h-4" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">🌐 Community Themes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              <span className="ml-2">{t.label}</span>
            </Button>
          ))}
        </div>

        {/* Theme Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : themes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {tab === 'favorites' ? 'No favorites yet. Like some themes!' : 'No themes yet'}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => loadTheme(theme)}
              >
                {/* Color Preview */}
                <div className="flex gap-1 mb-3">
                  {Object.values(theme.colors || {}).slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 first:rounded-l last:rounded-r"
                      style={{ backgroundColor: color as string }}
                    />
                  ))}
                </div>

                {/* Info */}
                <div className="mb-2">
                  <p className="font-medium text-sm truncate">{theme.name}</p>
                  <p className="text-xs text-muted-foreground">by {theme.author || 'Anonymous'}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button
                    onClick={(e) => toggleFavorite(theme.id, e)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors',
                      favorites.includes(theme.id)
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-secondary text-muted-foreground hover:text-red-500'
                    )}
                  >
                    <Heart
                      className={cn(
                        'w-3 h-3',
                        favorites.includes(theme.id) && 'fill-current'
                      )}
                    />
                    {theme.likes || 0}
                  </button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
