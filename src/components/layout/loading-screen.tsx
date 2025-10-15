'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';

export function LoadingScreen() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <Icons.Logo className="h-20 w-20 text-primary" />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-bold tracking-tight text-primary font-headline"
        >
          UniIlorin VehiclePass
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          Loading Application...
        </motion.p>
      </motion.div>
    </div>
  );
}
