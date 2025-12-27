import { Sidebar } from '@/components/studio/sidebar'
import { Toast } from '@/components/ui/toast'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Toast />
    </div>
  )
}
