const RAYS = [
  [140, 290, 250, 200],
  [255, 245, 320, 165],
  [365, 235, 390, 150],
  [430, 230, 480, 70],
  [560, 200, 575, 115],
  [645, 245, 715, 110],
  [755, 265, 775, 220],
  [835, 300, 930, 195],
  [915, 360, 990, 300],
]

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
        <filter id="neon-halo" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="neon-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {RAYS.map(([x1, y1, x2, y2], i) => (
        <g key={i} strokeLinecap="round">
          <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#39FF14" strokeWidth="11"
                opacity="0.55" filter="url(#neon-halo)" />
          <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#5fe84a" strokeWidth="6"
                filter="url(#neon-soft)" />
          <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#eaffe6" strokeWidth="2.2" />
        </g>
      ))}
    </svg>
  )
}
