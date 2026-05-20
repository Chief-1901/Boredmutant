import { motion } from "framer-motion";
import { fadeLeft, fadeUp, listStagger, sectionStagger, viewport } from "../lib/motion.js";

const groups = [
  {
    label: "CRMs",
    items: ["HubSpot", "Salesforce", "Pipedrive", "Zoho", "Copper"]
  },
  {
    label: "Accounting",
    items: ["Xero", "QuickBooks", "FreshBooks", "Sage", "NetSuite"]
  },
  {
    label: "Insurance / AMS",
    items: ["Applied Epic", "AMS360", "EZLynx", "HawkSoft", "Vertafore"]
  },
  {
    label: "Real estate",
    items: ["Lone Wolf", "kvCORE", "Dotloop", "MLS feeds", "BoomTown"]
  },
  {
    label: "Productivity",
    items: ["Microsoft 365", "Google Workspace", "Slack", "Notion", "Airtable"]
  },
  {
    label: "Documents & signing",
    items: ["DocuSign", "Adobe Sign", "PDF parsing", "OCR", "Templated PDFs"]
  }
];

export default function Tools() {
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
          04 — Compatibility
        </motion.p>
        <motion.h2 variants={fadeLeft}>Connects to your existing tools</motion.h2>
        <motion.p
          variants={fadeUp}
          style={{ maxWidth: "680px", marginBottom: "28px", color: "var(--ink-soft)" }}
        >
          I wire automations into the systems you already pay for. If it has an API,
          a CSV export, an email inbox, or a screen — it can be talked to.
        </motion.p>
        <motion.div className="tools" variants={listStagger}>
          {groups.map((g) => (
            <motion.div className="tool-group" key={g.label} variants={fadeUp}>
              <h4>{g.label}</h4>
              <ul className="items">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.p className="tools-note" variants={fadeUp}>
          + custom integrations for in-house systems, legacy databases, and carrier
          portals that don't publish an API.
        </motion.p>
      </motion.div>
    </section>
  );
}
