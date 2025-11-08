import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <motion.div
            className='h-16 w-16 rounded-full border-4 border-primary/20'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className='absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary'
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className='absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-secondary'
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        <motion.p
          className='text-sm font-medium text-muted-foreground'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Đang tải...
        </motion.p>
      </div>
    </div>
  );
}
