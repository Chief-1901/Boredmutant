import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, viewport } from "../lib/motion.js";

const reasons = [
  "You work directly with the engineer who builds it — no account managers, no handoffs.",
  "Fixed price and timeline agreed before any payment.",
  "Built around your existing tools — you don't change how you work."
];

export default function Why() {
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
              10 — Why me
            </motion.p>
            <motion.h2 variants={fadeLeft}>What you're actually buying</motion.h2>
          </motion.div>

          <motion.ul
            className="points split-body"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {reasons.map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
