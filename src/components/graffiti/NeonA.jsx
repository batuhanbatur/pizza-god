import { useContext, useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useMotionValueEvent, animate, useReducedMotion } from 'framer-motion'
import { AccessibilityContext } from '../../context/AccessibilityContext'

// A scroll-past must not consume the once-only trigger — only a sustained view counts.
const DWELL_MS = 600

export default function NeonA({ className, style }) {
  const { reduceGraffiti } = useContext(AccessibilityContext)
  const prefersReducedMotion = useReducedMotion()
  const motionDisabled = reduceGraffiti || prefersReducedMotion

  const angle = useMotionValue(0)
  const spin = useTransform(angle, a => `rotate(${a} 96 76)`)
  const barRef = useRef(null)

  useMotionValueEvent(spin, 'change', (v) => {
    barRef.current?.setAttribute('transform', v)
  })

  // Same resting values the old whileInView `initial`s held (dead tube hidden, lit
  // layers fully lit) — now driven imperatively so the sequence can be gated by dwell.
  const deadTubeOpacity = useMotionValue(0)
  const haloOpacity = useMotionValue(1)
  const tubeOpacity = useMotionValue(1)
  const coreOpacity = useMotionValue(1)

  const [hasPlayed, setHasPlayed] = useState(false)
  const dwellTimer = useRef(null)

  useEffect(() => () => clearTimeout(dwellTimer.current), [])

  useEffect(() => {
    if (!hasPlayed) return

    animate(angle, [0, -108, -68, -100, -80, -94, -86], {
      duration: 3,
      times: [0, 0.08, 0.19, 0.33, 0.50, 0.70, 1],
      ease: 'linear',
      delay: 2.5,
    })
    animate(deadTubeOpacity, [0, 0, 1], { duration: 3.4, times: [0, 0.882, 1], delay: 2.5 })
    animate(haloOpacity, [1, 0.1, 0.8, 0.05, 0.5, 0.2, 0.6, 0], {
      duration: 3.4,
      times: [0, 0.106, 0.247, 0.353, 0.485, 0.635, 0.882, 1],
      delay: 2.5,
    })
    animate(tubeOpacity, [1, 1, 0], { duration: 3.4, times: [0, 0.882, 1], delay: 2.5 })
    animate(coreOpacity, [1, 0.7, 0.9, 0.55, 0.8, 0.65, 0.9, 0], {
      duration: 3.4,
      times: [0, 0.132, 0.265, 0.397, 0.529, 0.688, 0.882, 1],
      delay: 2.5,
    })
    // hasPlayed only ever flips false -> true (see handleViewportEnter), so this runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPlayed])

  // Dwell gate: entering view (>=60%) arms a 600ms timer instead of playing immediately.
  // A scroll-past leaves view before the timer fires, so onViewportLeave cancels it.
  // hasPlayed itself (not viewport.once) is what makes the eventual play permanent.
  const handleViewportEnter = () => {
    if (motionDisabled || hasPlayed) return
    dwellTimer.current = setTimeout(() => setHasPlayed(true), DWELL_MS)
  }

  const handleViewportLeave = () => {
    clearTimeout(dwellTimer.current)
  }

  return (
    <svg
      viewBox="0 0 130 125"
      overflow="visible"
      className={className}
      style={style}
      fill="none"
      role="img"
      aria-label="A"
    >
      <defs>
        <filter id="neonHaloA" filterUnits="userSpaceOnUse" x="0" y="0" width="130" height="125">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="neonSoftA" filterUnits="userSpaceOnUse" x="0" y="0" width="130" height="125">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      <motion.g
        id="neon-a"
        strokeLinecap="round"
        onViewportEnter={handleViewportEnter}
        onViewportLeave={handleViewportLeave}
        viewport={{ amount: 0.6 }}
      >

        <g id="a-legs" strokeLinecap="round">
          {/* layer 1: halos */}
          <g stroke="#39FF14" strokeWidth="13" opacity="0.5" filter="url(#neonHaloA)">
            <line x1="61.9" y1="10.2" x2="11.1" y2="109.8" />
            <line x1="68.1" y1="10.2" x2="118.9" y2="109.8" />
          </g>
          {/* layer 2: tube bodies */}
          <g stroke="#5fe84a" strokeWidth="7" filter="url(#neonSoftA)">
            <line x1="61.9" y1="10.2" x2="11.1" y2="109.8" />
            <line x1="68.1" y1="10.2" x2="118.9" y2="109.8" />
          </g>
          {/* layer 3: hot cores */}
          <g stroke="#eaffe6" strokeWidth="2.4">
            <line x1="61.9" y1="10.2" x2="11.1" y2="109.8" />
            <line x1="68.1" y1="10.2" x2="118.9" y2="109.8" />
          </g>
        </g>

        {/* crossbar: right joint (96, 76) is the hinge the pendulum swings from */}
        <g
          ref={barRef}
          id="a-crossbar"
          strokeLinecap="round"
          transform="rotate(0 96 76)"
        >
          {/* dead tube: gray neon-glass look — dim gray outer glow + lighter gray inner core, hidden until the tube dies */}
          <motion.g style={{ opacity: deadTubeOpacity }}>
            <line x1="34" y1="76" x2="96" y2="76" stroke="#7A7A7A" strokeWidth="6" filter="url(#neonSoftA)" />
            <line x1="34" y1="76" x2="96" y2="76" stroke="#C7C7C7" strokeWidth="1.9" />
          </motion.g>

          {/* layer 1: halo — stutters hard during the swing, then dies */}
          <motion.g style={{ opacity: haloOpacity }}>
            <g stroke="#39FF14" strokeWidth="13" opacity="0.5" filter="url(#neonHaloA)">
              <line x1="34" y1="76" x2="96" y2="76" />
            </g>
          </motion.g>

          {/* layer 2: tube body — steady during the swing, then dies with glow/core (otherwise it masks the dead tube) */}
          <motion.g style={{ opacity: tubeOpacity }}>
            <g stroke="#5fe84a" strokeWidth="7" filter="url(#neonSoftA)">
              <line x1="34" y1="76" x2="96" y2="76" />
            </g>
          </motion.g>

          {/* layer 3: hot core — stutters shallow during the swing, then dies */}
          <motion.g style={{ opacity: coreOpacity }}>
            <g stroke="#eaffe6" strokeWidth="2.4">
              <line x1="34" y1="76" x2="96" y2="76" />
            </g>
          </motion.g>
        </g>
      </motion.g>
    </svg>
  )
}
