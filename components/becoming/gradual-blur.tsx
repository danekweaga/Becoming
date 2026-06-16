'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'

type Position = 'top' | 'bottom' | 'left' | 'right'

interface GradualBlurProps {
  position?: Position
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
  opacity?: number
  animated?: boolean | 'scroll'
  duration?: string
  easing?: string
  hoverIntensity?: number
  target?: 'parent' | 'page'
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_CONFIG: Required<
  Pick<
    GradualBlurProps,
    | 'position'
    | 'strength'
    | 'height'
    | 'divCount'
    | 'exponential'
    | 'zIndex'
    | 'animated'
    | 'duration'
    | 'easing'
    | 'opacity'
    | 'curve'
    | 'target'
    | 'className'
  >
> & { style: React.CSSProperties } = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  target: 'parent',
  className: '',
  style: {},
}

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
}

const getGradientDirection = (position: Position) =>
  ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  })[position] || 'to bottom'

function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(props.animated !== 'scroll')

  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...props }),
    [props],
  )

  useEffect(() => {
    if (config.animated !== 'scroll' || !containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [config.animated])

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = []
    const increment = 100 / config.divCount
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength
    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear

    for (let i = 1; i <= config.divCount; i++) {
      const progress = curveFunc(i / config.divCount)
      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength

      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const direction = getGradientDirection(config.position)

      const divStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      }
      divs.push(<div key={i} style={divStyle} />)
    }
    return divs
  }, [config, isHovered])

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const isVertical = config.position === 'top' || config.position === 'bottom'
    const isPageTarget = config.target === 'page'
    const base: React.CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? `opacity ${config.duration} ${config.easing}`
        : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    }
    if (isVertical) {
      base.height = config.height
      base.width = config.width || '100%'
      base[config.position] = 0
      base.left = 0
      base.right = 0
    } else {
      base.width = config.width || config.height
      base.height = '100%'
      base[config.position] = 0
      base.top = 0
      base.bottom = 0
    }
    return base
  }, [config, isVisible])

  return (
    <div
      ref={containerRef}
      className={config.className}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
      aria-hidden="true"
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {blurDivs}
      </div>
    </div>
  )
}

export default React.memo(GradualBlur)
