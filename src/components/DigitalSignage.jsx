import React, { useState, useEffect } from "react";
import { destinations, flights } from "../lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Star } from "lucide-react";

export function DigitalSignage() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentFlight] = useState(flights[0]);

  // Rotate through destinations every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex(
        (prev) => (prev + 1) % destinations.length,
      );
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const currentDestination = destinations[currentAdIndex];

  return (
    <div className="h-full bg-black relative overflow-hidden">
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAdIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={currentDestination.imageUrl}
            alt={currentDestination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-12 text-white">
        {/* Top Bar - Flight Context */}
        <div className="flex items-center justify-between">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm opacity-80">
                  Now Boarding
                </p>
                <p className="text-xl">
                  {currentFlight.flightNumber}
                </p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm opacity-80">
                  Destination
                </p>
                <p className="text-xl">
                  {currentFlight.destination
                    .split("(")[0]
                    .trim()}
                </p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm opacity-80">Gate</p>
                <p className="text-xl">{currentFlight.gate}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-80">
                  Current Time
                </p>
                <p className="text-xl">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAdIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Destination Name */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      Featured Destination
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-7xl leading-tight"
              >
                {currentDestination.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-2xl opacity-90 max-w-3xl"
              >
                {currentDestination.description}
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="grid grid-cols-4 gap-6 max-w-4xl"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Star className="h-8 w-8 mb-3 text-yellow-400 fill-yellow-400" />
                <p className="text-3xl mb-1">
                  {currentDestination.rating}
                </p>
                <p className="text-sm opacity-80">Rating</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Calendar className="h-8 w-8 mb-3" />
                <p className="text-sm mb-1">Best Time</p>
                <p className="opacity-80">
                  {currentDestination.bestTime}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <MapPin className="h-8 w-8 mb-3" />
                <p className="text-sm mb-1">Location</p>
                <p className="opacity-80">
                  {currentDestination.country}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-1">R</div>
                <p className="text-sm opacity-80">
                  {currentDestination.avgCost}
                </p>
              </div>
            </motion.div>

            {/* Popular Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="space-y-3"
            >
              <p className="text-sm opacity-80 uppercase tracking-wider">
                Popular Activities
              </p>
              <div className="flex flex-wrap gap-3">
                {currentDestination.activities
                  .slice(0, 5)
                  .map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
                    >
                      {activity}
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Bar */}
        <div className="flex items-end justify-between">
          {/* Logo & CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl">
                  Gateway Discoveries
                </h2>
                <p className="opacity-80">
                  Explore Your Next Adventure
                </p>
              </div>
            </div>

            <div className="bg-white text-black rounded-2xl px-8 py-4 inline-block">
              <p className="text-xl">
                Find us at the Interactive Kiosks
              </p>
              <p className="text-sm opacity-70">
                Terminals 1 & 2 • Arrivals & Departures
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {destinations.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentAdIndex
                    ? "w-12 bg-white"
                    : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}