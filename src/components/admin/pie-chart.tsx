'use client'

import { useEffect, useRef } from 'react'

interface PieChartProps {
  data: { name: string; value: number }[]
}

export function PieChart({ data }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const vchartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const initChart = async () => {
      const VChart = (await import('@visactor/vchart')).default

      const colors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308', '#06b6d4']

      const spec = {
        type: 'pie',
        data: [{ values: data }],
        valueField: 'value',
        categoryField: 'name',
        outerRadius: 0.8,
        innerRadius: 0.5,
        pie: {
          style: {
            cornerRadius: 4,
          },
        },
        color: { type: 'ordinal', range: colors },
        label: {
          visible: true,
          style: {
            fill: '#a1a1aa',
            fontSize: 11,
          },
        },
        legends: {
          visible: true,
          orient: 'right',
          item: {
            label: { style: { fill: '#a1a1aa', fontSize: 11 } },
          },
        },
        background: 'transparent',
        padding: 20,
      }

      vchartRef.current = new VChart(spec, { dom: chartRef.current })
      vchartRef.current.renderSync()
    }

    initChart()

    return () => {
      vchartRef.current?.release()
    }
  }, [data])

  return <div ref={chartRef} style={{ width: '100%', height: 300 }} />
}
