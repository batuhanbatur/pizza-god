export default function Drip({ variant, flip = false, width = '100%', height = '30px' }) {
  return (
    <svg
  viewBox="0 0 200 80"
  preserveAspectRatio="none"
  aria-hidden="true"
  style={{ width, height, display: 'block', pointerEvents: 'none' }}
>
      <use
        href={`#drip-${variant}`}
        transform={flip ? 'scale(-1,1) translate(-200,0)' : undefined}
      />
    </svg>
  )
}
