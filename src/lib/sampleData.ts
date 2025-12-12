import { Goal, Habit } from '@/types/goals';

export const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn React & TypeScript',
    description: 'Master modern web development with React and TypeScript',
    category: 'Learning',
    progress: 65,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'in-progress',
    color: '#60A5FA',
    icon: '📚',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Run a Marathon',
    description: 'Complete a full 42km marathon race',
    category: 'Health',
    progress: 40,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    status: 'in-progress',
    color: '#34D399',
    icon: '🏃',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Save $10,000',
    description: 'Build an emergency fund',
    category: 'Finance',
    progress: 75,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: 'in-progress',
    color: '#FBBF24',
    icon: '💰',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
];

export const sampleHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    frequency: 'daily',
    color: '#A78BFA',
    icon: '🧘',
    streak: 12,
    completedDates: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Read for 30 minutes',
    description: 'Daily reading habit',
    frequency: 'daily',
    color: '#60A5FA',
    icon: '📚',
    streak: 7,
    completedDates: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    frequency: 'daily',
    color: '#34D399',
    icon: '💧',
    streak: 5,
    completedDates: Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];
