import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import { UserData } from './AccountPage';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

export default function Home() {
  const [view, setView] = useState<AppView | null>(null); // Start with null to prevent flash
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setView('dashboard');
        // Push state so user doesn't go back to landing when pressing back button
        window.history.pushState({ view: 'dashboard' }, '', window.location.href);
      } catch (e) {
        console.error('Failed to parse user data');
        setView('landing');
      }
    } else {
      setView('landing');
    }
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        // If user is logged in, keep them on dashboard
        setView('dashboard');
        window.history.pushState({ view: 'dashboard' }, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGetStarted = () => {
    setView('signup');
    window.history.pushState({ view: 'signup' }, '', window.location.href);
  };

  const handleLogin = () => {
    setView('login');
    window.history.pushState({ view: 'login' }, '', window.location.href);
  };

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    setView('dashboard');
    // Replace history to prevent going back to auth pages
    window.history.replaceState({ view: 'dashboard' }, '', window.location.href);
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.history.back();
  };

  const handleSwitchAuthMode = (mode: 'login' | 'signup') => {
    setView(mode);
    window.history.replaceState({ view: mode }, '', window.location.href);
  };

  // Show nothing while checking auth status to prevent flash
  if (view === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Render based on current view
  if (view === 'landing') {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted} 
        onLogin={handleLogin} 
      />
    );
  }

  if (view === 'login' || view === 'signup') {
    return (
      <AuthPage
        mode={view}
        onBack={handleBackToLanding}
        onLogin={handleAuthSuccess}
        onSwitchMode={handleSwitchAuthMode}
      />
    );
  }

  return <Dashboard />;
}