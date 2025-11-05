import React from 'react';
import { Button } from './ui/Button';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Sparkles as SparklesIcon, Users as UsersIcon, MapPin as MapPinIcon, Calendar as CalendarIcon } from 'lucide-react';
/**
 * RewardCard Component
 * Displays a single reward option with Kickstarter-style UI
 */
const RewardCard = ({ reward, layoutMode, onPledge }) => {
  const {
    image_url,
    title,
    min_pledge_amount,
    description,
    backers,
    ships_to,
    estimated_delivery,
  } = reward;

  const isVertical = layoutMode === 'vertical';

  // Format price
  //  const priceLabel = `US$ ${min_pledge_amount}`;
  //  const pledgeActionLabel = `Pledge ${priceLabel}`;

  // Format delivery date
  const eta = estimated_delivery ? new Date(estimated_delivery).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBD';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full group"
    >
      <Card
        className={`overflow-hidden transition-all duration-300 h-full flex relative ${isVertical ? 'flex-col' : 'flex-col sm:flex-row'
          }`}
      >
        {/* Gradient Border Effect on Hover */}
        {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-sm">
          <div className="absolute inset-0 p-[2px] gradient-3">
            <div className="w-full h-full bg-white"></div>
          </div>
        </div> */}

        {/* Image Section */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${isVertical ? 'w-full aspect-[3/2]' : 'w-full sm:w-2/5 aspect-[3/2] sm:aspect-auto'
            }`}
        >
          <img
            src={image_url || reward.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Price Badge with Gradient */}
          {/* <motion.div
            className="absolute top-4 right-4 px-4 py-2 rounded-sm font-bold text-white shadow-lg flex items-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #FFB700 0%, #FF9603 100%)',
            }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-lg">{reward.min_pledge_amount}</span>
            <img src="/packages/coin.svg" alt="Coin" className="w-5 h-5" />
          </motion.div> */}

          {/* Sparkle Effect */}
          {/* <motion.div
            className="absolute top-4 left-4 text-white"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <SparklesIcon className="w-6 h-6 drop-shadow-lg" />
          </motion.div> */}
        </div>

        {/* Content Section */}
        <div className={`p-6 bg-white dark:bg-darker-2 flex flex-col flex-1 relative z-10 ${isVertical ? '' : 'sm:w-3/5'}`}>
          {/* Title with Animated Gradient Underline */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <motion.div
              className="h-1 rounded-sm gradient-2"
              initial={{ width: '3rem' }}
              whileHover={{ width: '6rem' }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary dark:text-white mb-5 flex-1 leading-relaxed">
            {description}
          </p>

          {/* Info Section with Glassmorphism */}
          <div
            className="space-y-3 mb-5 p-4 rounded-sm backdrop-blur-sm"
          // style={{
          //   background: 'linear-gradient(135deg, rgba(8, 148, 226, 0.05) 0%, rgba(30, 199, 148, 0.05) 100%)',
          //   border: '1px solid rgba(8, 148, 226, 0.1)',
          // }}
          >
            <motion.div
              className="flex items-center gap-3 text-sm text-foreground"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <span className="font-medium">
                <strong className="font-bold text-primary">{backers}</strong> người ủng hộ
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-sm text-foreground"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-8 h-8 rounded-sm bg-secondary/10 flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-secondary" strokeWidth={2} />
              </div>
              <span className="font-medium">Giao đến: {ships_to}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-sm text-foreground"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-8 h-8 rounded-sm bg-accent/10 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-accent" strokeWidth={2} />
              </div>
              <span className="font-medium">Giao hàng: {eta}</span>
            </motion.div>
          </div>

          {/* Action Buttons with Gradient */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full font-semibold bg-primary text-white shadow-lg relative overflow-hidden group/btn"
                onClick={() => onPledge && onPledge(reward)}
              >
                <span className="relative z-10">{min_pledge_amount} VND</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </Button>
            </motion.div>

            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full font-semibold relative overflow-hidden group/btn"
              >
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Xem chi tiết</span>
                <motion.div
                  className="absolute inset-0 gradient-2"
                  initial={{ y: '100%' }}
                  whileHover={{ y: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute inset-0 gradient-1 rounded-bl-full"></div>
        </div>
      </Card>
    </motion.div>
  );
}

export default RewardCard;
