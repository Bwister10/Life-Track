import { useState, useMemo } from 'react';
import { Habit } from '@/types/goals';
import { HabitCard } from '@/components/HabitCard';
import { Search, Plus, Calendar, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import styles from './HabitsPage.module.css';

interface HabitsPageProps {
  habits: Habit[];
  darkMode: boolean;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabit: (id: string, date: string) => void;
}

type FrequencyFilter = 'all' | 'daily' | 'weekly';

export default function HabitsPage({
  habits,
  darkMode,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onToggleHabit,
}: HabitsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>('all');

  const today = format(new Date(), 'yyyy-MM-dd');

  // Filter habits
  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFrequency = frequencyFilter === 'all' || habit.frequency === frequencyFilter;
      
      return matchesSearch && matchesFrequency;
    });
  }, [habits, searchQuery, frequencyFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredHabits.length;
    const completedToday = filteredHabits.filter(h => h.completedDates.includes(today)).length;
    const longestStreak = filteredHabits.length > 0 
      ? Math.max(...filteredHabits.map(h => h.streak))
      : 0;
    const totalStreaks = filteredHabits.reduce((sum, h) => sum + h.streak, 0);
    
    return { total, completedToday, longestStreak, totalStreaks };
  }, [filteredHabits, today]);

  // Check if habit is completed today
  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(today);
  };

  // Handle quick check toggle
  const handleQuickCheck = (habitId: string) => {
    onToggleHabit(habitId, today);
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Habits</h1>
        <p>Build consistency and track your daily routines</p>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Habits</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Done Today</span>
          <span className={styles.statValue}>{stats.completedToday}/{stats.total}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Longest Streak</span>
          <span className={styles.statValue}>{stats.longestStreak} 🔥</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Streaks</span>
          <span className={styles.statValue}>{stats.totalStreaks}</span>
        </div>
      </div>

      {/* Quick Check-In Section */}
      {filteredHabits.length > 0 && (
        <div className={styles.quickCheckSection}>
          <div className={styles.quickCheckHeader}>
            <h2>Today's Check-In</h2>
            <span className={styles.todayDate}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className={styles.quickCheckList}>
            {filteredHabits.map((habit) => {
              const completed = isCompletedToday(habit);
              return (
                <motion.div
                  key={habit.id}
                  className={styles.quickCheckItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className={`${styles.checkButton} ${completed ? styles.checked : ''}`}
                    onClick={() => handleQuickCheck(habit.id)}
                  >
                    {completed && <Check size={20} />}
                  </button>
                  <div className={styles.habitInfo}>
                    <div className={styles.habitName}>{habit.name}</div>
                    <div className={styles.habitStreak}>
                      <Flame className={styles.streakIcon} size={16} />
                      {habit.streak} day streak
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem',
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: habit.color,
                    borderRadius: '0.5rem'
                  }}>
                    {habit.icon}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Frequency Filter */}
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterButton} ${frequencyFilter === 'all' ? styles.active : ''}`}
            onClick={() => setFrequencyFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${frequencyFilter === 'daily' ? styles.active : ''}`}
            onClick={() => setFrequencyFilter('daily')}
          >
            Daily
          </button>
          <button
            className={`${styles.filterButton} ${frequencyFilter === 'weekly' ? styles.active : ''}`}
            onClick={() => setFrequencyFilter('weekly')}
          >
            Weekly
          </button>
        </div>

        {/* Add Button */}
        <button className={styles.addButton} onClick={onAddHabit}>
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      {/* Section Title */}
      <h3 className={styles.sectionTitle}>All Habits</h3>

      {/* Habits Display */}
      {filteredHabits.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar className={styles.emptyIcon} />
          <h3>No habits found</h3>
          <p>
            {searchQuery || frequencyFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Create your first habit to start building consistency!'}
          </p>
          {!searchQuery && frequencyFilter === 'all' && (
            <button className={styles.addButton} onClick={onAddHabit}>
              <Plus size={18} />
              Create Your First Habit
            </button>
          )}
        </div>
      ) : (
        <motion.div className={styles.grid} layout>
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <HabitCard
                  habit={habit}
                  onEdit={() => onEditHabit(habit)}
                  onDelete={() => onDeleteHabit(habit.id)}
                  onToggle={(date) => onToggleHabit(habit.id, date)}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
