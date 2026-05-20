import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, sectionStagger, viewport } from "../lib/motion.js";

function Arrow() {
  return (
    <div className="flow-arrow" aria-hidden="true">
      <svg viewBox="0 0 200 24" preserveAspectRatio="none">
        <motion.line
          x1="0"
          y1="12"
          x2="186"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.path
          d="M 184 6 L 196 12 L 184 18 Z"
          fill="currentColor"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
      </svg>
    </div>
  );
}

const nodeVariant = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function FlowDiagram() {
  return (
    <section className="block flow-section">
      <motion.div
        className="wrap"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.p className="section-eyebrow" variants={fadeLeft}>
          Architecture
        </motion.p>
        <motion.h2 variants={fadeLeft}>What an automation actually looks like</motion.h2>
        <motion.p
          variants={fadeUp}
          style={{
            maxWidth: "720px",
            color: "var(--ink-soft)",
            marginBottom: "24px"
          }}
        >
          A typical build is three components. Your existing system on each side,
          an automation engine in the middle. Nothing on a vendor portal you don't
          control, nothing waiting in a queue at another agency.
        </motion.p>

        <motion.div className="flow-canvas" variants={listStagger}>
          <motion.div className="flow-node" variants={nodeVariant}>
            <p className="flow-label">Source</p>
            <p className="flow-title">Carrier portal</p>
            <p className="flow-sub">
              PDF emails<br />Web forms<br />API or scraping
            </p>
          </motion.div>

          <Arrow />

          <motion.div className="flow-node engine" variants={nodeVariant}>
            <p className="flow-label">Automation engine</p>
            <p className="flow-title">Your infrastructure</p>
            <p className="flow-sub">
              Parse · validate<br />Transform · route<br />Log · alert · retry
            </p>
          </motion.div>

          <Arrow />

          <motion.div className="flow-node" variants={nodeVariant}>
            <p className="flow-label">Destination</p>
            <p className="flow-title">Your AMS / CRM</p>
            <p className="flow-sub">
              Records created<br />Docs generated<br />Team notified
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            marginTop: "20px",
            fontFamily: "var(--mono)",
            fontSize: "13.5px",
            color: "var(--muted)",
            letterSpacing: "0.01em"
          }}
        >
          // Same pattern works for any source → destination: invoices into
          accounting, listings into MLS, contracts into DocuSign, leads into your CRM.
        </motion.p>
      </motion.div>
    </section>
  );
}
