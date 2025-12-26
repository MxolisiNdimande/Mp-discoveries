import React, { useState, useEffect } from 'react';
import { DigitalSignage } from './DigitalSignage';
import { InteractiveKiosk } from './InteractiveKiosk';
import { FlightPortal } from './FlightPortal';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { MonitorPlay, ArrowLeft, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicLanding({ onStaffLogin, onExplore }) {
  const [showKiosk, setShowKiosk] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(true);
  const [showAccommodations, setShowAccommodations] = useState(false);
  const [showFlights, setShowFlights] = useState(false);
  const [kioskInitialView, setKioskInitialView] = useState(null);
  const [language, setLanguage] = useState('en');
  const [flightsData, setFlightsData] = useState([]);
  const [accommodationsData, setAccommodationsData] = useState([]);

  // Fetch flights on mount with fallback
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await apiService.getFlights();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        setFlightsData(data);
      } catch (err) {
        console.error('Failed to fetch flights:', err);
        toast.error('Failed to load scheduled flights. Showing sample data.');
        setFlightsData([
          { id: '1', airline: 'Air SA', flightNumber: 'SA123', status: 'On Time' },
          { id: '2', airline: 'Air SA', flightNumber: 'SA456', status: 'Delayed' },
          { id: '3', airline: 'FlyHigh', flightNumber: 'FH789', status: 'Cancelled' },
        ]);
      }
    };
    fetchFlights();
  }, []);

  // Fetch accommodations on mount with fallback
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await apiService.getAccommodations();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        setAccommodationsData(data);
      } catch (err) {
        console.error('Failed to fetch accommodations:', err);
        toast.error('Failed to load accommodations. Showing sample data.');
        setAccommodationsData([
          { id: '1', name: 'Ocean View Hotel', location: 'Cape Town', rating: 4.5 },
          { id: '2', name: 'Safari Lodge', location: 'Kruger', rating: 4.7 },
          { id: '3', name: 'City Central Inn', location: 'Johannesburg', rating: 4.2 },
        ]);
      }
    };
    fetchAccommodations();
  }, []);

  const handleTapToExplore = () => {
    setShowAccommodations(true);
    setShowTapPrompt(false);
  };

  const ensureSession = () => {
    try {
      let s = localStorage.getItem('session_id');
      if (!s) {
        s = `sess_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
        localStorage.setItem('session_id', s);
      }
      return s;
    } catch (e) {
      return null;
    }
  };

  const handleViewFlights = () => {
    const sessionId = ensureSession();
    const userId = localStorage.getItem('user_id') || null;

    setShowFlights(true);
    toast.success('Opening Flights...');

    apiService.recordInteraction({
      interaction_type: 'tap_to_explore_view_flights',
      source: 'landing',
      device_id: 'landing-cta',
      session_id: sessionId,
      user_id: userId
    }).catch(() => {});
  };

  const handleBackToSignage = () => {
    setShowKiosk(false);
    setKioskInitialView(null);
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
            <DigitalSignage
              onExplore={onExplore}
              onOpenKiosk={() => { setShowKiosk(true); setShowTapPrompt(false); if (onExplore) onExplore('interactive-kiosk'); }}
            />

            {/* Scheduled Flights Panel */}
            <div
              onClick={handleViewFlights} // Click panel to open modal
              className="absolute top-16 right-4 z-30 w-72 cursor-pointer bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-4 hover:scale-105 transition-transform"
            >
              <h3 className="font-bold text-sm mb-2">Scheduled Flights</h3>
              <ul className="text-xs max-h-48 overflow-y-auto">
                {flightsData.length > 0 ? (
                  flightsData.map((flight) => (
                    <li key={flight.id} className="border-b border-gray-200 py-1">
                      {flight.airline} {flight.flightNumber} - {flight.status}
                    </li>
                  ))
                ) : (
                  <li>No flights scheduled</li>
                )}
              </ul>
            </div>

            {/* Tap to Explore Prompt */}
            <AnimatePresence>
              {showTapPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 3, duration: 0.8 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
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

            {/* Accommodations Panel */}
            {showAccommodations && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-6">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAccommodations(false)}
                    className="absolute top-4 right-4"
                  >
                    Close
                  </Button>
                  <h3 className="font-bold text-lg mb-4">Destinations & Accommodations</h3>
                  <ul className="space-y-2 max-h-80 overflow-y-auto">
                    {accommodationsData.map((acc) => (
                      <li key={acc.id} className="border-b border-gray-200 pb-2">
                        <span className="font-semibold">{acc.name}</span> – {acc.location} ({acc.rating}★)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Flights Modal */}
            {showFlights && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl p-4 sm:p-6 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowFlights(false); setShowTapPrompt(true); }}
                    className="absolute top-4 right-4"
                  >
                    Close
                  </Button>
                  <FlightPortal flightsData={flightsData} />
                </div>
              </div>
            )}

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
            <InteractiveKiosk language={language} onLanguageChange={setLanguage} initialView={kioskInitialView} />

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
