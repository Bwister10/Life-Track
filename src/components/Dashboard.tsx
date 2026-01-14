import { useState, useEffect } from "react";
import { Goal, Habit, DashboardStats } from "@/types/goals";
import { storageService } from "@/lib/storage";
import { StatsWidget } from "@/components/StatsWidget";
import { GoalCard } from "@/components/GoalCard";
import { HabitCard } from "@/components/HabitCard";
import { GoalForm } from "@/components/GoalForm";
import { HabitForm } from "@/components/HabitForm";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, differenceInDays } from "date-fns";
import { sampleGoals, sampleHabits } from "@/lib/sampleData";
import styles from "./Dashboard.module.css";
import Sidebar from "./Sidebar";
import GoalsPage from "./GoalsPage";
import HabitsPage from "./HabitsPage";
import AnalyticsPage from "./AnalyticsPage";
import ProgressPage from "./ProgressPage";
import PremiumPage from "./PremiumPage";
import SettingsPage from "./SettingsPage";
import AccountPage, { UserData } from "./AccountPage";
import NotificationsPage from "./NotificationsPage";
import AchievementsPage from "./AchievementsPage";
import TeamPage from "./TeamPage";
import { playCompletionSound, playGoalCompleteSound, playStreakSound } from "@/lib/sounds";

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    currentStreak: 0,
    weeklyProgress: [],
    monthlyProgress: [],
  });
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{
    type: "goal" | "habit";
    id: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [user, setUser] = useState<UserData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // Load user data
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Show premium banner only for non-premium users
        setShowAnnouncementBar(!parsedUser.isPremium);
      } catch (e) {
        console.error("Failed to parse user data");
        setShowAnnouncementBar(false);
      }
    } else {
      setShowAnnouncementBar(false);
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [goals, habits]);

  const loadData = () => {
    const loadedGoals = storageService.getGoals();
    const loadedHabits = storageService.getHabits();

    // Load sample data on first visit
    if (loadedGoals.length === 0 && loadedHabits.length === 0) {
      const hasVisited = localStorage.getItem("hasVisited");
      if (!hasVisited) {
        storageService.saveGoals(sampleGoals);
        storageService.saveHabits(sampleHabits);
        localStorage.setItem("hasVisited", "true");
        setGoals(sampleGoals);
        setHabits(sampleHabits);
        return;
      }
    }

    // Update goal statuses
    const updatedGoals = loadedGoals.map((goal) => {
      if (goal.progress === 100 && goal.status !== "completed") {
        return { ...goal, status: "completed" as const };
      }
      if (new Date(goal.deadline) < new Date() && goal.status !== "completed") {
        return { ...goal, status: "overdue" as const };
      }
      return goal;
    });

    setGoals(updatedGoals);
    setHabits(loadedHabits);
  };

  const calculateStats = () => {
    const completedGoals = goals.filter((g) => g.status === "completed").length;
    const completionRate =
      goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    // Calculate longest current streak across all habits
    const currentStreak = habits.reduce(
      (max, habit) => Math.max(max, habit.streak),
      0,
    );

    setStats({
      totalGoals: goals.length,
      completedGoals,
      completionRate,
      currentStreak,
      weeklyProgress: [],
      monthlyProgress: [],
    });
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (editingGoal) {
      const updatedGoals = goals.map((g) =>
        g.id === editingGoal.id ? { ...g, ...goalData } : g,
      );
      setGoals(updatedGoals);
      storageService.saveGoals(updatedGoals);
      toast({ title: "Goal updated successfully!" });
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalData.title!,
        description: goalData.description,
        category: goalData.category!,
        progress: 0,
        deadline: goalData.deadline!,
        status: "in-progress",
        color: goalData.color!,
        icon: goalData.icon!,
        createdAt: new Date(),
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      storageService.saveGoals(updatedGoals);
      toast({ title: "Goal created successfully!" });
    }
    setEditingGoal(undefined);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      const updatedHabits = habits.map((h) =>
        h.id === editingHabit.id ? { ...h, ...habitData } : h,
      );
      setHabits(updatedHabits);
      storageService.saveHabits(updatedHabits);
      toast({ title: "Habit updated successfully!" });
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitData.name!,
        description: habitData.description,
        frequency: habitData.frequency!,
        color: habitData.color!,
        icon: habitData.icon!,
        streak: 0,
        completedDates: [],
        createdAt: new Date(),
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      storageService.saveHabits(updatedHabits);
      toast({ title: "Habit created successfully!" });
    }
    setEditingHabit(undefined);
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === id) {
        const newStatus = progress === 100 ? "completed" : g.status;
        return { ...g, progress, status: newStatus };
      }
      return g;
    });
    setGoals(updatedGoals);
    storageService.saveGoals(updatedGoals);

    if (progress === 100) {
      setShowConfetti(true);
      toast({
        title: "🎉 Goal completed!",
        description: "Congratulations on your achievement!",
      });
    }
  };

  const handleCompleteGoal = (id: string) => {
    const updatedGoals = goals.map((g) =>
      g.id === id ? { ...g, status: "completed" as const, progress: 100 } : g,
    );
    setGoals(updatedGoals);
    storageService.saveGoals(updatedGoals);
    setShowConfetti(true);
    playGoalCompleteSound();
    toast({
      title: "🎉 Goal completed!",
      description: "Congratulations on your achievement!",
    });
  };

  const handleToggleHabitComplete = (id: string, date: string) => {
    const updatedHabits = habits.map((h) => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(date);
        let newCompletedDates: string[];
        let newStreak = h.streak;

        if (isCompleted) {
          newCompletedDates = h.completedDates.filter((d) => d !== date);
          newStreak = Math.max(0, h.streak - 1);
        } else {
          newCompletedDates = [...h.completedDates, date].sort();
          // Calculate new streak
          const sortedDates = newCompletedDates.sort().reverse();
          newStreak = 1;
          for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff = differenceInDays(
              new Date(sortedDates[i]),
              new Date(sortedDates[i + 1]),
            );
            if (diff === 1) {
              newStreak++;
            } else {
              break;
            }
          }
        }

        return { ...h, completedDates: newCompletedDates, streak: newStreak };
      }
      return h;
    });
    setHabits(updatedHabits);
    storageService.saveHabits(updatedHabits);

    const habit = updatedHabits.find((h) => h.id === id);
    const wasCompleted = habits.find((h) => h.id === id)?.completedDates.includes(date);
    
    if (habit && !wasCompleted) {
      // Play sound when completing (not uncompleting)
      playCompletionSound();
      
      if (habit.streak % 7 === 0 && habit.streak > 0) {
        playStreakSound();
        toast({
          title: "🔥 Milestone reached!",
          description: `${habit.streak} day streak! Keep it up!`,
        });
      }
    }
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter((g) => g.id !== id);
    setGoals(updatedGoals);
    storageService.saveGoals(updatedGoals);
    toast({ title: "Goal deleted" });
    setDeleteDialog(null);
  };

  const handleDeleteHabit = (id: string) => {
    const updatedHabits = habits.filter((h) => h.id !== id);
    setHabits(updatedHabits);
    storageService.saveHabits(updatedHabits);
    toast({ title: "Habit deleted" });
    setDeleteDialog(null);
  };

  const handleNotificationClick = () => {
    setActiveView("notifications");
  };

  const handlePremiumClick = () => {
    setActiveView("premium");
  };



  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Don't show toast for implemented pages
    if (view !== "goals" && view !== "habits" && view !== "dashboard" && view !== "analytics" && view !== "progress" && view !== "premium" && view !== "settings" && view !== "account" && view !== "notifications" && view !== "achievements" && view !== "team") {
      toast({
        title: `${view.charAt(0).toUpperCase() + view.slice(1)}`,
        description: "Coming soon!",
      });
    }
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAnnouncementBar(false);
    localStorage.setItem("user", JSON.stringify(userData));
    toast({ title: "Welcome!", description: `Signed in as ${userData.name}` });
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    toast({ title: "Signed out", description: "You have been logged out." });
    // Redirect to landing page
    window.location.reload();
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Toaster />
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      <AnimatePresence>
        {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      </AnimatePresence>

      {/* Welcome Banner for Logged-in Users */}
      <AnimatePresence>
        {showAnnouncementBar && user && !user.isPremium && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.announcementBar}
          >
            <div className={styles.announcementContent}>
              <div className={styles.announcementText}>
                <p>
                  ✨ Upgrade to Premium for unlimited goals, advanced analytics, and cloud sync!
                </p>
              </div>
              <div className={styles.announcementActions}>
                <button
                  onClick={handlePremiumClick}
                  className={styles.loginButton}
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowAnnouncementBar(false)}
                  className={styles.closeButton}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.mainContent}>
        {/* Render different views based on activeView */}
        {activeView === "goals" ? (
          <GoalsPage
            goals={goals}
            darkMode={darkMode}
            onAddGoal={() => setGoalFormOpen(true)}
            onEditGoal={(goal) => {
              setEditingGoal(goal);
              setGoalFormOpen(true);
            }}
            onDeleteGoal={(id) => setDeleteDialog({ type: "goal", id })}
            onUpdateProgress={handleUpdateProgress}
            onCompleteGoal={handleCompleteGoal}
          />
        ) : activeView === "habits" ? (
          <HabitsPage
            habits={habits}
            darkMode={darkMode}
            onAddHabit={() => setHabitFormOpen(true)}
            onEditHabit={(habit) => {
              setEditingHabit(habit);
              setHabitFormOpen(true);
            }}
            onDeleteHabit={(id) => setDeleteDialog({ type: "habit", id })}
            onToggleHabit={handleToggleHabitComplete}
          />
        ) : activeView === "analytics" ? (
          <AnalyticsPage
            goals={goals}
            habits={habits}
            darkMode={darkMode}
          />
        ) : activeView === "progress" ? (
          <ProgressPage
            goals={goals}
            habits={habits}
            darkMode={darkMode}
          />
        ) : activeView === "premium" ? (
          <PremiumPage darkMode={darkMode} />
        ) : activeView === "settings" ? (
          <SettingsPage 
            darkMode={darkMode} 
            onToggleDarkMode={toggleDarkMode}
            goals={goals}
            habits={habits}
            onImportData={(importedGoals, importedHabits) => {
              setGoals(prev => [...prev, ...importedGoals]);
              setHabits(prev => [...prev, ...importedHabits]);
            }}
          />
        ) : activeView === "account" ? (
          <AccountPage 
            darkMode={darkMode} 
            goals={goals}
            habits={habits}
            user={user}
            onLogout={handleLogout}
          />
        ) : activeView === "notifications" ? (
          <NotificationsPage darkMode={darkMode} />
        ) : activeView === "achievements" ? (
          <AchievementsPage 
            darkMode={darkMode} 
            goals={goals}
            habits={habits}
          />
        ) : activeView === "team" ? (
          <TeamPage
            darkMode={darkMode}
            goals={goals}
            habits={habits}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.header}
            >
              <div className={styles.headerTitle}>
                <h1>Life Goals & Habits</h1>
                <p>Track your progress and build better habits</p>
              </div>

              <div className={styles.headerActions}>
                <button
                  onClick={handlePremiumClick}
                  className={`${styles.iconButton} ${styles.premiumButton}`}
                >
                  <Crown className="h-5 w-5" />
                </button>

                <button
                  onClick={handleNotificationClick}
                  className={styles.iconButton}
                >
                  <Bell className="h-5 w-5" />
                  <span className={styles.notificationDot}></span>
                </button>
              </div>
            </motion.div>

            <div className={styles.statsSection}>
              <StatsWidget stats={stats} />
            </div>

            <Tabs defaultValue="goals" className={styles.tabsContainer}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="habits">Habits</TabsTrigger>
              </TabsList>

              <TabsContent value="goals" className="space-y-4">
                <div className={styles.sectionHeader}>
                  <h2>Your Goals</h2>
                  <button
                    onClick={() => setGoalFormOpen(true)}
                    className={styles.addButton}
                  >
                    <Plus className="h-4 w-4" />
                    Add Goal
                  </button>
                </div>

                {goals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.emptyState}
                  >
                    <p>No goals yet. Create your first goal to get started!</p>
                    <button
                      onClick={() => setGoalFormOpen(true)}
                      className={styles.addButton}
                    >
                      <Plus className="h-4 w-4" />
                      Create Goal
                    </button>
                  </motion.div>
                ) : (
                  <div className={styles.grid}>
                    <AnimatePresence>
                      {goals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onEdit={(g) => {
                            setEditingGoal(g);
                            setGoalFormOpen(true);
                          }}
                          onDelete={(id) =>
                            setDeleteDialog({ type: "goal", id })
                          }
                          onComplete={handleCompleteGoal}
                          onUpdateProgress={handleUpdateProgress}
                          darkMode={darkMode}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="habits" className="space-y-4">
                <div className={styles.sectionHeader}>
                  <h2>Your Habits</h2>
                  <button
                    onClick={() => setHabitFormOpen(true)}
                    className={styles.addButton}
                  >
                    <Plus className="h-4 w-4" />
                    Add Habit
                  </button>
                </div>

                {habits.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.emptyState}
                  >
                    <p>
                      No habits yet. Create your first habit to start tracking!
                    </p>
                    <button
                      onClick={() => setHabitFormOpen(true)}
                      className={styles.addButton}
                    >
                      <Plus className="h-4 w-4" />
                      Create Habit
                    </button>
                  </motion.div>
                ) : (
                  <div className={styles.grid}>
                    <AnimatePresence>
                      {habits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onEdit={(h) => {
                            setEditingHabit(h);
                            setHabitFormOpen(true);
                          }}
                          onDelete={(id) =>
                            setDeleteDialog({ type: "habit", id })
                          }
                          onToggle={(date) => handleToggleHabitComplete(habit.id, date)}
                          darkMode={darkMode}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <GoalForm
        open={goalFormOpen}
        onClose={() => {
          setGoalFormOpen(false);
          setEditingGoal(undefined);
        }}
        onSave={handleSaveGoal}
        goal={editingGoal}
        isPremium={user?.isPremium || false}
        darkMode={darkMode}
      />

      <HabitForm
        open={habitFormOpen}
        onClose={() => {
          setHabitFormOpen(false);
          setEditingHabit(undefined);
        }}
        onSave={handleSaveHabit}
        habit={editingHabit}
        isPremium={user?.isPremium || false}
        darkMode={darkMode}
      />

      <AlertDialog
        open={deleteDialog !== null}
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {deleteDialog?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog?.type === "goal") {
                  handleDeleteGoal(deleteDialog.id);
                } else if (deleteDialog?.type === "habit") {
                  handleDeleteHabit(deleteDialog.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
