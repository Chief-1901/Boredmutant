import { motion } from "framer-motion";
import { listStagger, viewport } from "../lib/motion.js";

const metrics = [
  { num: "Fixed", suffix: null, label: "Scope and fee, agreed before payment" },
  { num: "1", suffix: "engineer", label: "End-to-end, no handoffs" },
  { num: "30", suffix: "days", label: "Post-launch support" },
  { num: "0", suffix: null, label: "Account managers" }
];

const metricVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Metrics() {
  return (
    <section className="metrics" aria-label="At a glance">
      <motion.div
        className="wrap"
        variants={listStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {metrics.map((m) => (
          <motion.div className="metric" key={m.label} variants={metricVariant}>
            <p className="num">
              {m.num}
              {m.suffix && <span className="suffix">{m.suffix}</span>}
            </p>
            <p className="label">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
