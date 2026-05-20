import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, sectionStagger, viewport } from "../lib/motion.js";

const examples = [
  {
    kicker: "Accounting",
    text:
      "Pull invoice line items from supplier PDFs straight into Xero or QuickBooks — every Monday morning, no clicking required."
  },
  {
    kicker: "Insurance",
    text:
      "Generate a certificate of insurance for a renewing client in 60 seconds, in your agency's exact template, sent to the right inbox."
  },
  {
    kicker: "Real estate",
    text:
      "Sync new listings between your MLS, CRM, and public site — photos, descriptions, and status changes propagated automatically."
  },
  {
    kicker: "Professional services",
    text:
      "Turn every signed engagement letter into a kickoff packet — folder structure, intake form, and welcome email to the client and team."
  }
];

export default function Examples() {
  return (
    <section className="block">
      <motion.div
        className="wrap"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.p className="section-eyebrow" variants={fadeLeft}>
          03 — Where to start
        </motion.p>
        <motion.h2 variants={fadeLeft}>Concrete first builds</motion.h2>
        <motion.p
          variants={fadeUp}
          style={{ maxWidth: "680px", marginBottom: "28px", color: "var(--ink-soft)" }}
        >
          Most clients start with one of these. We refine the scope on the 15-minute
          call so the first build pays for itself inside a month.
        </motion.p>
        <motion.div className="examples" variants={listStagger}>
          {examples.map((e) => (
            <motion.div
              key={e.kicker + e.text.slice(0, 10)}
              className="example"
              variants={fadeUp}
              whileHover={{
                y: -3,
                borderColor: "#0891b2",
                transition: { duration: 0.2 }
              }}
            >
              <p className="kicker">{e.kicker}</p>
              <p>{e.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
