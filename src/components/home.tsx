import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, PartyPopper, Sparkles } from 'lucide-react';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import { UserData } from './AccountPage';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard' | 'loading';

interface WelcomeMessage {
  show: boolean;
  type: 'new' | 'returning';
  userName?: string;
}

export default function Home() {
  const [view, setView] = useState<AppView | null>(null); // Start with null to prevent flash
  const [user, setUser] = useState<UserData | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage>({ show: false, type: 'new' });

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const lastVisit = localStorage.getItem('lastVisit');
    
    if (isLoggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Show loading then dashboard with welcome message for returning users
        setView('loading');
        
        setTimeout(() => {
          setView('dashboard');
          // Show welcome back message for returning users
          if (lastVisit) {
            setWelcomeMessage({ 
              show: true, 
              type: 'returning', 
              userName: parsedUser.name?.split(' ')[0] || 'there' 
            });
          }
          // Update last visit
          localStorage.setItem('lastVisit', new Date().toISOString());
          // Push state so user doesn't go back to landing when pressing back button
          window.history.pushState({ view: 'dashboard' }, '', window.location.href);
        }, 1500);
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
    // Show loading screen before dashboard
    setView('loading');
    
    setTimeout(() => {
      setView('dashboard');
      // Show welcome message for new users
      const isNewUser = !localStorage.getItem('lastVisit');
      setWelcomeMessage({ 
        show: true, 
        type: isNewUser ? 'new' : 'returning',
        userName: userData.name?.split(' ')[0] || 'there'
      });
      localStorage.setItem('lastVisit', new Date().toISOString());
      // Replace history to prevent going back to auth pages
      window.history.replaceState({ view: 'dashboard' }, '', window.location.href);
    }, 1500);
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.history.back();
  };

  const handleSwitchAuthMode = (mode: 'login' | 'signup') => {
    setView(mode);
    window.history.replaceState({ view: mode }, '', window.location.href);
  };

  // Dismiss welcome message after 5 seconds
  useEffect(() => {
    if (welcomeMessage.show) {
      const timer = setTimeout(() => {
        setWelcomeMessage(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage.show]);

  // Show nothing while checking auth status to prevent flash
  if (view === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Loading screen when transitioning to dashboard
  if (view === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl"
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Loading your dashboard...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Getting everything ready for you
            </p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </motion.div>
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

  return (
    <>
      {/* Welcome Message Popup */}
      <AnimatePresence>
        {welcomeMessage.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 max-w-md"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              welcomeMessage.type === 'new' 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}>
              {welcomeMessage.type === 'new' ? (
                <PartyPopper className="w-6 h-6 text-white" />
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {welcomeMessage.type === 'new' 
                  ? `Welcome, ${welcomeMessage.userName}! 🎉` 
                  : `Welcome back, ${welcomeMessage.userName}! 👋`}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {welcomeMessage.type === 'new' 
                  ? "You're all set! Start by creating your first goal or habit." 
                  : "Ready to pick up where you left off? Let's crush those goals!"}
              </p>
            </div>
            <button 
              onClick={() => setWelcomeMessage(prev => ({ ...prev, show: false }))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Dashboard />
    </>
  );
}