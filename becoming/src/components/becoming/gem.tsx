import { cn } from '@/lib/utils'

interface GemProps {
  size?: number
  hue?: number
  className?: string
  float?: boolean
}

const CENTER = 50
const START_ANGLE = 22.5 // flat top/bottom octagon

function octagon(radius: number): [number, number][] {
  return Array.from({ length: 8 }, (_, k) => {
    const a = ((START_ANGLE + 45 * k) * Math.PI) / 180
    return [
      CENTER + radius * Math.cos(a),
      CENTER + radius * Math.sin(a),
    ] as [number, number]
  })
}

const toPoints = (pts: [number, number][]) =>
  pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

/**
 * A faceted brilliant-cut gemstone rendered as an octagonal table with eight
 * crown facets and a pavilion, lit with hue-themed gradients for a real,
 * jewel-like sparkle. The recurring visual signature for seasons & chapters.
 */
export function Gem({ size = 88, hue = 78, className, float = true }: GemProps) {
  const outer = octagon(46)
  const table = octagon(20)
  const id = `gem-${Math.round(hue)}`

  const c = (l: number, ch: number, alpha = 1) =>
    `oklch(${l} ${ch} ${hue}${alpha < 1 ? ` / ${alpha}` : ''})`

  // eight crown facets: each links an outer edge to the matching table edge
  const facets = outer.map((p, k) => {
    const next = (k + 1) % 8
    const quad: [number, number][] = [p, outer[next], table[next], table[k]]
    const lightish = k % 2 === 0
    return {
      points: toPoints(quad),
      fill: lightish ? c(0.74, 0.13) : c(0.58, 0.13),
      opacity: lightish ? 0.95 : 0.88,
    }
  })

  return (
    <div
      className={cn(
        'relative inline-grid place-items-center',
        float && 'animate-float-slow',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${c(0.78, 0.13, 0.55)}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="relative drop-shadow-[0_10px_28px_oklch(0_0_0_/_0.55)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-table`} cx="42%" cy="34%" r="75%">
            <stop offset="0%" stopColor={c(0.97, 0.04)} />
            <stop offset="45%" stopColor={c(0.85, 0.1)} />
            <stop offset="100%" stopColor={c(0.66, 0.14)} />
          </radialGradient>
          <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(1 0 0 / 0.6)" />
            <stop offset="55%" stopColor="oklch(1 0 0 / 0)" />
          </linearGradient>
        </defs>

        {/* pavilion shadow ring for depth */}
        <polygon points={toPoints(octagon(47.5))} fill={c(0.42, 0.12, 0.7)} />

        {/* crown facets */}
        {facets.map((f, i) => (
          <polygon
            key={i}
            points={f.points}
            fill={f.fill}
            opacity={f.opacity}
            stroke={c(0.96, 0.05, 0.45)}
            strokeWidth="0.4"
          />
        ))}

        {/* table */}
        <polygon
          points={toPoints(table)}
          fill={`url(#${id}-table)`}
          stroke={c(0.97, 0.04, 0.6)}
          strokeWidth="0.5"
        />

        {/* internal table facet lines */}
        <g stroke={c(0.96, 0.05, 0.3)} strokeWidth="0.35">
          {table.map(([x, y], k) => (
            <line key={k} x1={CENTER} y1={CENTER} x2={x} y2={y} />
          ))}
        </g>

        {/* top-left specular highlight */}
        <polygon points={toPoints(table)} fill={`url(#${id}-sheen)`} />
      </svg>
    </div>
  )
}

/** map season accent token -> hue used by Gem / Heatmap */
export const accentHue: Record<string, number> = {
  gold: 78,
  teal: 198,
  sage: 150,
  rose: 20,
  iris: 280,
}
