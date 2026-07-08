import { motion } from "framer-motion"

// Planned order-arrival animation (Phase 2 feature) — currently unmounted, do not delete.

// Timeline (seconds):
// 0.0–0.8  dot appears   0.8–1.2  descent   1.2–1.35 impact + flash
// 1.35–2.2 crater draws  2.2–3.0  dust      3.0–3.6  box   3.6–4.5 message

export default function DeliveryAnimation({ onComplete }) {
  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 60, overflow: 'hidden', backgroundColor: "#000000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        // fire onComplete after the full timeline ends
        if (onComplete) setTimeout(onComplete, 4800)
      }}
    >

      {/* ——— Scene 1–3: meteor (dot → descent → impact scale) ——— */}
      <motion.div
        style={{
          position: 'absolute',
          borderRadius: '9999px',
          left: "85%",
          top: "15%",
          width: 4,
          height: 4,
          backgroundColor: "#F5F2E8",
        }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          x: [0, 0, 150, 150, 150],
          y: [0, 0, 250, 250, 250],
          scale: [1, 1, 1, 40, 40],
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.53, 0.8, 0.9, 1], // 0.8s, 1.2s, 1.35s, 1.5s
          ease: ["linear", "easeIn", "easeIn", "linear"],
        }}
      />

      {/* trail strokes during descent */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(85% - ${10 + i * 14}px)`,
            top: `calc(15% - ${16 + i * 22}px)`,
            width: 2,
            height: 18,
            backgroundColor: "#F5F2E8",
            transform: "rotate(-31deg)",
          }}
          animate={{
            opacity: [0, 0, 0.6, 0],
            x: [0, 0, 150, 150],
            y: [0, 0, 250, 250],
          }}
          transition={{ duration: 1.35, times: [0, 0.59, 0.95, 1] }}
        />
      ))}

      {/* ——— Scene 3: full-screen flash ——— */}
      <motion.div
        style={{ position: 'absolute', inset: 0, backgroundColor: "#F5F2E8" }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.8, 0.9, 1] }}
      />

      {/* ——— Scenes 4–7: crater, dust, box, message ——— */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* crater */}
        <svg width="300" height="120" viewBox="0 0 300 120" fill="none">
          <motion.path
            d="M30 35 C50 22 75 32 100 26 C125 20 150 28 175 23 C200 19 225 30 248 25 C262 22 272 28 278 36 L262 62 C230 88 180 98 150 97 C115 96 70 86 40 60 Z"
            stroke="#F5F2E8"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.35, duration: 0.8, ease: "easeOut" }}
          />
        </svg>

        {/* dust */}
        <div style={{ position: 'absolute', display: 'flex', gap: '2.5rem', marginTop: -90 }}>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              style={{
                borderRadius: '9999px',
                width: 8 + (i % 2) * 5,
                height: 8 + (i % 2) * 5,
                border: "1.5px solid #F5F2E8",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
              transition={{ delay: 2.2 + i * 0.12, duration: 0.8 }}
            />
          ))}
        </div>

        {/* pizza box */}
        <motion.div
          className="font-zodiak"
          style={{
            position: 'absolute',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            border: "2px solid #F5F2E8",
            color: "#F5F2E8",
            marginTop: 30,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.6, ease: "easeOut" }}
        >
          PIZZA GOD
        </motion.div>

        {/* message */}
        <motion.div
          className="font-zodiak"
          style={{
            position: 'absolute',
            textAlign: 'center',
            letterSpacing: '0.3em',
            fontSize: '1.25rem',
            color: "#F5F2E8",
            marginTop: 200,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.9, ease: "easeOut" }}
        >
          YOUR OFFERING
          <br />
          HAS ARRIVED
        </motion.div>

      </div>
    </motion.div>
  )
}
