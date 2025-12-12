import { useState } from 'react';
import { Goal, Habit } from '@/types/goals';
import { Target, Calendar, Check, Clock, Flame, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import styles from './ProgressPage.module.css';

interface ProgressPageProps {
  goals: Goal[];
  habits: Habit[];
  darkMode: boolean;
}

type TabType = 'goals' | 'habits';

export default function ProgressPage({ goals, habits, darkMode }: ProgressPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('goals');

  // Generate heatmap data for habits (last 28 days)
  const getHeatmapData = (habit: Habit) => {
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isCompleted = habit.completedDates.includes(dateStr);
      days.push({ date: dateStr, completed: isCompleted });
    }
    return days;
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Progress</h1>
        <p>Track your journey and celebrate milestones</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'goals' ? styles.active : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <Target size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Goals Progress
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'habits' ? styles.active : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          <Calendar size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Habits Progress
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'goals' ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {goals.length === 0 ? (
              <div className={styles.emptyState}>
                <Target className={styles.emptyIcon} />
                <h3>No Goals Yet</h3>
                <p>Create your first goal to start tracking progress</p>
              </div>
            ) : (
              <div className={styles.progressList}>
                {goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    className={styles.progressCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.progressHeader}>
                      <div className={styles.progressInfo}>
                        <div className={styles.progressTitle}>
                          <div
                            className={styles.progressIcon}
                            style={{ background: goal.color }}
                          >
                            {goal.icon}
                          </div>
                          <h3>{goal.title}</h3>
                        </div>
                        <div className={styles.progressMeta}>
                          <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <span>{goal.category}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`${styles.statusBadge} ${
                          goal.status === 'completed'
                            ? styles.completed
                            : goal.status === 'overdue'
                            ? styles.overdue
                            : styles.inProgress
                        }`}
                      >
                        {goal.status === 'in-progress' ? 'In Progress' : goal.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressBarSection}>
                      <div className={styles.progressBarHeader}>
                        <span className={styles.progressLabel}>Overall Progress</span>
                        <span className={styles.progressValue}>{goal.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className={styles.milestones}>
                        {goal.milestones.map((milestone, index) => (
                          <div key={index} className={styles.milestone}>
                            <div
                              className={`${styles.milestoneIcon} ${
                                milestone.completed ? styles.completed : styles.pending
                              }`}
                            >
                              {milestone.completed ? <Check size={16} /> : <span>{index + 1}</span>}
                            </div>
                            <div className={styles.milestoneContent}>
                              <h4>{milestone.title}</h4>
                              <p>
                                {milestone.completed
                                  ? `Completed on ${format(new Date(milestone.completedDate!), 'MMM d, yyyy')}`
                                  : 'Not completed yet'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="habits"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {habits.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar className={styles.emptyIcon} />
                <h3>No Habits Yet</h3>
                <p>Create your first habit to start tracking progress</p>
              </div>
            ) : (
              <div className={styles.habitProgress}>
                {habits.map((habit) => {
                  const heatmapData = getHeatmapData(habit);
                  return (
                    <motion.div
                      key={habit.id}
                      className={styles.habitCard}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className={styles.habitHeader}>
                        <div
                          className={styles.habitIconBox}
                          style={{ background: habit.color }}
                        >
                          {habit.icon}
                        </div>
                        <div className={styles.habitInfo}>
                          <h3>{habit.name}</h3>
                          <div className={styles.habitStreak}>
                            <Flame size={16} />
                            <span>{habit.streak} day streak</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className={styles.progressMeta} style={{ marginBottom: '1rem' }}>
                        <div className={styles.metaItem}>
                          <TrendingUp size={14} />
                          <span>{habit.completedDates.length} total completions</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span>{habit.frequency}</span>
                        </div>
                      </div>

                      {/* Heatmap */}
                      <div className={styles.heatmap}>
                        {heatmapData.map((day, index) => {
                          // Calculate intensity based on recent activity
                          const level = day.completed ? 4 : 0;
                          return (
                            <div
                              key={index}
                              className={`${styles.heatmapCell} ${
                                level > 0 ? styles[`level${level}`] : ''
                              }`}
                              title={`${day.date}: ${day.completed ? 'Completed' : 'Not completed'}`}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
