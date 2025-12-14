import React, { useState } from 'react';
import { DigitalSignage } from './DigitalSignage';
import { InteractiveKiosk } from './InteractiveKiosk';
import { Button } from './ui/button';
import { MonitorPlay, ArrowLeft, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicLanding({ onStaffLogin }) {
  const [showKiosk, setShowKiosk] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleTapToExplore = () => {
    setShowKiosk(true);
    setShowTapPrompt(false);
  };

  const handleBackToSignage = () => {
    setShowKiosk(false);
    setTimeout(() => setShowTapPrompt(true), 2000);
  };

  return (
    <div className="h-screen relative">
      <AnimatePresence mode="wait">
        {!showKiosk ? (
          <motion.div
            key="signage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <DigitalSignage />
            
            {/* Tap to Explore Prompt */}
            <AnimatePresence>
              {showTapPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 3, duration: 0.8 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform"
                    onClick={handleTapToExplore}
                  >
                    <MonitorPlay className="mr-3 h-6 w-6" />
                    Tap to Explore Destinations
                  </Button>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full"
                  >
                    👆 Touch here
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Staff Access Button */}
            <div className="absolute top-4 right-4 z-20">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm"
                onClick={() => onStaffLogin && onStaffLogin()}
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Staff Login
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="kiosk"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="h-full relative"
          >
            <InteractiveKiosk language={language} onLanguageChange={setLanguage} />
            
            {/* Back to Signage Button */}
            <div className="absolute top-4 left-4 z-20">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSignage}
                className="bg-white/90 backdrop-blur-sm text-xs sm:text-sm"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Back to Showcase
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}