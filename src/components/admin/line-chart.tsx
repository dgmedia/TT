'use client'

import { useEffect, useRef } from 'react'

interface LineChartProps {
  data: { day: string; themes: number; views: number }[]
}

export function LineChart({ data }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const vchartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const initChart = async () => {
      const VChart = (await import('@visactor/vchart')).default

      const spec = {
        type: 'common',
        data: [{ values: data }],
        series: [
          {
            type: 'line',
            xField: 'day',
            yField: 'themes',
            line: {
              style: {
                stroke: '#f97316',
                lineWidth: 2,
              },
            },
            point: {
              style: {
                fill: '#f97316',
                size: 6,
              },
            },
          },
          {
            type: 'line',
            xField: 'day',
            yField: 'views',
            line: {
              style: {
                stroke: '#3b82f6',
                lineWidth: 2,
              },
            },
            point: {
              style: {
                fill: '#3b82f6',
                size: 6,
              },
            },
          },
        ],
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
        legends: {
          visible: true,
          orient: 'top',
          data: [
            { label: 'Themes', shape: { fill: '#f97316' } },
            { label: 'Views', shape: { fill: '#3b82f6' } },
          ],
          item: {
            label: { style: { fill: '#a1a1aa', fontSize: 11 } },
          },
        },
        background: 'transparent',
        padding: { top: 40, right: 20, bottom: 30, left: 40 },
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
