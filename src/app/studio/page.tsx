'use client'

import { useSearchParams } from 'next/navigation'
import { MediaPanel } from '@/components/studio/media-panel'
import { ColorsPanel } from '@/components/studio/colors-panel'
import { ContentPanel } from '@/components/studio/content-panel'
import { GalleryPanel } from '@/components/studio/gallery-panel'
import { Button } from '@/components/ui/button'
import { Eye, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function StudioPage() {
  const searchParams = useSearchParams()
  const activePanel = (searchParams.get('panel') || 'media') as 'media' | 'colors' | 'content' | 'gallery'

  const panels = {
    media: <MediaPanel />,
    colors: <ColorsPanel />,
    content: <ContentPanel />,
    gallery: <GalleryPanel />,
  }

  const titles = {
    media: 'Media',
    colors: 'Colors',
    content: 'Content',
    gallery: 'Gallery',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{titles[activePanel]}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Link href="/preview" target="_blank">
            <Button variant="secondary">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {panels[activePanel]}
    </div>
  )
}
