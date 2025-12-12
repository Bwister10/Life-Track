import { DashboardStats } from "@/types/goals";
import { Target, TrendingUp, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./StatsWidget.module.css";

interface StatsWidgetProps {
  stats: DashboardStats;
}

export const StatsWidget = ({ stats }: StatsWidgetProps) => {
  const statCards = [
    {
      title: "Total Goals",
      value: stats.totalGoals,
      icon: Target,
      colorClass: "blue",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      colorClass: "green",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      colorClass: "orange",
    },
    {
      title: "Completed",
      value: stats.completedGoals,
      icon: Award,
      colorClass: "purple",
    },
  ];

  return (
    <div className={styles.grid}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p>{stat.title}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
              <div className={`${styles.iconBox} ${styles[stat.colorClass]}`}>
                <stat.icon
                  className={`${styles.icon} ${styles[stat.colorClass]}`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
