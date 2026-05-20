import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { barGrow, fadeUp, viewport } from "../lib/motion.js";

export default function Proof() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section className="proof" ref={ref}>
      <motion.div
        className="wrap"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.div className="bar" aria-hidden="true" variants={barGrow} />
        <motion.p variants={fadeUp} style={{ y: parallaxY }}>
          Built by an engineer, not an agency. The person on the call is the
          person who writes the code — and what they ship runs on your accounts,
          with a fixed fee agreed before any payment.
        </motion.p>
      </motion.div>
    </section>
  );
}
