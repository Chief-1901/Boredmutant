import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton.jsx";
import { fadeUp, heroStagger } from "../lib/motion.js";

export default function Hero() {
  return (
    <section className="hero">
      <motion.div
        className="wrap"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow" variants={fadeUp}>
          <span className="dot" aria-hidden="true" />
          Independent automation studio · Est. 2026
        </motion.p>
        <motion.h1 variants={fadeUp}>
          Custom AI tools for small businesses — fixed fee, agreed before you pay.
        </motion.h1>
        <motion.p className="lede" variants={fadeUp}>
          Stop paying staff to re-key the same data between the systems that run your
          business. I build the automation that does it for you, wired to exactly how
          you already work.
        </motion.p>
        <motion.div className="hero-cta-row" variants={fadeUp}>
          <CTAButton />
          <span className="meta">Fixed scope · Fixed fee · Agreed before you pay</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
