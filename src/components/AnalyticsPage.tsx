import { useState, useMemo } from 'react';
import { Goal, Habit } from '@/types/goals';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Award,
  Zap,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './AnalyticsPage.module.css';

interface AnalyticsPageProps {
  goals: Goal[];
  habits: Habit[];
  darkMode: boolean;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage({ goals, habits, darkMode }: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    const totalHabits = habits.length;
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreakDays / totalHabits) : 0;

    // Goals by category
    const goalsByCategory = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average progress
    const avgProgress = goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0;

    // Calculate actual weekly completion based on habits data
    const weeklyCompletion = (() => {
      const today = new Date();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const result: { day: string; percentage: number }[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        
        if (totalHabits === 0) {
          result.push({ day: dayName, percentage: 0 });
        } else {
          const completedCount = habits.filter(h => 
            h.completedDates.includes(dateStr)
          ).length;
          const percentage = Math.round((completedCount / totalHabits) * 100);
          result.push({ day: dayName, percentage });
        }
      }
      return result;
    })();

    return {
      totalGoals,
      completedGoals,
      completionRate,
      totalHabits,
      activeStreaks,
      avgStreak,
      goalsByCategory,
      avgProgress,
      weeklyCompletion,
      prevCompletionRate: 68, // Mock previous period data
      prevAvgStreak: 12,
    };
  }, [goals, habits, timeRange]);

  // Generate insights
  const insights = useMemo(() => {
    const insightsList = [];

    if (analytics.completionRate >= 80) {
      insightsList.push({
        icon: Award,
        title: 'Excellent Performance!',
        description: `You're crushing it with ${analytics.completionRate}% goal completion rate!`
      });
    }

    if (analytics.avgStreak >= 7) {
      insightsList.push({
        icon: Zap,
        title: 'Consistency Champion',
        description: `Your average habit streak is ${analytics.avgStreak} days. Keep it up!`
      });
    }

    if (analytics.activeStreaks < analytics.totalHabits / 2) {
      insightsList.push({
        icon: TrendingUp,
        title: 'Room for Improvement',
        description: 'Try to maintain streaks on more habits for better consistency.'
      });
    }

    const overdueGoals = goals.filter(g => g.status === 'overdue').length;
    if (overdueGoals > 0) {
      insightsList.push({
        icon: Target,
        title: 'Overdue Goals Alert',
        description: `You have ${overdueGoals} overdue goal${overdueGoals > 1 ? 's' : ''}. Consider reviewing deadlines.`
      });
    }

    return insightsList;
  }, [analytics, goals]);

  const categoryColors: Record<string, string> = {
    personal: 'var(--color-blue-600)',
    work: 'var(--color-purple-600)',
    health: '#10b981',
    finance: '#f97316',
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Analytics</h1>
        <p>Track your performance and gain insights</p>
      </div>

      {/* Time Range Filter */}
      <div className={styles.timeFilter}>
        <button
          className={`${styles.timeButton} ${timeRange === '7d' ? styles.active : ''}`}
          onClick={() => setTimeRange('7d')}
        >
          Last 7 Days
        </button>
        <button
          className={`${styles.timeButton} ${timeRange === '30d' ? styles.active : ''}`}
          onClick={() => setTimeRange('30d')}
        >
          Last 30 Days
        </button>
        <button
          className={`${styles.timeButton} ${timeRange === '90d' ? styles.active : ''}`}
          onClick={() => setTimeRange('90d')}
        >
          Last 90 Days
        </button>
        <button
          className={`${styles.timeButton} ${timeRange === 'all' ? styles.active : ''}`}
          onClick={() => setTimeRange('all')}
        >
          All Time
        </button>
      </div>

      {goals.length === 0 && habits.length === 0 ? (
        <div className={styles.emptyState}>
          <BarChart3 className={styles.emptyIcon} />
          <h3>No Data Yet</h3>
          <p>Create goals and habits to see your analytics</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Completion Rate</span>
                <div className={`${styles.statIcon} ${styles.blue}`}>
                  <Target size={20} />
                </div>
              </div>
              <div className={styles.statValue}>{analytics.completionRate}%</div>
              <div className={`${styles.statChange} ${analytics.completionRate >= analytics.prevCompletionRate ? styles.positive : styles.negative}`}>
                {analytics.completionRate >= analytics.prevCompletionRate ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {Math.abs(analytics.completionRate - analytics.prevCompletionRate)}% from last period
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Average Streak</span>
                <div className={`${styles.statIcon} ${styles.orange}`}>
                  <Zap size={20} />
                </div>
              </div>
              <div className={styles.statValue}>{analytics.avgStreak} days</div>
              <div className={`${styles.statChange} ${analytics.avgStreak >= analytics.prevAvgStreak ? styles.positive : styles.negative}`}>
                {analytics.avgStreak >= analytics.prevAvgStreak ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {Math.abs(analytics.avgStreak - analytics.prevAvgStreak)} days from last period
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Active Streaks</span>
                <div className={`${styles.statIcon} ${styles.green}`}>
                  <Calendar size={20} />
                </div>
              </div>
              <div className={styles.statValue}>{analytics.activeStreaks}/{analytics.totalHabits}</div>
              <div className={styles.statChange}>
                {analytics.totalHabits > 0 
                  ? `${Math.round((analytics.activeStreaks / analytics.totalHabits) * 100)}% of habits`
                  : 'No habits yet'}
              </div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Avg Progress</span>
                <div className={`${styles.statIcon} ${styles.purple}`}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className={styles.statValue}>{analytics.avgProgress}%</div>
              <div className={styles.statChange}>
                Across all goals
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className={styles.chartsGrid}>
            {/* Goals by Category */}
            <motion.div
              className={styles.chartCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={styles.chartHeader}>
                <h3>Goals by Category</h3>
                <p>Distribution of your goals</p>
              </div>
              <div className={styles.pieChart}>
                <div className={styles.pieLegend}>
                  {Object.entries(analytics.goalsByCategory).map(([category, count]) => (
                    <div key={category} className={styles.legendItem}>
                      <div 
                        className={styles.legendColor}
                        style={{ background: categoryColors[category] || '#6b7280' }}
                      />
                      <span className={styles.legendLabel}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className={styles.legendValue}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Weekly Completion Trend */}
            <motion.div
              className={styles.chartCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.chartHeader}>
                <h3>Weekly Completion Trend</h3>
                <p>Last 7 days performance</p>
              </div>
              <div className={styles.barChart}>
                {analytics.weeklyCompletion.map((item, index) => (
                  <div
                    key={index}
                    className={styles.bar}
                    style={{ height: `${Math.max(item.percentage, 5)}%` }}
                  >
                    <span className={styles.barValue}>{item.percentage}%</span>
                    <span className={styles.barLabel}>{item.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              className={`${styles.chartCard} ${styles.fullWidth}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className={styles.chartHeader}>
                <h3>Insights & Recommendations</h3>
                <p>Personalized tips based on your data</p>
              </div>
              <div className={styles.insightsList}>
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div key={index} className={styles.insightItem}>
                      <div className={styles.insightIcon}>
                        <insight.icon size={18} />
                      </div>
                      <div className={styles.insightContent}>
                        <h4>{insight.title}</h4>
                        <p>{insight.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.insightItem}>
                    <div className={styles.insightIcon}>
                      <Lightbulb size={18} />
                    </div>
                    <div className={styles.insightContent}>
                      <h4>Keep Going!</h4>
                      <p>Continue tracking your goals and habits to get personalized insights.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
