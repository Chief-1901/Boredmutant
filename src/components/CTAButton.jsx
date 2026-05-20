import { motion } from "framer-motion";
import { CTA_HREF, CTA_IS_EXTERNAL } from "../lib/config.js";
import { buttonHover } from "../lib/motion.js";

export default function CTAButton({ children = "Book a 15-minute call", className = "btn" }) {
  return (
    <motion.a
      className={className}
      href={CTA_HREF}
      target={CTA_IS_EXTERNAL ? "_blank" : undefined}
      rel={CTA_IS_EXTERNAL ? "noopener noreferrer" : undefined}
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      {children}
    </motion.a>
  );
}
