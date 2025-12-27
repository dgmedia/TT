import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Pebble Studio
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-normal">
            Smooth Layers
          </h1>
          <p className="text-lg text-white/70">
            Create beautiful scroll experiences with video backgrounds
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/studio">
            <Button size="lg" className="w-full sm:w-auto">
              Open Studio
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
              View Analytics
            </Button>
          </Link>
        </div>
        
        <div className="pt-8 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-serif text-primary">5</div>
            <div className="text-sm text-white/50">Feature Slides</div>
          </div>
          <div>
            <div className="text-3xl font-serif text-primary">∞</div>
            <div className="text-sm text-white/50">Customizations</div>
          </div>
          <div>
            <div className="text-3xl font-serif text-primary">0</div>
            <div className="text-sm text-white/50">Code Required</div>
          </div>
        </div>
      </div>
    </div>
  )
}
