import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, sectionStagger, viewport } from "../lib/motion.js";

const builds = [
  {
    tag: "Insurance",
    title: "Insurance agencies",
    body:
      "Quote and policy data moves between carrier portals and your AMS automatically. ACORDs and certificates generated in seconds, not hours."
  },
  {
    tag: "Real estate",
    title: "Real estate brokerages",
    body:
      "Listings, contracts, and client follow-ups handled automatically across your CRM, MLS, and email."
  },
  {
    tag: "Accounting",
    title: "Accounting & professional services",
    body:
      "Invoices, document collection, and client onboarding automated end-to-end — in your firm's format."
  }
];

export default function Builds() {
  return (
    <section className="block" id="what-i-build">
      <motion.div
        className="wrap"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.p className="section-eyebrow" variants={fadeLeft}>
          02 — Who it's for
        </motion.p>
        <motion.h2 variants={fadeLeft}>What I build</motion.h2>
        <motion.div className="builds" variants={listStagger}>
          {builds.map((b) => (
            <motion.div
              className="build"
              key={b.title}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <p className="tag">{b.tag}</p>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.p className="builds-note" variants={fadeUp}>
          Don't see your industry? The pattern is the same — wherever your team is
          re-typing the same data, I can automate it. Every build is custom to your
          workflow. Fixed scope, fixed fee, agreed on the call — no hourly billing, no
          surprises.
        </motion.p>
      </motion.div>
    </section>
  );
}
