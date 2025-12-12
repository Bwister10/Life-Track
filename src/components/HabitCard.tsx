import { Habit } from '@/types/goals';
import { motion } from 'framer-motion';
import { Flame, Edit, Trash2, Check } from 'lucide-react';
import { format, isToday } from 'date-fns';
import styles from './HabitCard.module.css';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggle: (date: string) => void;
  darkMode?: boolean;
}

export const HabitCard = ({
  habit,
  onEdit,
  onDelete,
  onToggle,
  darkMode = false,
}: HabitCardProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completedDates.includes(today);

  const getLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <div
              className={styles.iconContainer}
              style={{ backgroundColor: `${habit.color}20` }}
            >
              {habit.icon}
            </div>
            <div className={styles.cardTitle}>
              <h3>{habit.name}</h3>
              <span className={styles.badge}>{habit.frequency}</span>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button
              onClick={() => onEdit(habit)}
              className={styles.actionButton}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {habit.description && (
          <p className={styles.description}>
            {habit.description}
          </p>
        )}

        <div className={styles.streakContainer}>
          <Flame className={`h-5 w-5 ${styles.streakIcon}`} />
          <span className={styles.streakNumber}>{habit.streak}</span>
          <span className={styles.streakText}>day streak</span>
        </div>

        <div className={styles.daysGrid}>
          {getLastSevenDays().map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isCompleted = habit.completedDates.includes(dateStr);
            const isTodayDate = isToday(date);

            const cellClass = isCompleted 
              ? styles.completed 
              : isTodayDate 
              ? styles.today 
              : styles.default;

            return (
              <div
                key={dateStr}
                className={`${styles.dayCell} ${cellClass}`}
              >
                <div className={styles.dayName}>{format(date, 'EEE')}</div>
                <div className={styles.dayNumber}>{format(date, 'd')}</div>
                {isCompleted && <Check className={styles.checkIcon} />}
              </div>
            );
          })}
        </div>

        <button
          className={`${styles.completeButton} ${isCompletedToday ? styles.outline : styles.primary}`}
          onClick={() => onToggle(today)}
        >
          {isCompletedToday ? 'Undo Today' : 'Complete Today'}
        </button>
      </div>
    </motion.div>
  );
};