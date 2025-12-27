'use client'

import { useAtom } from 'jotai'
import { colorsAtom, defaultColors } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'

const colorLabels: Record<string, string> = {
  accentOrange: 'Primary',
  accentSage: 'Secondary',
  accentSlate: 'Tertiary',
  bgCream: 'Light BG',
  bgDark: 'Dark BG',
  accentTaupe: 'Neutral',
}

const presets = [
  { name: 'Default', colors: { accentOrange: '#e85d24', accentSage: '#7d8c6e', accentSlate: '#4a5568', bgCream: '#f5f3ef', bgDark: '#1a1a1a', accentTaupe: '#a39b8b' } },
  { name: 'Ocean', colors: { accentOrange: '#0ea5e9', accentSage: '#06b6d4', accentSlate: '#0284c7', bgCream: '#f0f9ff', bgDark: '#0c4a6e', accentTaupe: '#94a3b8' } },
  { name: 'Forest', colors: { accentOrange: '#22c55e', accentSage: '#4ade80', accentSlate: '#166534', bgCream: '#f0fdf4', bgDark: '#14532d', accentTaupe: '#86efac' } },
  { name: 'Sunset', colors: { accentOrange: '#f97316', accentSage: '#fb923c', accentSlate: '#9333ea', bgCream: '#fef3c7', bgDark: '#1e1b4b', accentTaupe: '#fbbf24' } },
  { name: 'Mono', colors: { accentOrange: '#525252', accentSage: '#737373', accentSlate: '#404040', bgCream: '#fafafa', bgDark: '#171717', accentTaupe: '#a3a3a3' } },
]

export function ColorsPanel() {
  const [colors, setColors] = useAtom(colorsAtom)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const updateColor = (key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setColors(preset.colors as typeof colors)
    toast(`Applied ${preset.name} preset`, 'success')
  }

  const generateColors = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.colors) {
        setColors((prev) => ({ ...prev, ...data.colors }))
        toast('Colors generated!', 'success')
      }
    } catch (error) {
      toast('Generation failed', 'error')
    }
    setIsGenerating(false)
  }

  const resetColors = () => {
    setColors(defaultColors)
    toast('Colors reset', 'success')
  }

  return (
    <div className="space-y-6">
      {/* AI Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Color Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="w-full h-24 p-3 rounded-lg bg-secondary border-0 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Describe your color scheme... e.g. 'ocean blues' or 'warm sunset'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={generateColors} disabled={isGenerating} className="w-full">
            {isGenerating ? 'Generating...' : 'Generate Colors'}
          </Button>
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-2 rounded-lg border border-border hover:border-primary transition-colors"
              >
                <div className="flex gap-0.5 mb-1">
                  {Object.values(preset.colors).slice(0, 3).map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">{preset.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Pickers */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Current Colors</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetColors}>
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium">{colorLabels[key]}</p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
