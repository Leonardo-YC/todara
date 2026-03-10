'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type MascotState = 'neutral' | 'happy' | 'alert';

interface MascotFeedbackProps {
  state?: MascotState;
  size?: number;
}

export default function MascotFeedback({ state = 'neutral', size = 80 }: MascotFeedbackProps) {
  
  // Definimos qué imagen mostrar según el estado
  const mascotImages = {
    neutral: '/logos/todara-logo.svg',
    happy: '/logos/todara-happy.svg',
    alert: '/logos/todara-alert.svg',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            {/* Animación de "respiración" constante */}
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full"
            >
              <Image
                src={mascotImages[state]}
                alt={`Schnauzer ${state}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}