import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Trophy,
  Star,
  Flame,
  Target,
  Zap,
  Crown,
  Medal,
  Sparkles,
  Lock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Heart,
  Rocket,
  Shield,
  Gem,
  Sun,
  Moon
} from 'lucide-react';
import styles from './AchievementsPage.module.css';
import { Goal, Habit } from '@/types/goals';
import { Confetti } from './Confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'goals' | 'habits' | 'streaks' | 'special';
  xpReward: number;
}

interface AchievementsPageProps {
  darkMode: boolean;
  goals: Goal[];
  habits: Habit[];
}

export default function AchievementsPage({ darkMode, goals, habits }: AchievementsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);

  // Calculate stats from goals and habits
  const completedGoals = goals.filter(g => g.progress >= 100).length;
  const totalGoals = goals.length;
  const totalHabits = habits.length;
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalCompletedHabits = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  // Generate achievements based on user progress
  const generateAchievements = (): Achievement[] => {
    return [
      // Goals Achievements
      {
        id: 'first_goal',
        title: 'First Steps',
        description: 'Create your first goal',
        icon: Target,
        color: '#60A5FA',
        requirement: 'Create 1 goal',
        progress: Math.min(totalGoals, 1),
        maxProgress: 1,
        unlocked: totalGoals >= 1,
        rarity: 'common',
        category: 'goals',
        xpReward: 50
      },
      {
        id: 'goal_setter',
        title: 'Goal Setter',
        description: 'Create 5 different goals',
        icon: Star,
        color: '#FBBF24',
        requirement: 'Create 5 goals',
        progress: Math.min(totalGoals, 5),
        maxProgress: 5,
        unlocked: totalGoals >= 5,
        rarity: 'common',
        category: 'goals',
        xpReward: 100
      },
      {
        id: 'achiever',
        title: 'Achiever',
        description: 'Complete your first goal',
        icon: Trophy,
        color: '#F59E0B',
        requirement: 'Complete 1 goal',
        progress: Math.min(completedGoals, 1),
        maxProgress: 1,
        unlocked: completedGoals >= 1,
        rarity: 'rare',
        category: 'goals',
        xpReward: 150
      },
      {
        id: 'goal_crusher',
        title: 'Goal Crusher',
        description: 'Complete 5 goals',
        icon: Zap,
        color: '#8B5CF6',
        requirement: 'Complete 5 goals',
        progress: Math.min(completedGoals, 5),
        maxProgress: 5,
        unlocked: completedGoals >= 5,
        rarity: 'epic',
        category: 'goals',
        xpReward: 300
      },
      {
        id: 'master_achiever',
        title: 'Master Achiever',
        description: 'Complete 10 goals',
        icon: Crown,
        color: '#F472B6',
        requirement: 'Complete 10 goals',
        progress: Math.min(completedGoals, 10),
        maxProgress: 10,
        unlocked: completedGoals >= 10,
        rarity: 'legendary',
        category: 'goals',
        xpReward: 500
      },
      // Habits Achievements
      {
        id: 'habit_starter',
        title: 'Habit Starter',
        description: 'Create your first habit',
        icon: Calendar,
        color: '#34D399',
        requirement: 'Create 1 habit',
        progress: Math.min(totalHabits, 1),
        maxProgress: 1,
        unlocked: totalHabits >= 1,
        rarity: 'common',
        category: 'habits',
        xpReward: 50
      },
      {
        id: 'habit_collector',
        title: 'Habit Collector',
        description: 'Create 5 different habits',
        icon: Heart,
        color: '#EC4899',
        requirement: 'Create 5 habits',
        progress: Math.min(totalHabits, 5),
        maxProgress: 5,
        unlocked: totalHabits >= 5,
        rarity: 'rare',
        category: 'habits',
        xpReward: 150
      },
      {
        id: 'consistent',
        title: 'Consistent',
        description: 'Complete habits 10 times',
        icon: CheckCircle2,
        color: '#10B981',
        requirement: 'Complete 10 habit check-ins',
        progress: Math.min(totalCompletedHabits, 10),
        maxProgress: 10,
        unlocked: totalCompletedHabits >= 10,
        rarity: 'common',
        category: 'habits',
        xpReward: 100
      },
      {
        id: 'dedicated',
        title: 'Dedicated',
        description: 'Complete habits 50 times',
        icon: Shield,
        color: '#6366F1',
        requirement: 'Complete 50 habit check-ins',
        progress: Math.min(totalCompletedHabits, 50),
        maxProgress: 50,
        unlocked: totalCompletedHabits >= 50,
        rarity: 'epic',
        category: 'habits',
        xpReward: 350
      },
      // Streak Achievements
      {
        id: 'streak_starter',
        title: 'Streak Starter',
        description: 'Achieve a 3-day streak',
        icon: Flame,
        color: '#F97316',
        requirement: '3-day streak',
        progress: Math.min(maxStreak, 3),
        maxProgress: 3,
        unlocked: maxStreak >= 3,
        rarity: 'common',
        category: 'streaks',
        xpReward: 75
      },
      {
        id: 'on_fire',
        title: 'On Fire!',
        description: 'Achieve a 7-day streak',
        icon: Flame,
        color: '#EF4444',
        requirement: '7-day streak',
        progress: Math.min(maxStreak, 7),
        maxProgress: 7,
        unlocked: maxStreak >= 7,
        rarity: 'rare',
        category: 'streaks',
        xpReward: 200
      },
      {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Achieve a 14-day streak',
        icon: Rocket,
        color: '#8B5CF6',
        requirement: '14-day streak',
        progress: Math.min(maxStreak, 14),
        maxProgress: 14,
        unlocked: maxStreak >= 14,
        rarity: 'epic',
        category: 'streaks',
        xpReward: 400
      },
      {
        id: 'legendary_streak',
        title: 'Legendary',
        description: 'Achieve a 30-day streak',
        icon: Gem,
        color: '#F472B6',
        requirement: '30-day streak',
        progress: Math.min(maxStreak, 30),
        maxProgress: 30,
        unlocked: maxStreak >= 30,
        rarity: 'legendary',
        category: 'streaks',
        xpReward: 750
      },
      // Special Achievements
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete a habit before 8 AM',
        icon: Sun,
        color: '#FBBF24',
        requirement: 'Complete habit early',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        rarity: 'rare',
        category: 'special',
        xpReward: 200
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete a habit after 10 PM',
        icon: Moon,
        color: '#6366F1',
        requirement: 'Complete habit late',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        rarity: 'rare',
        category: 'special',
        xpReward: 200
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete all habits in a single day',
        icon: Sparkles,
        color: '#EC4899',
        requirement: 'All habits in one day',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        rarity: 'epic',
        category: 'special',
        xpReward: 300
      },
    ];
  };

  const achievements = generateAchievements();

  // Calculate total XP and level
  useEffect(() => {
    const totalXP = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xpReward, 0);
    setUserXP(totalXP);
    setUserLevel(Math.floor(totalXP / 500) + 1);
  }, [achievements]);

  const categories = [
    { id: 'all', label: 'All', icon: Award },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'habits', label: 'Habits', icon: Calendar },
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'special', label: 'Special', icon: Sparkles },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  const xpForNextLevel = userLevel * 500;
  const currentLevelXP = userXP % 500;
  const xpProgress = (currentLevelXP / 500) * 100;

  return (
    <div className={`${styles.achievementsPage} ${darkMode ? styles.dark : ''}`}>
      {showConfetti && <Confetti />}

      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Award className={styles.titleIcon} size={32} />
            <div>
              <h1>Achievements</h1>
              <p>Track your progress and unlock rewards</p>
            </div>
          </div>

          {/* Level Card */}
          <div className={styles.levelCard}>
            <div className={styles.levelBadge}>
              <Trophy size={24} />
              <span>Level {userLevel}</span>
            </div>
            <div className={styles.xpSection}>
              <div className={styles.xpBar}>
                <motion.div 
                  className={styles.xpFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.xpText}>{currentLevelXP} / 500 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <Medal className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{unlockedCount}/{totalCount}</span>
            <span className={styles.statLabel}>Unlocked</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Sparkles className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{userXP}</span>
            <span className={styles.statLabel}>Total XP</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Flame className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{maxStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{completedGoals}</span>
            <span className={styles.statLabel}>Goals Done</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon size={18} />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className={styles.achievementsGrid}>
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
              onClick={() => setSelectedAchievement(achievement)}
              style={{
                '--achievement-color': achievement.color,
                '--rarity-color': getRarityColor(achievement.rarity)
              } as React.CSSProperties}
            >
              <div className={styles.rarityBadge} style={{ background: getRarityColor(achievement.rarity) }}>
                {getRarityLabel(achievement.rarity)}
              </div>

              <div className={styles.achievementIcon}>
                {achievement.unlocked ? (
                  <achievement.icon size={32} style={{ color: achievement.color }} />
                ) : (
                  <Lock size={32} />
                )}
              </div>

              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p className={styles.achievementDesc}>{achievement.description}</p>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <motion.div
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    style={{ background: achievement.color }}
                  />
                </div>
                <span className={styles.progressText}>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>

              {/* XP Reward */}
              <div className={styles.xpReward}>
                <Sparkles size={14} />
                <span>+{achievement.xpReward} XP</span>
              </div>

              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={styles.unlockedBadge}
                >
                  <CheckCircle2 size={20} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.achievementModal}
              onClick={e => e.stopPropagation()}
            >
              <div 
                className={styles.modalIcon}
                style={{ background: `linear-gradient(135deg, ${selectedAchievement.color}20, ${selectedAchievement.color}40)` }}
              >
                {selectedAchievement.unlocked ? (
                  <selectedAchievement.icon size={48} style={{ color: selectedAchievement.color }} />
                ) : (
                  <Lock size={48} style={{ color: '#9CA3AF' }} />
                )}
              </div>

              <div className={styles.modalRarity} style={{ color: getRarityColor(selectedAchievement.rarity) }}>
                {getRarityLabel(selectedAchievement.rarity)}
              </div>

              <h2>{selectedAchievement.title}</h2>
              <p className={styles.modalDesc}>{selectedAchievement.description}</p>

              <div className={styles.modalRequirement}>
                <span>Requirement:</span>
                <strong>{selectedAchievement.requirement}</strong>
              </div>

              <div className={styles.modalProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ 
                      width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%`,
                      background: selectedAchievement.color
                    }}
                  />
                </div>
                <span>{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
              </div>

              <div className={styles.modalReward}>
                <Sparkles size={20} style={{ color: '#FBBF24' }} />
                <span>+{selectedAchievement.xpReward} XP Reward</span>
              </div>

              {selectedAchievement.unlocked && (
                <div className={styles.unlockedStatus}>
                  <CheckCircle2 size={20} style={{ color: '#22C55E' }} />
                  <span>Achievement Unlocked!</span>
                </div>
              )}

              <button 
                className={styles.closeModalBtn}
                onClick={() => setSelectedAchievement(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
