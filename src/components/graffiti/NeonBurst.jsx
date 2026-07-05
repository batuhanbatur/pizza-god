const FOCAL = { x: 550, y: 460 }

const RAYS = [
  { angle: 152.3, distance: 352, length: 70 },  // far left, low, flat
  { angle: 137.8, distance: 332, length: 110 },
  { angle: 122.2, distance: 313, length: 80 },
  { angle: 105.6, distance: 310, length: 120 },
  { angle: 94.1, distance: 321, length: 90 },
  { angle: 86.0, distance: 276, length: 120 },  // top-center, steep/upright
  { angle: 74.8, distance: 320, length: 85 },
  { angle: 60.1, distance: 271, length: 125 },
  { angle: 44.5, distance: 335, length: 75 },
  { angle: 31.1, distance: 355, length: 115 },
  { angle: 22.3, distance: 375, length: 65 },  // far right, low, flat
]

// angle: degrees around FOCAL (180 = left horizon, 90 = straight up, 0 = right horizon)
// distance: px from FOCAL to the ray's inner end
// length: px the ray extends outward from its inner end
function polarPoint(angle, distance) {
  const rad = angle * Math.PI / 180
  return {
    x: FOCAL.x + Math.cos(rad) * distance,
    y: FOCAL.y - Math.sin(rad) * distance,
  }
}

export default function NeonBurst({ className, style }) {
  return (
    <svg
      viewBox="0 0 1100 420"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <filter id="neon-halo" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="420">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="neon-soft" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="420">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {RAYS.map((ray, i) => {
        const { x, y } = polarPoint(ray.angle, ray.distance)
        const x2 = x + ray.length
        return (
          <g key={i} strokeLinecap="round" transform={`rotate(${-ray.angle} ${x} ${y})`}>
            <line x1={x} y1={y} x2={x2} y2={y}
                  stroke="#39FF14" strokeWidth="11"
                  opacity="0.55" filter="url(#neon-halo)" />
            <line x1={x} y1={y} x2={x2} y2={y}
                  stroke="#5fe84a" strokeWidth="6"
                  filter="url(#neon-soft)" />
            <line x1={x} y1={y} x2={x2} y2={y}
                  stroke="#eaffe6" strokeWidth="2.2" />
          </g>
        )
      })}
    </svg>
  )
}
