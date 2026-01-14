import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Crown,
  Plus,
  Mail,
  Shield,
  UserPlus,
  Settings,
  BarChart3,
  Target,
  Calendar,
  ChevronRight,
  X,
  Check,
  Copy,
  Link2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import styles from './TeamPage.module.css';
import { Goal, Habit } from '@/types/goals';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
  joinedAt: string;
  goalsCompleted: number;
  currentStreak: number;
}

interface TeamPageProps {
  darkMode: boolean;
  goals: Goal[];
  habits: Habit[];
}

export default function TeamPage({ darkMode, goals, habits }: TeamPageProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [activeTab, setActiveTab] = useState<'members' | 'shared' | 'analytics'>('members');
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if user has Enterprise plan
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEnterprise = user.planType === 'enterprise';

  // Mock team members
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user.name || 'You',
      email: user.email || 'you@example.com',
      role: 'admin',
      joinedAt: user.createdAt || new Date().toISOString(),
      goalsCompleted: goals.filter(g => g.progress >= 100).length,
      currentStreak: Math.max(...habits.map(h => h.streak), 0)
    }
  ]);

  // Mock shared goals
  const sharedGoals = goals.slice(0, 3);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://lifetrack.app/invite/${user.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    // In a real app, this would send an invite
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  if (!isEnterprise) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.upgradePrompt}>
          <div className={styles.upgradeIcon}>
            <Users size={48} />
          </div>
          <h2>Team Collaboration</h2>
          <p>
            Upgrade to the Enterprise plan to unlock team collaboration features including 
            shared goals, team analytics, admin dashboard, and more.
          </p>
          <div className={styles.upgradeFeatures}>
            <div className={styles.upgradeFeature}>
              <Check size={18} />
              <span>Invite unlimited team members</span>
            </div>
            <div className={styles.upgradeFeature}>
              <Check size={18} />
              <span>Share goals and habits</span>
            </div>
            <div className={styles.upgradeFeature}>
              <Check size={18} />
              <span>Team analytics dashboard</span>
            </div>
            <div className={styles.upgradeFeature}>
              <Check size={18} />
              <span>Admin controls</span>
            </div>
          </div>
          <button 
            className={styles.upgradeButton}
            onClick={() => window.location.href = '#premium'}
          >
            <Crown size={18} />
            Upgrade to Enterprise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>Team Workspace</h1>
          <p>Collaborate with your team on goals and habits</p>
        </div>
        <button className={styles.inviteButton} onClick={() => setShowInviteModal(true)}>
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'members' ? styles.active : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <Users size={18} />
          Members
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'shared' ? styles.active : ''}`}
          onClick={() => setActiveTab('shared')}
        >
          <Target size={18} />
          Shared Goals
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          Team Analytics
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.membersGrid}>
              {teamMembers.map(member => (
                <div key={member.id} className={styles.memberCard}>
                  <div className={styles.memberHeader}>
                    <div className={styles.memberAvatar}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.memberInfo}>
                      <h3>
                        {member.name}
                        {member.role === 'admin' && (
                          <span className={styles.adminBadge}>
                            <Shield size={12} /> Admin
                          </span>
                        )}
                      </h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                  <div className={styles.memberStats}>
                    <div className={styles.memberStat}>
                      <Target size={16} />
                      <span>{member.goalsCompleted} goals</span>
                    </div>
                    <div className={styles.memberStat}>
                      <Calendar size={16} />
                      <span>{member.currentStreak} day streak</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add member card */}
              <div 
                className={`${styles.memberCard} ${styles.addMember}`}
                onClick={() => setShowInviteModal(true)}
              >
                <Plus size={24} />
                <span>Invite Team Member</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'shared' && (
          <motion.div
            key="shared"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.sharedSection}>
              <div className={styles.sharedHeader}>
                <h2>Shared Goals</h2>
                <button className={styles.addSharedBtn}>
                  <Plus size={16} />
                  Create Shared Goal
                </button>
              </div>

              {sharedGoals.length > 0 ? (
                <div className={styles.sharedGoalsGrid}>
                  {sharedGoals.map(goal => (
                    <div key={goal.id} className={styles.sharedGoalCard}>
                      <div className={styles.sharedGoalIcon}>{goal.icon}</div>
                      <div className={styles.sharedGoalInfo}>
                        <h3>{goal.title}</h3>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{goal.progress}% complete</span>
                      </div>
                      <div className={styles.sharedGoalMembers}>
                        <div className={styles.memberAvatarSmall}>
                          {(user.name || 'U').charAt(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Target size={48} />
                  <h3>No shared goals yet</h3>
                  <p>Create a shared goal to collaborate with your team.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.content}
          >
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <div className={styles.analyticsIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.analyticsInfo}>
                  <span className={styles.analyticsValue}>{teamMembers.length}</span>
                  <span className={styles.analyticsLabel}>Team Members</span>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <div className={styles.analyticsIcon}>
                  <Target size={24} />
                </div>
                <div className={styles.analyticsInfo}>
                  <span className={styles.analyticsValue}>{goals.filter(g => g.progress >= 100).length}</span>
                  <span className={styles.analyticsLabel}>Goals Completed</span>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <div className={styles.analyticsIcon}>
                  <Calendar size={24} />
                </div>
                <div className={styles.analyticsInfo}>
                  <span className={styles.analyticsValue}>
                    {Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / Math.max(habits.length, 1))}
                  </span>
                  <span className={styles.analyticsLabel}>Avg. Streak</span>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <div className={styles.analyticsIcon}>
                  <BarChart3 size={24} />
                </div>
                <div className={styles.analyticsInfo}>
                  <span className={styles.analyticsValue}>
                    {goals.length > 0 
                      ? Math.round(goals.filter(g => g.progress >= 100).length / goals.length * 100)
                      : 0}%
                  </span>
                  <span className={styles.analyticsLabel}>Completion Rate</span>
                </div>
              </div>
            </div>

            <div className={styles.leaderboard}>
              <h2>Team Leaderboard</h2>
              <div className={styles.leaderboardList}>
                {teamMembers.map((member, index) => (
                  <div key={member.id} className={styles.leaderboardItem}>
                    <span className={styles.rank}>#{index + 1}</span>
                    <div className={styles.memberAvatarSmall}>
                      {member.name.charAt(0)}
                    </div>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberScore}>{member.goalsCompleted} goals</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <UserPlus size={24} />
                <h3>Invite Team Member</h3>
                <button className={styles.closeBtn} onClick={() => setShowInviteModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.inviteOptions}>
                <div className={styles.inviteByEmail}>
                  <label>Invite by Email</label>
                  <div className={styles.emailInput}>
                    <Mail size={18} />
                    <input
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                    />
                  </div>

                  <label>Role</label>
                  <div className={styles.roleSelector}>
                    <button
                      className={`${styles.roleOption} ${inviteRole === 'member' ? styles.selected : ''}`}
                      onClick={() => setInviteRole('member')}
                    >
                      <Users size={16} />
                      Member
                    </button>
                    <button
                      className={`${styles.roleOption} ${inviteRole === 'admin' ? styles.selected : ''}`}
                      onClick={() => setInviteRole('admin')}
                    >
                      <Shield size={16} />
                      Admin
                    </button>
                  </div>

                  <button className={styles.sendInviteBtn} onClick={handleInvite}>
                    Send Invite
                  </button>
                </div>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <div className={styles.inviteByLink}>
                  <label>Share Invite Link</label>
                  <div className={styles.linkInput}>
                    <input
                      type="text"
                      readOnly
                      value={`https://lifetrack.app/invite/${user.id || 'team'}`}
                    />
                    <button onClick={handleCopyInviteLink}>
                      {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className={styles.linkNote}>
                    Anyone with this link can join your team as a member.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
