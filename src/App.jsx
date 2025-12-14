import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { PublicLanding } from './components/PublicLanding';
import { StaffLogin } from './components/StaffLogin';
import { CMSPortal } from './components/CMSPortal';
import { KrugerStaffPortal } from './components/KrugerStaffPortal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FlightPortal } from './components/FlightPortal';

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

  const handleLogout = () => {
    setCurrentView('public');
    setUserRole(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'public':
        return <PublicLanding onStaffLogin={handlePublicLogin} />;
      case 'staff-login':
        return <StaffLogin onLogin={handleStaffLogin} onCancel={() => setCurrentView('public')} />;
      case 'cms':
        return <CMSPortal onLogout={handleLogout} />;
      case 'kruger-staff':
        return <KrugerStaffPortal onLogout={handleLogout} />;
      case 'analytics':
        return <AnalyticsDashboard onLogout={handleLogout} />;
      case 'flight-portal':
        return <FlightPortal onLogout={handleLogout} />;
      default:
        return <PublicLanding onStaffLogin={handlePublicLogin} />;
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