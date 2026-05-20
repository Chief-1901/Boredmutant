import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, viewport } from "../lib/motion.js";

const steps = [
  "15-minute call — you show me the manual task wasting the most time.",
  "I build it — fixed price and timeline agreed in writing, before any payment.",
  "You run it — with a short handover and 30 days of support included."
];

const numberVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 18 }
  }
};

export default function Steps() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="split">
          <motion.div
            className="split-head"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p className="section-eyebrow" variants={fadeLeft}>
              05 — Process
            </motion.p>
            <motion.h2 variants={fadeLeft}>How it works</motion.h2>
            <motion.p className="intro" variants={fadeLeft}>
              Three steps, no surprises. You'll know the scope and the price before
              any money moves.
            </motion.p>
          </motion.div>

          <motion.ol
            className="steps split-body"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {steps.map((text, i) => (
              <motion.li key={i} variants={fadeUp}>
                <motion.span className="num" variants={numberVariant}>
                  {i + 1}.
                </motion.span>
                <p>{text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
