// Shared Framer Motion variants. "Moderate" intensity — stagger reveals,
// slide-in headings, calm springs that don't undermine the serious tone.

export const EASE_OUT = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT }
  }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE_OUT }
  }
};

export const heroStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.12
    }
  }
};

export const listStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08
    }
  }
};

export const sectionStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1
    }
  }
};

export const barGrow = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.7, ease: EASE_OUT }
  }
};

export const buttonHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -1,
    scale: 1.02,
    transition: { type: "spring", stiffness: 320, damping: 22 }
  },
  tap: { scale: 0.97, transition: { duration: 0.1 } }
};

export const viewport = { once: true, amount: 0.35 };
