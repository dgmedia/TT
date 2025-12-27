'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { toastAtom } from '@/lib/store'
import { cn } from '@/lib/utils'

export function Toast() {
  const [toast, setToast] = useAtom(toastAtom)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, setToast])

  if (!toast) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in slide-in-from-bottom-5 fade-in duration-300',
        toast.type === 'success' && 'bg-green-600 text-white',
        toast.type === 'error' && 'bg-red-600 text-white'
      )}
    >
      {toast.message}
    </div>
  )
}

export function useToast() {
  const [, setToast] = useAtom(toastAtom)
  
  return {
    toast: (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type })
    },
  }
}
