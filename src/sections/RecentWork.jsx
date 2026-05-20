import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, sectionStagger, viewport } from "../lib/motion.js";

const stats = [
  { n: "Your code", l: "In a repo you own, readable by any engineer" },
  { n: "Your accounts", l: "All credentials live with you, encrypted handover" },
  { n: "Your cloud", l: "Runs on infrastructure you control, not mine" },
  { n: "No subscription", l: "One-time fixed fee — you don't pay me to keep it running" }
];

const statVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function RecentWork() {
  return (
    <section className="block recent">
      <motion.div
        className="wrap"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.p className="section-eyebrow" variants={fadeLeft}>
          08 — Why this matters to you
        </motion.p>
        <motion.h2 variants={fadeLeft}>Custom code beats vendor lock-in</motion.h2>

        <motion.div
          className="recent-card"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div>
            <p className="meta">Engineer, not a vendor reseller</p>
            <h3>Most "AI automation" is a subscription. This isn't.</h3>
            <p style={{ marginBottom: "14px" }}>
              Other AI automation services hand you a dashboard. You configure your
              workflows inside their platform, you pay a subscription forever, and if
              the vendor pivots — your automation pivots with them.
            </p>
            <p>
              I do the opposite. I write the actual code. It runs in your account, on
              infrastructure you own, in a repository with your name on it. If you
              ever decide to fire me, your automation keeps running. If you ever want
              another engineer to extend it, they can read the code and pick up where
              I left off.
            </p>
          </div>

          <motion.div
            className="recent-stats"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {stats.map((s) => (
              <motion.div className="recent-stat" key={s.l} variants={statVariant}>
                <p className="n">{s.n}</p>
                <p className="l">{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p className="recent-footnote" variants={fadeUp}>
          <span className="recent-footnote-label">Background</span> — most recently
          I shipped a 56,000-line autonomous AI system on my own, in under four
          months. That's the engineering depth that carries into every build I
          take on.
        </motion.p>
      </motion.div>
    </section>
  );
}
