import { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowLeft, 
  ChevronRight,
  Crown,
  Target,
  Calendar,
  Flame,
  Award,
  LogOut,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, Habit } from '@/types/goals';
import styles from './AccountPage.module.css';

interface AccountPageProps {
  darkMode: boolean;
  goals: Goal[];
  habits: Habit[];
  user: UserData | null;
  onLogin: (user: UserData) => void;
  onLogout: () => void;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  isAnonymous: boolean;
  createdAt: string;
}

type AuthView = 'prompt' | 'form';
type AuthTab = 'login' | 'signup';

export default function AccountPage({ 
  darkMode, 
  goals, 
  habits, 
  user, 
  onLogin, 
  onLogout 
}: AccountPageProps) {
  const [authView, setAuthView] = useState<AuthView>('prompt');
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalHabits = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    const newUser: UserData = {
      id: `user_${Date.now()}`,
      name: authTab === 'signup' ? name : email.split('@')[0],
      email,
      isPremium: false,
      isAnonymous: false,
      createdAt: new Date().toISOString(),
    };
    onLogin(newUser);
    setAuthView('prompt');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleGoogleAuth = () => {
    // Simulate Google login
    const newUser: UserData = {
      id: `google_${Date.now()}`,
      name: 'Google User',
      email: 'user@gmail.com',
      isPremium: false,
      isAnonymous: false,
      createdAt: new Date().toISOString(),
    };
    onLogin(newUser);
    setAuthView('prompt');
  };

  const handleAnonymousAuth = () => {
    // Simulate anonymous login
    const newUser: UserData = {
      id: `anon_${Date.now()}`,
      name: 'Anonymous User',
      email: '',
      isPremium: false,
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };
    onLogin(newUser);
    setAuthView('prompt');
  };

  // Not logged in - show auth prompt or form
  if (!user) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <AnimatePresence mode="wait">
          {authView === 'prompt' ? (
            <motion.div
              key="prompt"
              className={styles.authRequired}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.authIcon}>
                <User size={40} />
              </div>
              <h2>Sign in to Continue</h2>
              <p>Create an account or sign in to access your profile, sync your data across devices, and unlock premium features.</p>
              <button 
                className={styles.authButton}
                onClick={() => setAuthView('form')}
              >
                Sign In / Sign Up
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className={styles.authFormContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button 
                className={styles.backButton}
                onClick={() => setAuthView('prompt')}
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <div className={styles.authFormCard}>
                <div className={styles.authFormHeader}>
                  <h2>{authTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                  <p>{authTab === 'login' ? 'Sign in to your account' : 'Start your journey today'}</p>
                </div>

                <div className={styles.authTabs}>
                  <button
                    className={`${styles.authTab} ${authTab === 'login' ? styles.active : ''}`}
                    onClick={() => setAuthTab('login')}
                  >
                    Sign In
                  </button>
                  <button
                    className={`${styles.authTab} ${authTab === 'signup' ? styles.active : ''}`}
                    onClick={() => setAuthTab('signup')}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleEmailAuth}>
                  {authTab === 'signup' && (
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Name</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      type="password"
                      className={styles.formInput}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    {authTab === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>or continue with</span>
                  <div className={styles.dividerLine} />
                </div>

                <div className={styles.socialButtons}>
                  <button 
                    className={`${styles.socialButton} ${styles.google}`}
                    onClick={handleGoogleAuth}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button 
                    className={`${styles.socialButton} ${styles.anonymous}`}
                    onClick={handleAnonymousAuth}
                  >
                    <UserX size={20} />
                    Continue Anonymously
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Logged in - show account page
  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Account</h1>
        <p>Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div 
        className={styles.profileSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{user.name}</h2>
            {user.email && <p className={styles.profileEmail}>{user.email}</p>}
            <span className={`${styles.profileBadge} ${user.isPremium ? styles.premium : ''}`}>
              {user.isPremium ? (
                <>
                  <Crown size={12} />
                  Premium
                </>
              ) : user.isAnonymous ? (
                'Anonymous'
              ) : (
                'Free Plan'
              )}
            </span>
          </div>
          <button className={styles.editProfileButton}>
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalGoals}</div>
          <div className={styles.statLabel}>Total Goals</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{completedGoals}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalHabits}</div>
          <div className={styles.statLabel}>Habits</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{longestStreak}</div>
          <div className={styles.statLabel}>Best Streak</div>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div 
        className={styles.actionsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.actionsCard}>
          {!user.isPremium && (
            <div className={styles.actionItem}>
              <div className={styles.actionItemLeft}>
                <div className={`${styles.actionIcon} ${styles.orange}`}>
                  <Crown size={20} />
                </div>
                <div className={styles.actionInfo}>
                  <h3>Upgrade to Premium</h3>
                  <p>Unlock all features and unlimited tracking</p>
                </div>
              </div>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          )}

          {user.isAnonymous && (
            <div className={styles.actionItem}>
              <div className={styles.actionItemLeft}>
                <div className={`${styles.actionIcon} ${styles.blue}`}>
                  <Mail size={20} />
                </div>
                <div className={styles.actionInfo}>
                  <h3>Link Email Account</h3>
                  <p>Save your data and sync across devices</p>
                </div>
              </div>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          )}

          <div className={styles.actionItem}>
            <div className={styles.actionItemLeft}>
              <div className={`${styles.actionIcon} ${styles.blue}`}>
                <Lock size={20} />
              </div>
              <div className={styles.actionInfo}>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>
            </div>
            <ChevronRight className={styles.chevron} size={20} />
          </div>

          <div className={styles.actionItem} onClick={onLogout}>
            <div className={styles.actionItemLeft}>
              <div className={`${styles.actionIcon} ${styles.red}`}>
                <LogOut size={20} />
              </div>
              <div className={styles.actionInfo}>
                <h3>Sign Out</h3>
                <p>Log out of your account</p>
              </div>
            </div>
            <ChevronRight className={styles.chevron} size={20} />
          </div>
        </div>
      </motion.div>

      {/* Member Since */}
      <div className={styles.memberSince}>
        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })}
      </div>
    </div>
  );
}
