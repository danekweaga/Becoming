'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type ReactNode,
  type CSSProperties,
} from 'react'

export interface LogoItem {
  node: ReactNode
  title?: string
  href?: string
  ariaLabel?: string
}

interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: number | string
  logoHeight?: number
  gap?: number
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }

const toCssLength = (value?: number | string) =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined)

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = 'Partner logos',
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLUListElement>(null)

  const [seqWidth, setSeqWidth] = useState(0)
  const [seqHeight, setSeqHeight] = useState(0)
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const isVertical = direction === 'up' || direction === 'down'

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed)
    const directionMultiplier = isVertical
      ? direction === 'up'
        ? 1
        : -1
      : direction === 'left'
        ? 1
        : -1
    const speedMultiplier = speed < 0 ? -1 : 1
    return magnitude * directionMultiplier * speedMultiplier
  }, [speed, direction, isVertical])

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const sequenceRect = seqRef.current?.getBoundingClientRect?.()
    const sequenceWidth = sequenceRect?.width ?? 0
    const sequenceHeight = sequenceRect?.height ?? 0
    if (isVertical) {
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight))
        const viewport = containerRef.current?.clientHeight ?? sequenceHeight
        const copiesNeeded =
          Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth))
      const copiesNeeded =
        Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
    }
  }, [isVertical])

  useEffect(() => {
    updateDimensions()
    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
    const observers = [containerRef, seqRef].map((ref) => {
      if (!ref.current) return null
      const observer = new ResizeObserver(updateDimensions)
      observer.observe(ref.current)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [updateDimensions, logos, gap, logoHeight])

  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const seqSize = isVertical ? seqHeight : seqWidth

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp
      const deltaTime =
        Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp

      const target =
        isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * easingFactor

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize
        offsetRef.current = nextOffset
        track.style.transform = isVertical
          ? `translate3d(0, ${-nextOffset}px, 0)`
          : `translate3d(${-nextOffset}px, 0, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastTimestampRef.current = null
    }
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical])

  const cssVariables = useMemo(
    () =>
      ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
      }) as CSSProperties,
    [gap, logoHeight, fadeOutColor],
  )

  const rootClassName = [
    'logoloop',
    isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
    fadeOut && 'logoloop--fade',
    scaleOnHover && 'logoloop--scale-hover',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const renderLogoItem = (item: LogoItem, key: string) => {
    const content = (
      <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
        {item.node}
      </span>
    )
    const itemContent = item.href ? (
      <a
        className="logoloop__link"
        href={item.href}
        aria-label={item.ariaLabel || item.title || 'logo link'}
        target="_blank"
        rel="noreferrer noopener"
      >
        {content}
      </a>
    ) : (
      content
    )
    return (
      <li className="logoloop__item" key={key} role="listitem">
        {itemContent}
      </li>
    )
  }

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) =>
            renderLogoItem(item, `${copyIndex}-${itemIndex}`),
          )}
        </ul>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copyCount, logos],
  )

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width: isVertical
        ? toCssLength(width) === '100%'
          ? undefined
          : toCssLength(width)
        : (toCssLength(width) ?? '100%'),
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style, isVertical],
  )

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {logoLists}
      </div>
    </div>
  )
})

export default LogoLoop
