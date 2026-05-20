import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, viewport } from "../lib/motion.js";

const items = [
  {
    n: "01",
    title: "Working automation, deployed",
    body: "Live on your infrastructure (your cloud or a small dedicated server), running on a schedule or trigger you control."
  },
  {
    n: "02",
    title: "Source code + configuration",
    body: "In a Git repository you own. Documented, formatted, with sensible commit history — not a black box."
  },
  {
    n: "03",
    title: "Plain-English runbook",
    body: "A short doc explaining what runs when, what to do if it stops, and which credentials live where. Written for an office manager, not an engineer."
  },
  {
    n: "04",
    title: "Encrypted credentials handover",
    body: "API keys, account logins, and secrets transferred via 1Password or your password manager. Nothing emailed."
  },
  {
    n: "05",
    title: "30-day support channel",
    body: "Direct email or Slack DM with me. Bug fixes and small tweaks included, no ticket queue."
  },
  {
    n: "06",
    title: "Handover call",
    body: "30 minutes — I walk through how it works, you walk away knowing what to do when (not if) something looks wrong."
  }
];

export default function Deliverables() {
  return (
    <section className="block">
      <motion.div
        className="wrap"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="split">
          <motion.div
            className="split-head"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p className="section-eyebrow" variants={fadeLeft}>
              06 — Deliverables
            </motion.p>
            <motion.h2 variants={fadeLeft}>What you receive at handover</motion.h2>
            <motion.p className="intro" variants={fadeLeft}>
              The exact handover bundle. Nothing held back, nothing only-I-can-touch.
              If you ever want to take it in-house or hand it to another engineer,
              everything's there.
            </motion.p>
          </motion.div>

          <motion.div
            className="split-body"
            variants={listStagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="deliverables">
              {items.map((it) => (
                <motion.div className="deliverable" key={it.n} variants={fadeUp}>
                  <span className="num">{it.n}</span>
                  <div>
                    <h4>{it.title}</h4>
                    <p>{it.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
