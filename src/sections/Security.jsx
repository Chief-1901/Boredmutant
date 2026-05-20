import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, viewport } from "../lib/motion.js";

const items = [
  {
    title: "Your data stays in your accounts",
    body:
      "I don't move client records onto a third-party platform. Automations run against the systems you already control."
  },
  {
    title: "Runs on infrastructure you own",
    body:
      "Deployed to your cloud (AWS, Azure, GCP) or a small dedicated server you keep — not locked inside a vendor product."
  },
  {
    title: "No long-term lock-in",
    body:
      "You receive the source code and configuration on day one. If you ever want to take it in-house, you can."
  },
  {
    title: "NDA before sensitive data",
    body:
      "Happy to sign a mutual NDA before you share anything client-identifying. Standard practice, not paperwork theatre."
  }
];

export default function Security() {
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
              07 — Security & data
            </motion.p>
            <motion.h2 variants={fadeLeft}>Your data, your infrastructure</motion.h2>
            <motion.p className="intro" variants={fadeLeft}>
              The most common worry from owners on the first call. The answer is
              built into how every project is architected.
            </motion.p>
          </motion.div>

          <motion.div
            className="security-grid split-body"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {items.map((it) => (
              <motion.div
                key={it.title}
                className="security-item"
                variants={fadeUp}
                whileHover={{
                  y: -2,
                  borderColor: "#0891b2",
                  transition: { duration: 0.2 }
                }}
              >
                <h4>{it.title}</h4>
                <p>{it.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
