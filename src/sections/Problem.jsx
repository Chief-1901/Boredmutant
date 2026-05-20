import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, viewport } from "../lib/motion.js";

const items = [
  "Staff re-keying the same data across multiple systems and spreadsheets",
  "Documents, forms, and contracts filled out by hand, one at a time",
  "Renewals, follow-ups, and deadlines tracked in spreadsheets and sticky notes",
  "Hours lost every week to copy-paste between tools that won't talk to each other"
];

export default function Problem() {
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
              01 — The problem
            </motion.p>
            <motion.h2 variants={fadeLeft}>Sound familiar?</motion.h2>
            <motion.p className="intro" variants={fadeLeft}>
              The tax on small businesses isn't the work itself — it's the work
              between the work.
            </motion.p>
          </motion.div>

          <motion.ul
            className="points split-body"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {items.map((item, i) => (
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
