'use client'

import { useAtom } from 'jotai'
import { textAtom } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ContentPanel() {
  const [text, setText] = useAtom(textAtom)
  const [openSlide, setOpenSlide] = useState<number | null>(null)

  const updateHero = (field: keyof typeof text.hero, value: string) => {
    setText((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }))
  }

  const updateSlide = (index: number, field: string, value: string) => {
    setText((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide
      ),
    }))
  }

  const updateFooter = (field: keyof typeof text.footer, value: string) => {
    setText((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🏠 Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Tagline</label>
            <Input
              value={text.hero.tagline}
              onChange={(e) => updateHero('tagline', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Headline</label>
            <Input
              value={text.hero.headline}
              onChange={(e) => updateHero('headline', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Subheadline</label>
            <Input
              value={text.hero.subheadline}
              onChange={(e) => updateHero('subheadline', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Slides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📑 Feature Slides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {text.slides.map((slide, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenSlide(openSlide === index ? null : index)}
                className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-sm">
                  Slide {index + 1}: {slide.title}
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    openSlide === index && 'rotate-180'
                  )}
                />
              </button>
              
              {openSlide === index && (
                <div className="p-3 pt-0 space-y-3 border-t border-border">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Label</label>
                    <Input
                      value={slide.label}
                      onChange={(e) => updateSlide(index, 'label', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Title</label>
                    <Input
                      value={slide.title}
                      onChange={(e) => updateSlide(index, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Subtitle</label>
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">Description</label>
                    <textarea
                      value={slide.desc}
                      onChange={(e) => updateSlide(index, 'desc', e.target.value)}
                      className="mt-1 w-full h-20 p-2 rounded-md border border-input bg-transparent text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📍 Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Tagline</label>
            <Input
              value={text.footer.tagline}
              onChange={(e) => updateFooter('tagline', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Button Text</label>
            <Input
              value={text.footer.cta}
              onChange={(e) => updateFooter('cta', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
