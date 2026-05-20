import { motion } from "framer-motion";
import { CTA_HREF, CTA_IS_EXTERNAL } from "../lib/config.js";

export default function Header() {
  return (
    <motion.header
      className="site"
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="wrap">
        <a href="/" className="brand" aria-label="Bored Mutant">
          <img src="/assets/bored-mutant-wordmark.svg" alt="Bored Mutant" />
        </a>
        <motion.a
          className="header-cta"
          href={CTA_HREF}
          target={CTA_IS_EXTERNAL ? "_blank" : undefined}
          rel={CTA_IS_EXTERNAL ? "noopener noreferrer" : undefined}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18 }}
        >
          Book a 15-minute call
        </motion.a>
      </div>
    </motion.header>
  );
}
