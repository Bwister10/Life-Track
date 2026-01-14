import { useState } from 'react';
import { 
  Target, 
  Calendar, 
  BarChart3, 
  Crown, 
  Moon, 
  Sun, 
  Settings, 
  User,
  Home,
  TrendingUp,
  Menu,
  X,
  Award,
  Sparkles,
  Users
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export default function Sidebar({ 
  darkMode, 
  onToggleDarkMode,
  activeView = 'dashboard',
  onViewChange 
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Check if user is premium
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user.isPremium || false;
  const isEnterprise = user.planType === 'enterprise';

  const toggleSidebar = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    // Prevent body scroll when sidebar is expanded
    if (newExpanded) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  const toggleMobileSidebar = () => {
    const newMobileOpen = !isMobileOpen;
    setIsMobileOpen(newMobileOpen);
    // Prevent body scroll when mobile sidebar is open
    if (newMobileOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  const closeSidebar = () => {
    setIsExpanded(false);
    setIsMobileOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const handleMenuClick = (view: string) => {
    if (onViewChange) {
      onViewChange(view);
    }
    // Close sidebar after selection on all devices
    setIsExpanded(false);
    setIsMobileOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'habits', icon: Calendar, label: 'Habits' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
    { id: 'team', icon: Users, label: 'Team', enterprise: true },
  ];

  const bottomItems = [
    { id: 'premium', icon: isPremium ? Sparkles : Crown, label: isPremium ? 'Pro' : 'Premium', special: true, isPro: isPremium },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className={`${styles.mobileToggle} ${darkMode ? styles.dark : ''}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile and desktop */}
      <div 
        className={`${styles.backdrop} ${(isMobileOpen || isExpanded) ? styles.visible : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div 
        className={`${styles.sidebar} ${
          isExpanded || isMobileOpen ? styles.expanded : styles.collapsed
        } ${darkMode ? styles.dark : ''}`}
      >
        {/* Logo Section */}
        <div className={styles.logoSection} onClick={toggleSidebar}>
          <div className={styles.logoIcon}>
            <Target />
          </div>
          <span className={styles.logoText}>Life Goals</span>
        </div>

        {/* Menu Items */}
        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${
                activeView === item.id ? styles.active : ''
              }`}
              onClick={() => handleMenuClick(item.id)}
            >
              <item.icon className={styles.menuIcon} />
              <span className={styles.menuText}>{item.label}</span>
            </button>
          ))}

          <div className={styles.divider} />

          {bottomItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${
                item.special ? styles.premiumItem : ''
              } ${activeView === item.id ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <item.icon className={styles.menuIcon} />
              <span className={styles.menuText}>{item.label}</span>
            </button>
          ))}

          {/* Dark Mode Toggle */}
          <button
            className={styles.menuItem}
            onClick={onToggleDarkMode}
          >
            {darkMode ? (
              <>
                <Sun className={styles.menuIcon} />
                <span className={styles.menuText}>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className={styles.menuIcon} />
                <span className={styles.menuText}>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}