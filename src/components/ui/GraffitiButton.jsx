import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GraffitiButton.css";

export default function GraffitiButton({ children = "Order Yourself", onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className="graffiti-button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <span className={`classic-text ${hovered ? "hide" : ""}`}>
        {children}
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="marker-text"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 100% 0 0)", transition: { duration: 0 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}