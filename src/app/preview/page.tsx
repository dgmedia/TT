'use client'

import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { mediaAtom, colorsAtom, textAtom } from '@/lib/store'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PreviewPage() {
  const [media] = useAtom(mediaAtom)
  const [colors] = useAtom(colorsAtom)
  const [text] = useAtom(textAtom)
  const [activeSlide, setActiveSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Apply colors as CSS variables
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-cream', colors.bgCream)
    root.style.setProperty('--theme-dark', colors.bgDark)
    root.style.setProperty('--theme-orange', colors.accentOrange)
    root.style.setProperty('--theme-sage', colors.accentSage)
    root.style.setProperty('--theme-slate', colors.accentSlate)
    root.style.setProperty('--theme-taupe', colors.accentTaupe)
  }, [colors])

  return (
    <div ref={containerRef} className="bg-[var(--theme-cream)]">
      {/* Hero Section */}
      <Hero media={media.hero} text={text.hero} />
      
      {/* Features Section */}
      <section className="flex">
        {/* Left Panel - Sticky */}
        <LeftPanel text={text} activeSlide={activeSlide} />
        
        {/* Right Panel - Scrolling Slides */}
        <RightPanel 
          media={media} 
          text={text} 
          onSlideChange={setActiveSlide} 
        />
      </section>
      
      {/* Footer */}
      <Footer text={text.footer} />
    </div>
  )
}

function Hero({ media, text }: { media: any; text: any }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { y: 0, opacity: 1 },
      {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      }
    )
  }, [])

  return (
    <section
      ref={heroRef}
      className="h-screen min-h-[600px] flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--theme-dark)' }}
    >
      {/* Background Media */}
      {media.type === 'video' ? (
        <video
          src={media.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={media.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center text-white px-6 max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] opacity-70 mb-4">
          {text.tagline}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">
          {text.headline}
        </h1>
        <p className="text-lg md:text-xl opacity-80">
          {text.subheadline}
        </p>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  )
}

function LeftPanel({ text, activeSlide }: { text: any; activeSlide: number }) {
  const slide = text.slides[activeSlide]

  return (
    <div
      className="w-[38%] h-screen sticky top-0 flex flex-col justify-center p-12 dot-pattern"
      style={{ background: 'var(--theme-cream)' }}
    >
      <div className="max-w-md">
        <p className="text-xs uppercase tracking-widest opacity-50 mb-4">
          {slide?.label}
        </p>
        <h2 
          className="font-serif text-5xl mb-4 transition-all duration-300"
          style={{ color: 'var(--theme-dark)' }}
        >
          {slide?.title}
        </h2>
        <p className="text-lg opacity-60 mb-6">
          {slide?.subtitle}
        </p>
        <p className="opacity-70 leading-relaxed">
          {slide?.desc}
        </p>
        
        {/* Navigation Dots */}
        <div className="flex gap-2 mt-8">
          {text.slides.map((_: any, i: number) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeSlide 
                  ? 'bg-[var(--theme-orange)] w-6' 
                  : 'bg-[var(--theme-taupe)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RightPanel({ 
  media, 
  text, 
  onSlideChange 
}: { 
  media: any
  text: any
  onSlideChange: (index: number) => void 
}) {
  return (
    <div className="w-[62%]">
      {text.slides.map((slide: any, index: number) => (
        <Slide
          key={index}
          index={index}
          media={media[`slide${index}` as keyof typeof media]}
          onActive={() => onSlideChange(index)}
        />
      ))}
    </div>
  )
}

function Slide({ 
  index, 
  media, 
  onActive 
}: { 
  index: number
  media: any
  onActive: () => void 
}) {
  const slideRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slideRef.current || !bgRef.current) return

    // Slide up animation for slides after the first
    if (index > 0) {
      gsap.fromTo(
        bgRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: slideRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.8,
          },
        }
      )
    }

    // Track active slide
    ScrollTrigger.create({
      trigger: slideRef.current,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: onActive,
      onEnterBack: onActive,
    })
  }, [index, onActive])

  const overlayColors = [
    'rgba(20, 30, 50, 0.5)',
    'rgba(30, 50, 40, 0.5)',
    'rgba(50, 80, 100, 0.45)',
    'rgba(20, 40, 60, 0.5)',
    'rgba(10, 20, 30, 0.5)',
  ]

  return (
    <div
      ref={slideRef}
      className="h-screen w-full sticky top-0 overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ transform: index === 0 ? 'translateY(0)' : undefined }}
      >
        {/* Background Media */}
        {media.type === 'video' ? (
          <video
            src={media.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={media.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={{ background: overlayColors[index] }}
        />
      </div>
    </div>
  )
}

function Footer({ text }: { text: any }) {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!footerRef.current) return

    gsap.from(footerRef.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }, [])

  return (
    <section
      className="h-screen flex items-center justify-center dot-pattern"
      style={{ background: 'var(--theme-cream)' }}
    >
      <div ref={footerRef} className="text-center">
        <h2 
          className="font-serif text-5xl md:text-7xl mb-8"
          style={{ color: 'var(--theme-dark)' }}
        >
          {text.tagline}
        </h2>
        <button
          className="px-8 py-4 rounded-full text-white font-medium transition-transform hover:scale-105"
          style={{ background: 'var(--theme-orange)' }}
        >
          {text.cta}
        </button>
      </div>
    </section>
  )
}
