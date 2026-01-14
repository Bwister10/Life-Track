import { 
  User, 
  Lock, 
  Mail, 
  ChevronRight,
  Crown,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Goal, Habit } from '@/types/goals';
import styles from './AccountPage.module.css';

interface AccountPageProps {
  darkMode: boolean;
  goals: Goal[];
  habits: Habit[];
  user: UserData | null;
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

export default function AccountPage({ 
  darkMode, 
  goals, 
  habits, 
  user, 
  onLogout 
}: AccountPageProps) {
  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalHabits = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Not logged in - show loading state (user will be redirected to landing)
  if (!user) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Redirecting to login...</p>
        </div>
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
