import { motion } from "framer-motion";
import { EMAIL, EMAIL_HREF } from "../lib/config.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className="site"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="wrap">
        <a href="/" className="brand" aria-label="Bored Mutant home">
          <img src="/assets/bored-mutant-wordmark.svg" alt="Bored Mutant" />
        </a>
        <div className="meta">
          <span>Independent automation studio</span>
          <span>·</span>
          <a href={EMAIL_HREF}>{EMAIL}</a>
          <span>·</span>
          <span>© {year}</span>
        </div>
      </div>
    </motion.footer>
  );
}
