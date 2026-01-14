import { useState, useRef } from 'react';
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
  Mail,
  Calendar,
  Clock,
  Volume2,
  Check,
  X,
  FileDown,
  FileUp,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SettingsPage.module.css';
import { Goal, Habit } from '@/types/goals';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  goals?: Goal[];
  habits?: Habit[];
  onImportData?: (goals: Goal[], habits: Habit[]) => void;
}

// Theme color options
const themeColors = [
  { id: 'blue', name: 'Ocean Blue', color: '#3b82f6' },
  { id: 'purple', name: 'Royal Purple', color: '#8b5cf6' },
  { id: 'pink', name: 'Rose Pink', color: '#ec4899' },
  { id: 'green', name: 'Emerald', color: '#10b981' },
  { id: 'orange', name: 'Sunset Orange', color: '#f97316' },
  { id: 'red', name: 'Ruby Red', color: '#ef4444' },
  { id: 'teal', name: 'Teal', color: '#14b8a6' },
  { id: 'indigo', name: 'Indigo', color: '#6366f1' },
];

export default function SettingsPage({ darkMode, onToggleDarkMode, goals = [], habits = [], onImportData }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [weekStartsOn, setWeekStartsOn] = useState('monday');
  const [language, setLanguage] = useState('en');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('themeColor') || 'blue');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is premium
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user.isPremium || false;

  // Apply theme color
  const handleThemeChange = (themeId: string) => {
    if (!isPremium) {
      alert('Custom themes are a Pro feature. Please upgrade to Pro to unlock this feature!');
      return;
    }
    setSelectedTheme(themeId);
    localStorage.setItem('themeColor', themeId);
    const theme = themeColors.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--primary-color', theme.color);
    }
    setShowThemePicker(false);
  };

  // Export data function
  const handleExportData = () => {
    if (!isPremium) {
      alert('Data export is a Pro feature. Please upgrade to Pro to unlock this feature!');
      return;
    }
    
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      goals: goals,
      habits: habits,
      settings: {
        darkMode,
        themeColor: selectedTheme,
        notifications,
        emailNotifications,
        soundEffects,
        weekStartsOn,
        language
      }
    };

    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifetrack_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // CSV export for goals
      let csvContent = 'Type,Title,Description,Category,Progress,Status,Deadline,Created\n';
      goals.forEach(goal => {
        csvContent += `Goal,"${goal.title}","${goal.description || ''}","${goal.category}",${goal.progress},"${goal.status}","${goal.deadline}","${goal.createdAt}"\n`;
      });
      csvContent += '\nType,Title,Frequency,Streak,Created\n';
      habits.forEach(habit => {
        csvContent += `Habit,"${habit.title}","${habit.frequency}",${habit.streak},"${habit.createdAt}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifetrack_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      setShowExportModal(false);
    }, 2000);
  };

  // Import data function
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.goals && data.habits && onImportData) {
          onImportData(data.goals, data.habits);
          setImportSuccess(true);
          setTimeout(() => {
            setImportSuccess(false);
            setShowImportModal(false);
          }, 2000);
        }
      } catch (err) {
        alert('Invalid backup file. Please select a valid LifeTrack backup file.');
      }
    };
    reader.readAsText(file);
  };

  const currentTheme = themeColors.find(t => t.id === selectedTheme);

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

          <div className={styles.settingsItem} onClick={() => setShowThemePicker(!showThemePicker)}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.orange}`}>
                <Palette size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Theme Color {!isPremium && <span className={styles.proBadge}>PRO</span>}</h3>
                <p>Choose your accent color</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <div 
                className={styles.colorPreview} 
                style={{ backgroundColor: currentTheme?.color || '#3b82f6' }}
              />
              <span className={styles.settingsValue}>{currentTheme?.name || 'Blue'}</span>
              <ChevronRight className={`${styles.chevron} ${showThemePicker ? styles.rotated : ''}`} size={20} />
            </div>
          </div>
          
          {/* Theme Color Picker */}
          <AnimatePresence>
            {showThemePicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={styles.themePickerContainer}
              >
                <div className={styles.themeGrid}>
                  {themeColors.map(theme => (
                    <button
                      key={theme.id}
                      className={`${styles.themeOption} ${selectedTheme === theme.id ? styles.selected : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleThemeChange(theme.id); }}
                      style={{ '--theme-color': theme.color } as React.CSSProperties}
                    >
                      <div className={styles.themeColorCircle} style={{ backgroundColor: theme.color }}>
                        {selectedTheme === theme.id && <Check size={16} />}
                      </div>
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
          <div className={styles.settingsItem} onClick={() => setShowExportModal(true)}>
            <div className={styles.settingsItemLeft}>
              <div className={`${styles.settingsIcon} ${styles.green}`}>
                <Download size={20} />
              </div>
              <div className={styles.settingsInfo}>
                <h3>Export Data {!isPremium && <span className={styles.proBadge}>PRO</span>}</h3>
                <p>Download all your goals and habits</p>
              </div>
            </div>
            <div className={styles.settingsItemRight}>
              <ChevronRight className={styles.chevron} size={20} />
            </div>
          </div>

          <div className={styles.settingsItem} onClick={() => setShowImportModal(true)}>
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

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              {exportSuccess ? (
                <div className={styles.successState}>
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h3>Export Successful!</h3>
                  <p>Your data has been downloaded.</p>
                </div>
              ) : (
                <>
                  <div className={styles.modalHeader}>
                    <FileDown size={24} />
                    <h3>Export Your Data</h3>
                  </div>
                  <p className={styles.modalDescription}>
                    Download a backup of all your goals, habits, and settings.
                  </p>
                  
                  <div className={styles.exportStats}>
                    <div className={styles.exportStat}>
                      <span className={styles.exportStatValue}>{goals.length}</span>
                      <span className={styles.exportStatLabel}>Goals</span>
                    </div>
                    <div className={styles.exportStat}>
                      <span className={styles.exportStatValue}>{habits.length}</span>
                      <span className={styles.exportStatLabel}>Habits</span>
                    </div>
                  </div>

                  <div className={styles.formatSelector}>
                    <label>Export Format:</label>
                    <div className={styles.formatOptions}>
                      <button
                        className={`${styles.formatOption} ${exportFormat === 'json' ? styles.selected : ''}`}
                        onClick={() => setExportFormat('json')}
                      >
                        <FileText size={18} />
                        JSON (Full Backup)
                      </button>
                      <button
                        className={`${styles.formatOption} ${exportFormat === 'csv' ? styles.selected : ''}`}
                        onClick={() => setExportFormat('csv')}
                      >
                        <FileText size={18} />
                        CSV (Spreadsheet)
                      </button>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={() => setShowExportModal(false)}>
                      Cancel
                    </button>
                    <button className={styles.exportButton} onClick={handleExportData}>
                      <Download size={18} />
                      Export Data
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              {importSuccess ? (
                <div className={styles.successState}>
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h3>Import Successful!</h3>
                  <p>Your data has been restored.</p>
                </div>
              ) : (
                <>
                  <div className={styles.modalHeader}>
                    <FileUp size={24} />
                    <h3>Import Your Data</h3>
                  </div>
                  <p className={styles.modalDescription}>
                    Restore your goals and habits from a backup file.
                  </p>
                  
                  <div className={styles.importDropzone} onClick={() => fileInputRef.current?.click()}>
                    <Upload size={32} />
                    <p>Click to select a backup file</p>
                    <span>Supports .json files</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className={styles.importWarning}>
                    <Shield size={18} />
                    <span>Importing will merge with your existing data.</span>
                  </div>

                  <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={() => setShowImportModal(false)}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
