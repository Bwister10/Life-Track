import { Goal, Habit } from '@/types/goals';

const STORAGE_KEYS = {
  GOALS: 'goals-dashboard-goals',
  HABITS: 'goals-dashboard-habits',
};

export const storageService = {
  // Goals
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) return [];
    return JSON.parse(data).map((goal: any) => ({
      ...goal,
      deadline: new Date(goal.deadline),
      createdAt: new Date(goal.createdAt),
    }));
  },

  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  // Habits
  getHabits: (): Habit[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) return [];
    return JSON.parse(data).map((habit: any) => ({
      ...habit,
      createdAt: new Date(habit.createdAt),
    }));
  },

  saveHabits: (habits: Habit[]) => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },
};
