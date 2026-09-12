import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file PageTransition.jsx
 * @description Smooth Framer Motion wrapper for page routes.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
