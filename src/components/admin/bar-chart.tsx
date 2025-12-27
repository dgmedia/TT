'use client'

import { useEffect, useRef } from 'react'

interface BarChartProps {
  data: { name: string; likes: number }[]
}

export function BarChart({ data }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const vchartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const initChart = async () => {
      const VChart = (await import('@visactor/vchart')).default

      const spec = {
        type: 'bar',
        data: [{ values: data }],
        xField: 'name',
        yField: 'likes',
        bar: {
          style: {
            cornerRadius: 4,
            fill: {
              gradient: 'linear',
              x0: 0,
              y0: 0,
              x1: 0,
              y1: 1,
              stops: [
                { offset: 0, color: '#f97316' },
                { offset: 1, color: '#ea580c' },
              ],
            },
          },
        },
        axes: [
          {
            orient: 'bottom',
            label: { style: { fill: '#71717a', fontSize: 11 } },
            domainLine: { visible: false },
            tick: { visible: false },
          },
          {
            orient: 'left',
            label: { style: { fill: '#71717a', fontSize: 11 } },
            grid: { style: { stroke: '#27272a', lineDash: [4, 4] } },
            domainLine: { visible: false },
            tick: { visible: false },
          },
        ],
        background: 'transparent',
        padding: { top: 20, right: 20, bottom: 30, left: 40 },
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
