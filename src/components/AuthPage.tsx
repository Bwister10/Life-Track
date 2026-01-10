import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  UserX,
  CheckCircle2
} from 'lucide-react';
import styles from './AuthPage.module.css';
import { UserData } from './AccountPage';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onLogin: (user: UserData) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export default function AuthPage({ mode, onBack, onLogin, onSwitchMode }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    // Simulate successful login/signup
    const newUser: UserData = {
      id: `user_${Date.now()}`,
      name: mode === 'signup' ? name : email.split('@')[0],
      email,
      isPremium: false,
      isAnonymous: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    onLogin(newUser);
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: UserData = {
      id: `google_${Date.now()}`,
      name: 'Google User',
      email: 'user@gmail.com',
      isPremium: false,
      isAnonymous: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    onLogin(newUser);
    setLoading(false);
  };

  const handleAnonymousAuth = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: UserData = {
      id: `anon_${Date.now()}`,
      name: 'Anonymous User',
      email: '',
      isPremium: false,
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    onLogin(newUser);
    setLoading(false);
  };

  const features = [
    'Track unlimited goals & habits',
    'Beautiful analytics dashboard',
    'Cloud sync across devices',
    'Streak tracking & reminders'
  ];

  return (
    <div className={styles.authPage}>
      {/* Left Panel - Branding */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Target size={32} />
            </div>
            <span className={styles.logoText}>LifeTrack</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Transform Your Life,<br />One Goal at a Time</h1>
            <p>Join thousands of users achieving their dreams with our intuitive goal and habit tracking platform.</p>
          </motion.div>

          <motion.ul 
            className={styles.features}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <li key={index}>
                <CheckCircle2 size={18} />
                {feature}
              </li>
            ))}
          </motion.ul>

          <motion.div 
            className={styles.testimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p>"LifeTrack helped me finally build lasting habits. The streak feature keeps me motivated every single day!"</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.avatar}>S</div>
              <div>
                <span className={styles.name}>Sarah M.</span>
                <span className={styles.role}>Entrepreneur</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.brandBackground}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className={styles.formPanel}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={20} />
          Back to home
        </button>

        <motion.div 
          className={styles.formContainer}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.formHeader}>
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {mode === 'login' 
                ? 'Sign in to continue your journey' 
                : 'Start your journey to a better you'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.error}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'signup' && (
              <motion.div 
                className={styles.inputGroup}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label>Full Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className={styles.forgotPassword}>
                <a href="#">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span>or continue with</span>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.socialButtons}>
            <button 
              className={`${styles.socialButton} ${styles.google}`}
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button 
              className={`${styles.socialButton} ${styles.anonymous}`}
              onClick={handleAnonymousAuth}
              disabled={loading}
            >
              <UserX size={20} />
              Guest
            </button>
          </div>

          <p className={styles.switchMode}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => onSwitchMode('signup')}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => onSwitchMode('login')}>Sign in</button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
