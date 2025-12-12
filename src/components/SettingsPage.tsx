import { useState } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  Sun,
  Palette, 
  Globe, 
  Lock, 
  Shield, 
  Download, 
  Upload,
  Trash2, 
  HelpCircle, 
  MessageSquare, 
  FileText,
  ChevronRight,
  Smartphone,
  Mail,
  Calendar,
  Clock,
  Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './SettingsPage.module.css';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsPage({ darkMode, onToggleDarkMode }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [weekStartsOn, setWeekStartsOn] = useState('monday');
  const [language, setLanguage] = useState('en');

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Customize your experience and manage your account</p>
      </div>

      {/* Account Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <User size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Profile</h3>
                <p>Manage your personal information</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.purple}`}>
                <Mail size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Email</h3>
                <p>Update your email address</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <span className={styles.settingsValue}>user@example.com</span>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.green}`}>
                <Lock size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Password</h3>
                <p>Change your password</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem} onClick={onToggleDarkMode}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.purple}`}>
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div className={styles.settingsInfo}>
                <h3>Dark Mode</h3>
                <p>Toggle dark/light theme</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <div className={`${styles.toggle} ${darkMode ? styles.active : ''}`}>
                <div className={styles.toggleKnob} />
              </div>
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.orange}`}>
                <Palette size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Theme Color</h3>
                <p>Choose your accent color</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <span className={styles.settingsValue}>Blue</span>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <Globe size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Language</h3>
                <p>Select your preferred language</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <select 
                className={styles.select}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem} onClick={() => setNotifications(!notifications)}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.green}`}>
                <Bell size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Push Notifications</h3>
                <p>Receive reminders and updates</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <div className={`${styles.toggle} ${notifications ? styles.active : ''}`}>
                <div className={styles.toggleKnob} />
              </div>
            </div>
          </div>

          <div className={styles.settingsItem} onClick={() => setEmailNotifications(!emailNotifications)}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <Mail size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Email Notifications</h3>
                <p>Weekly progress reports</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <div className={`${styles.toggle} ${emailNotifications ? styles.active : ''}`}>
                <div className={styles.toggleKnob} />
              </div>
            </div>
          </div>

          <div className={styles.settingsItem} onClick={() => setSoundEffects(!soundEffects)}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.purple}`}>
                <Volume2 size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Sound Effects</h3>
                <p>Play sounds on completion</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <div className={`${styles.toggle} ${soundEffects ? styles.active : ''}`}>
                <div className={styles.toggleKnob} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>Preferences</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.orange}`}>
                <Calendar size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Week Starts On</h3>
                <p>Choose the first day of the week</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <select 
                className={styles.select}
                value={weekStartsOn}
                onChange={(e) => setWeekStartsOn(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <Clock size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Default Reminder Time</h3>
                <p>Set default time for habit reminders</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <span className={styles.settingsValue}>9:00 AM</span>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data & Privacy Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>Data & Privacy</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.green}`}>
                <Download size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Export Data</h3>
                <p>Download all your goals and habits</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <Upload size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Import Data</h3>
                <p>Restore from a backup file</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.purple}`}>
                <Shield size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Privacy Policy</h3>
                <p>Read our privacy policy</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support Settings */}
      <motion.div 
        className={styles.settingsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>Support</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.blue}`}>
                <HelpCircle size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Help Center</h3>
                <p>Get help and find answers</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.green}`}>
                <MessageSquare size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Contact Support</h3>
                <p>Reach out to our team</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.orange}`}>
                <FileText size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Terms of Service</h3>
                <p>Read our terms and conditions</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        className={styles.dangerZone}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3>Danger Zone</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button className={styles.dangerButton}>
          <Trash2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Delete Account
        </button>
      </motion.div>

      {/* Version Info */}
      <div className={styles.versionInfo}>
        <p>Life Goals & Habits v1.0.0</p>
        <p>Made with ❤️ • <a href="#">Changelog</a> • <a href="#">Feedback</a></p>
      </div>
    </div>
  );
}
