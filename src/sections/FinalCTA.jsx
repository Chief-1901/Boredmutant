import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton.jsx";
import { EMAIL, EMAIL_HREF } from "../lib/config.js";
import { fadeUp, sectionStagger, viewport } from "../lib/motion.js";

export default function FinalCTA() {
  return (
    <section className="final">
      <motion.div
        className="wrap"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.p className="kicker" variants={fadeUp}>
          See where AI can save your business hours every week.
        </motion.p>
        <motion.div className="stack" variants={fadeUp}>
          <CTAButton />
          <p className="email-line">
            Or email me directly: <a href={EMAIL_HREF}>{EMAIL}</a>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
