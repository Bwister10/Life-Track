import { useState, useMemo } from 'react';
import { Goal } from '@/types/goals';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import { Search, Filter, Grid3x3, List, Plus, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GoalsPage.module.css';

interface GoalsPageProps {
  goals: Goal[];
  darkMode: boolean;
  onAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onCompleteGoal: (id: string) => void;
}

type FilterType = 'all' | 'in-progress' | 'completed' | 'overdue';
type ViewMode = 'grid' | 'list';

export default function GoalsPage({
  goals,
  darkMode,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onUpdateProgress,
  onCompleteGoal,
}: GoalsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(goals.map(g => g.category));
    return ['all', ...Array.from(cats)];
  }, [goals]);

  // Filter and search goals
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Search filter
      const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [goals, searchQuery, filterStatus, filterCategory]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredGoals.length;
    const completed = filteredGoals.filter(g => g.status === 'completed').length;
    const inProgress = filteredGoals.filter(g => g.status === 'in-progress').length;
    const overdue = filteredGoals.filter(g => g.status === 'overdue').length;
    
    return { total, completed, inProgress, overdue };
  }, [filteredGoals]);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Goals</h1>
        <p>Manage and track all your goals in one place</p>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>In Progress</span>
          <span className={styles.statValue}>{stats.inProgress}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Completed</span>
          <span className={styles.statValue}>{stats.completed}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Overdue</span>
          <span className={styles.statValue}>{stats.overdue}</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterButton} ${filterStatus === 'all' ? styles.active : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === 'in-progress' ? styles.active : ''}`}
            onClick={() => setFilterStatus('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === 'completed' ? styles.active : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button
            className={`${styles.filterButton} ${filterStatus === 'overdue' ? styles.active : ''}`}
            onClick={() => setFilterStatus('overdue')}
          >
            Overdue
          </button>
        </div>

        {/* Category Filter */}
        <div className={styles.filterGroup}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterButton} ${filterCategory === cat ? styles.active : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>

        {/* Add Button */}
        <button className={styles.addButton} onClick={onAddGoal}>
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* Goals Display */}
      {filteredGoals.length === 0 ? (
        <div className={styles.emptyState}>
          <Target className={styles.emptyIcon} />
          <h3>No goals found</h3>
          <p>
            {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Create your first goal to get started!'}
          </p>
          {!searchQuery && filterStatus === 'all' && filterCategory === 'all' && (
            <button className={styles.addButton} onClick={onAddGoal}>
              <Plus size={18} />
              Create Your First Goal
            </button>
          )}
        </div>
      ) : (
        <motion.div
          className={viewMode === 'grid' ? styles.grid : styles.listView}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <GoalCard
                  goal={goal}
                  onEdit={() => onEditGoal(goal)}
                  onDelete={() => onDeleteGoal(goal.id)}
                  onUpdateProgress={(progress) => onUpdateProgress(goal.id, progress)}
                  onComplete={() => onCompleteGoal(goal.id)}
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
