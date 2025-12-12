export type GoalStatus = 'in-progress' | 'completed' | 'overdue';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  progress: number;
  deadline: Date;
  status: GoalStatus;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  color: string;
  icon: string;
  streak: number;
  completedDates: string[];
  createdAt: Date;
}

export interface DashboardStats {
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
  currentStreak: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
}
