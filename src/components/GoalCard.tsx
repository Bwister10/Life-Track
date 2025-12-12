import { Goal } from "@/types/goals";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import styles from "./GoalCard.module.css";

interface GoalCardProps {
  goal: Goal;
  darkMode: boolean;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

export const GoalCard = ({
  goal,
  darkMode,
  onEdit,
  onDelete,
  onComplete,
  onUpdateProgress,
}: GoalCardProps) => {
  const getStatusClass = () => {
    switch (goal.status) {
      case "completed":
        return styles.completed;
      case "overdue":
        return styles.overdue;
      default:
        return styles.inProgress;
    }
  };

  const getStatusText = () => {
    switch (goal.status) {
      case "completed":
        return "Completed";
      case "overdue":
        return "Overdue";
      default:
        return "In Progress";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`${styles.card} ${darkMode ? styles.dark : ""}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <div
              className={styles.iconContainer}
              style={{ backgroundColor: `${goal.color}20` }}
            >
              {goal.icon}
            </div>
            <div className={styles.cardTitle}>
              <h3>{goal.title}</h3>
              <span className={styles.badge}>{goal.category}</span>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button
              onClick={() => onEdit(goal)}
              className={styles.actionButton}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {goal.description && (
          <p className={styles.description}>{goal.description}</p>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressValue}>{goal.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${goal.progress}%` }}
            />
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.deadline}>
              <Calendar className="h-4 w-4" />
              <span>{format(goal.deadline, "MMM dd, yyyy")}</span>
            </div>
            <span className={`${styles.statusBadge} ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {goal.status !== "completed" && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.progressButton}
              onClick={() =>
                onUpdateProgress(goal.id, Math.min(goal.progress + 10, 100))
              }
            >
              +10%
            </button>
            {goal.progress === 100 && (
              <button
                className={styles.completeButton}
                onClick={() => onComplete(goal.id)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
