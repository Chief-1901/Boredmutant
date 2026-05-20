import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeLeft, viewport } from "../lib/motion.js";

const faqs = [
  {
    q: "What if my workflow is too unusual to automate?",
    a: "Almost every business owner says this on the first call, and almost every workflow turns out to fit a pattern I've built before. The 15-minute call is exactly for figuring out which parts are standard and which need custom logic — at no cost, before you commit to anything."
  },
  {
    q: "What happens after the 30 days of support?",
    a: "You keep running it. If you want me to keep maintaining or extending it, we agree a small monthly retainer based on what you actually need. No mandatory subscription, no hostage-taking. Most clients leave the first build running untouched for months."
  },
  {
    q: "Do I need to switch to a new system?",
    a: "No. The whole point is to keep your existing tools and have automation handle the work between them. If you're on Xero, Applied Epic, HubSpot, or a 20-year-old in-house database, I build around it."
  },
  {
    q: "How do you charge?",
    a: "Fixed fee per build, agreed in writing before any work starts. No hourly billing, no surprise invoices. Pricing depends on scope — I quote it on the 15-minute call once I understand what you actually need."
  },
  {
    q: "Can you sign an NDA?",
    a: "Yes — happy to sign a standard mutual NDA before you share client data, account screenshots, or anything else sensitive."
  },
  {
    q: "What if I want changes after launch?",
    a: "Within the 30 days of support, small adjustments are included. After that, change requests are quoted at a fixed fee — same model as the original build. You're never charged for time you didn't approve."
  }
];

const answerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.22, delay: 0.06 }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.26, ease: [0.4, 0, 0.6, 1] },
      opacity: { duration: 0.14 }
    }
  }
};

function FAQItem({ q, a, isOpen, onToggle, id }) {
  return (
    <div className="faq-item">
      <button
        className="faq-q"
        aria-expanded={isOpen}
        aria-controls={`faq-a-${id}`}
        onClick={onToggle}
      >
        <span>{q}</span>
        <motion.span
          className="chev"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-a"
            id={`faq-a-${id}`}
            role="region"
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="faq-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

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
              09 — Common questions
            </motion.p>
            <motion.h2 variants={fadeLeft}>What owners ask first</motion.h2>
            <motion.p className="intro" variants={fadeLeft}>
              Six questions that come up on almost every call. If yours isn't here,
              ask it on the call — there's no wrong question.
            </motion.p>
          </motion.div>

          <motion.div
            className="faq split-body"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.4 }}
          >
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                id={i}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
