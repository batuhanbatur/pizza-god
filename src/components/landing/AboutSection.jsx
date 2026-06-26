export default function AboutSection({ visible }) {
  return (
    <div id="about-us" style={{ minHeight: '100vh', paddingTop: '280px', paddingLeft: 'calc(25vw + 130px)', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <h2>About Us</h2>
    </div>
  )
}
