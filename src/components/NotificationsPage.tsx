import { useState } from 'react';
import { 
  Bell, 
  Target, 
  Calendar, 
  Flame, 
  Award, 
  Clock,
  Settings,
  Check,
  Trash2,
  BellOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NotificationsPage.module.css';

interface NotificationsPageProps {
  darkMode: boolean;
}

interface Notification {
  id: string;
  type: 'goal' | 'habit' | 'streak' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: '🎉 Achievement Unlocked!',
    message: 'You completed your first goal! Keep up the great work.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'streak',
    title: '🔥 7-Day Streak!',
    message: 'Amazing! You\'ve maintained your "Morning Exercise" habit for 7 days straight.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Daily Reminder',
    message: 'Don\'t forget to complete your habits for today!',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'goal',
    title: 'Goal Progress Update',
    message: 'You\'re 75% done with "Learn Spanish". Just a little more to go!',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'habit',
    title: 'Habit Completed',
    message: 'Great job completing "Read 30 minutes" today!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Welcome to Life Goals!',
    message: 'Start by creating your first goal or habit to begin your journey.',
    time: '2 days ago',
    read: true,
  },
];

type TabType = 'all' | 'unread';

export default function NotificationsPage({ darkMode }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'goal': return Target;
      case 'habit': return Calendar;
      case 'streak': return Flame;
      case 'achievement': return Award;
      case 'reminder': return Clock;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Notifications</h1>
          <p>Stay updated on your progress</p>
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllRead} onClick={markAllAsRead}>
            <Check size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'unread' ? styles.active : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </button>
      </div>

      {/* Notifications List */}
      <AnimatePresence mode="popLayout">
        {filteredNotifications.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BellOff className={styles.emptyIcon} />
            <h3>No Notifications</h3>
            <p>{activeTab === 'unread' ? 'You\'re all caught up!' : 'You don\'t have any notifications yet.'}</p>
          </motion.div>
        ) : (
          <div className={styles.notificationsList}>
            {filteredNotifications.map((notification, index) => {
              const Icon = getIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.notificationContent}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    <span className={styles.notificationTime}>{notification.time}</span>
                  </div>
                  <div className={styles.notificationActions}>
                    {!notification.read && (
                      <button 
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button 
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
