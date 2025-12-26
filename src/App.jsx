import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { PublicLanding } from './components/PublicLanding';
import { StaffLogin } from './components/StaffLogin';
import { CMSPortal } from './components/CMSPortal';
import { KrugerStaffPortal } from './components/KrugerStaffPortal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { InteractiveKiosk } from './components/InteractiveKiosk';
import { AccommodationView } from './components/AccommodationView';

export function App() {
  const [currentView, setCurrentView] = useState('public');
  const [userRole, setUserRole] = useState(null);

  const handleStaffLogin = (role) => {
    setUserRole(role);
    setCurrentView(role === 'admin' ? 'cms' : 'kruger-staff');
  };

  const handlePublicLogin = () => {
    setCurrentView('staff-login');
  };

  const handleExplore = (mode) => {
    if (mode === 'accommodation') setCurrentView('accommodation');
    else setCurrentView('interactive-kiosk');
  };

  const handleLogout = () => {
    setCurrentView('public');
    setUserRole(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'public':
        return <PublicLanding onStaffLogin={handlePublicLogin} onExplore={() => setCurrentView('flight-portal')} />;
      case 'staff-login':
        return <StaffLogin onLogin={handleStaffLogin} onCancel={() => setCurrentView('public')} />;
      case 'cms':
        return <CMSPortal onLogout={handleLogout} />;
      case 'kruger-staff':
        return <KrugerStaffPortal onLogout={handleLogout} />;
      case 'analytics':
        return <AnalyticsDashboard onLogout={handleLogout} />;
      case 'interactive-kiosk':
        return <InteractiveKiosk onLanguageChange={() => {}} />;
      case 'accommodation':
        return <AccommodationView />;
      default:
        return <PublicLanding onStaffLogin={handlePublicLogin} onExplore={handleExplore} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {renderView()}
    </>
  );
}

export default App;