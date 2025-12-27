'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { mediaAtom, type MediaConfig } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { uploadMedia, searchPexelsVideos, searchPexelsImages } from '@/lib/supabase'
import { Upload, Search, Film, Image as ImageIcon, X } from 'lucide-react'

type MediaSlot = keyof MediaConfig

export function MediaPanel() {
  const [media, setMedia] = useAtom(mediaAtom)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [currentSlot, setCurrentSlot] = useState<MediaSlot>('hero')
  const [pickerTab, setPickerTab] = useState<'upload' | 'video' | 'image'>('upload')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const slots: { key: MediaSlot; label: string }[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'slide0', label: 'Slide 1' },
    { key: 'slide1', label: 'Slide 2' },
    { key: 'slide2', label: 'Slide 3' },
    { key: 'slide3', label: 'Slide 4' },
    { key: 'slide4', label: 'Slide 5' },
  ]

  const openPicker = (slot: MediaSlot) => {
    setCurrentSlot(slot)
    setPickerOpen(true)
    setPickerTab('upload')
    setSearchResults([])
    setSearchQuery('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const url = await uploadMedia(file)
    setIsUploading(false)

    if (url) {
      setMedia((prev) => ({
        ...prev,
        [currentSlot]: { url, type: 'image' },
      }))
      setPickerOpen(false)
      toast('Image uploaded!', 'success')
    } else {
      toast('Upload failed', 'error')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    if (pickerTab === 'video') {
      const results = await searchPexelsVideos(searchQuery)
      setSearchResults(results)
    } else if (pickerTab === 'image') {
      const results = await searchPexelsImages(searchQuery)
      setSearchResults(results)
    }
  }

  const selectVideo = (video: any) => {
    const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0]
    setMedia((prev) => ({
      ...prev,
      [currentSlot]: { url: file.link, type: 'video' },
    }))
    setPickerOpen(false)
    toast('Video selected!', 'success')
  }

  const selectImage = (photo: any) => {
    setMedia((prev) => ({
      ...prev,
      [currentSlot]: { url: photo.src.large2x || photo.src.large, type: 'image' },
    }))
    setPickerOpen(false)
    toast('Image selected!', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🏠 Hero Background</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-secondary">
              {media.hero.type === 'video' ? (
                <video src={media.hero.url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={media.hero.url} alt="Hero" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Hero Section</p>
              <p className="text-xs text-muted-foreground uppercase">{media.hero.type}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => openPicker('hero')}>
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slide Backgrounds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📑 Slide Backgrounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {slots.slice(1).map((slot) => (
            <div key={slot.key} className="flex items-center gap-4 p-2 rounded-lg bg-secondary/50">
              <div className="w-20 h-12 rounded overflow-hidden bg-secondary">
                {media[slot.key].type === 'video' ? (
                  <video src={media[slot.key].url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={media[slot.key].url} alt={slot.label} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{slot.label}</p>
                <p className="text-xs text-muted-foreground uppercase">{media[slot.key].type}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openPicker(slot.key)}>
                Change
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Media Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">
                Select Media for {slots.find((s) => s.key === currentSlot)?.label}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setPickerOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex gap-2">
                <Button
                  variant={pickerTab === 'upload' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setPickerTab('upload')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <Button
                  variant={pickerTab === 'video' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setPickerTab('video')}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Videos
                </Button>
                <Button
                  variant={pickerTab === 'image' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setPickerTab('image')}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Images
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {pickerTab === 'upload' && (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              )}

              {(pickerTab === 'video' || pickerTab === 'image') && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Search ${pickerTab}s...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {searchResults.map((item, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() =>
                          pickerTab === 'video' ? selectVideo(item) : selectImage(item)
                        }
                      >
                        {pickerTab === 'video' ? (
                          <video
                            src={item.video_files[0]?.link}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={item.src?.medium}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
