'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPublicThemes, getPopularThemes, type Theme } from '@/lib/supabase'
import { BarChart } from '@/components/admin/bar-chart'
import { PieChart } from '@/components/admin/pie-chart'
import { LineChart } from '@/components/admin/line-chart'
import { formatNumber } from '@/lib/utils'
import { TrendingUp, Heart, Eye, Users } from 'lucide-react'

export default function AdminPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalThemes: 0,
    totalLikes: 0,
    totalViews: 0,
    avgLikes: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const data = await getPublicThemes(100)
    setThemes(data)
    
    const totalLikes = data.reduce((sum, t) => sum + (t.likes || 0), 0)
    const totalViews = data.reduce((sum, t) => sum + (t.views || 0), 0)
    
    setStats({
      totalThemes: data.length,
      totalLikes,
      totalViews,
      avgLikes: data.length ? Math.round(totalLikes / data.length) : 0,
    })
    
    setIsLoading(false)
  }

  // Prepare chart data
  const topThemes = [...themes]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 8)
    .map((t) => ({
      name: t.name.slice(0, 12),
      likes: t.likes || 0,
    }))

  const colorDistribution = themes.reduce((acc, theme) => {
    const primary = theme.colors?.accentOrange || '#e85d24'
    const hue = getHueFromHex(primary)
    const colorName = getColorName(hue)
    acc[colorName] = (acc[colorName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(colorDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  // Mock time series data (in real app, you'd track this in Supabase)
  const timeSeriesData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    themes: Math.floor(Math.random() * 10) + 1,
    views: Math.floor(Math.random() * 100) + 20,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your theme performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalThemes)}</p>
                <p className="text-sm text-muted-foreground">Total Themes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalLikes)}</p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgLikes}</p>
                <p className="text-sm text-muted-foreground">Avg Likes/Theme</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Themes by Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={topThemes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={timeSeriesData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Themes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Author</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Likes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Colors</th>
                </tr>
              </thead>
              <tbody>
                {themes.slice(0, 10).map((theme) => (
                  <tr key={theme.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-3 px-4 text-sm font-medium">{theme.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{theme.author || 'Anonymous'}</td>
                    <td className="py-3 px-4 text-sm">{theme.likes || 0}</td>
                    <td className="py-3 px-4 text-sm">{theme.views || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {Object.values(theme.colors || {}).slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color as string }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions
function getHueFromHex(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return Math.round(h * 360)
}

function getColorName(hue: number): string {
  if (hue < 30) return 'Red'
  if (hue < 60) return 'Orange'
  if (hue < 90) return 'Yellow'
  if (hue < 150) return 'Green'
  if (hue < 210) return 'Cyan'
  if (hue < 270) return 'Blue'
  if (hue < 330) return 'Purple'
  return 'Red'
}
