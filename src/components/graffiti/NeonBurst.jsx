import useIsMobile from '../../hooks/useIsMobile'

const FOCAL = { x: 550, y: 460 }
const FOCAL_MOBILE = { x: 250, y: 250 }

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

// Own square stage (0 0 500 500) and its own focal point — NOT the desktop
// viewBox squeezed into a portrait slot. Upward fan/arc like desktop (all
// rays above the wordmark, none below or at word height), same character as
// desktop's RAYS: irregular angle spacing, outer rays sit farther from focal
// (more tilted/spread), lengths alternate long-short. For every ray,
// distance + length + ~30 (halo stroke + blur margin) stays under 250 (the
// distance from FOCAL_MOBILE to any viewBox edge), so nothing clips.
const RAYS_MOBILE = [
  { angle: 170, distance: 145, length: 55 },  // far left, outer
  { angle: 125, distance: 125, length: 70 },
  { angle: 100, distance: 100, length: 45 },  // near top-center
  { angle: 85, distance: 105, length: 65 },   // near top-center
  { angle: 60, distance: 130, length: 50 },
  { angle: 30, distance: 150, length: 60 },   // far right, outer
]

// angle: degrees around the focal point (180 = left horizon, 90 = straight up, 0 = right horizon)
// distance: px from the focal point to the ray's inner end
// length: px the ray extends outward from its inner end
function polarPoint(angle, distance, focal) {
  const rad = angle * Math.PI / 180
  return {
    x: focal.x + Math.cos(rad) * distance,
    y: focal.y - Math.sin(rad) * distance,
  }
}

export default function NeonBurst({ className, style }) {
  const isMobile = useIsMobile()
  const rays = isMobile ? RAYS_MOBILE : RAYS
  const focal = isMobile ? FOCAL_MOBILE : FOCAL
  const stageWidth = isMobile ? 500 : 1100
  const stageHeight = isMobile ? 500 : 420

  return (
    <svg
      viewBox={`0 0 ${stageWidth} ${stageHeight}`}
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <filter id="neon-halo" filterUnits="userSpaceOnUse" x="0" y="0" width={stageWidth} height={stageHeight}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="neon-soft" filterUnits="userSpaceOnUse" x="0" y="0" width={stageWidth} height={stageHeight}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {rays.map((ray, i) => {
        const { x, y } = polarPoint(ray.angle, ray.distance, focal)
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
