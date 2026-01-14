import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckCircle2,
  Flame,
  BarChart3,
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Play,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Users,
  Trophy,
  Calendar,
  Moon,
  Sun,
} from "lucide-react";
import styles from "./LandingPage.module.css";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({
  onGetStarted,
  onLogin,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Check dark mode preference
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const features = [
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set meaningful goals with deadlines, categories, and visual progress tracking.",
      color: "blue",
    },
    {
      icon: Flame,
      title: "Habit Streaks",
      description:
        "Build lasting habits with streak tracking and daily check-ins.",
      color: "orange",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize your progress with beautiful charts and statistics.",
      color: "purple",
    },
    {
      icon: Trophy,
      title: "Milestones & Rewards",
      description:
        "Celebrate achievements with confetti animations and milestone tracking.",
      color: "yellow",
    },
    {
      icon: Calendar,
      title: "Calendar View",
      description: "See your habits and goals in a visual calendar format.",
      color: "green",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your data stays on your device. No account required to start.",
      color: "teal",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Entrepreneur",
      content:
        "LifeTrack has completely transformed how I approach my daily routines. The streak feature keeps me motivated!",
      avatar: "S",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Software Developer",
      content:
        "Finally, a goal tracker that actually looks good and is easy to use. The dark mode is perfect for late-night planning.",
      avatar: "J",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Fitness Coach",
      content:
        "I recommend this to all my clients. The visual progress bars are incredibly motivating.",
      avatar: "E",
      rating: 5,
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1M+", label: "Goals Completed" },
    { value: "5M+", label: "Habits Tracked" },
    { value: "4.9", label: "App Rating" },
  ];

  return (
    <div className={`${styles.landing} ${darkMode ? styles.dark : ""}`}>
      {/* Navigation */}
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Target size={24} />
            </div>
            <span className={styles.logoText}>LifeTrack</span>
          </div>

          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
            <a href="#how-it-works" className={styles.navLink}>
              How It Works
            </a>
            <a href="#testimonials" className={styles.navLink}>
              Testimonials
            </a>
            <a href="#pricing" className={styles.navLink}>
              Pricing
            </a>
          </div>

          <div className={styles.navActions}>
            <button onClick={toggleDarkMode} className={styles.themeToggle}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onLogin} className={styles.loginBtn}>
              Sign In
            </button>
            <button onClick={onGetStarted} className={styles.ctaBtn}>
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.mobileMenu}
            >
              <a
                href="#features"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className={styles.mobileBtns}>
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className={styles.loginBtn}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className={styles.ctaBtn}
                >
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroText}
          >
            <div className={styles.badge}>
              <Sparkles size={14} />
              <span>Trusted by 50,000+ users</span>
            </div>
            <h1>
              Transform Your Life,
              <br />
              <span className={styles.gradient}>One Goal at a Time</span>
            </h1>
            <p>
              The beautiful, intuitive app for tracking your goals and building
              lasting habits. Visualize your progress, stay motivated, and
              achieve more than you ever thought possible.
            </p>
            <div className={styles.heroCtas}>
              <button onClick={onGetStarted} className={styles.primaryBtn}>
                Start Free Today
                <ArrowRight size={18} />
              </button>
              <button className={styles.secondaryBtn}>
                <Play size={18} />
                Watch Demo
              </button>
            </div>
            <div className={styles.heroStats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.heroStat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroImage}
          >
            <div className={styles.mockupContainer}>
              <img
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80"
                alt="Goal tracking dashboard preview"
                className={styles.mockupImage}
              />
              <div className={styles.floatingCard1}>
                <div
                  className={styles.floatingIcon}
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                >
                  <CheckCircle2 size={20} color="white" />
                </div>
                <div>
                  <span className={styles.floatingTitle}>Goal Completed!</span>
                  <span className={styles.floatingSubtitle}>Learn Spanish</span>
                </div>
              </div>
              <div className={styles.floatingCard2}>
                <div
                  className={styles.floatingIcon}
                  style={{
                    background: "linear-gradient(135deg, #f97316, #eab308)",
                  }}
                >
                  <Flame size={20} color="white" />
                </div>
                <div>
                  <span className={styles.floatingTitle}>
                    🔥 30 Day Streak!
                  </span>
                  <span className={styles.floatingSubtitle}>
                    Morning Exercise
                  </span>
                </div>
              </div>
              <div className={styles.floatingCard3}>
                <div className={styles.progressRing}>
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray="75, 100"
                    />
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.scrollIndicator}>
          <ChevronDown className={styles.bounceAnimation} size={24} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionTag}>Features</span>
            <h2>Everything You Need to Succeed</h2>
            <p>
              Powerful tools designed to help you track, measure, and achieve
              your goals.
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.featureCard}
              >
                <div
                  className={`${styles.featureIcon} ${styles[feature.color]}`}
                >
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionTag}>How It Works</span>
            <h2>Get Started in 3 Simple Steps</h2>
            <p>Begin your journey to a more productive life in just minutes.</p>
          </motion.div>

          <div className={styles.stepsContainer}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={styles.step}
            >
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Set Your Goals</h3>
                <p>
                  Define what matters most to you. Add deadlines, categories,
                  and personalize with colors and icons.
                </p>
              </div>
              <div className={styles.stepImage}>
                <img
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80"
                  alt="Setting goals"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`${styles.step} ${styles.stepReverse}`}
            >
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Track Daily Habits</h3>
                <p>
                  Build consistency with daily check-ins. Watch your streaks
                  grow and stay motivated.
                </p>
              </div>
              <div className={styles.stepImage}>
                <img
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=80"
                  alt="Tracking habits"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={styles.step}
            >
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Celebrate Progress</h3>
                <p>
                  Review your analytics, celebrate milestones, and watch
                  yourself transform over time.
                </p>
              </div>
              <div className={styles.stepImage}>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80"
                  alt="Celebrating progress"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className={styles.appPreview}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionTag}>App Preview</span>
            <h2>Beautiful Design Meets Powerful Features</h2>
            <p>
              Every detail is crafted to help you stay focused and motivated.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.previewGrid}
          >
            <div className={styles.previewMain}>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Dashboard overview"
              />
              <div className={styles.previewOverlay}>
                <span>Dashboard Overview</span>
              </div>
            </div>
            <div className={styles.previewSide}>
              <div className={styles.previewSmall}>
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
                  alt="Goal cards"
                />
                <div className={styles.previewOverlay}>
                  <span>Goal Cards</span>
                </div>
              </div>
              <div className={styles.previewSmall}>
                <img
                  src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80"
                  alt="Analytics"
                />
                <div className={styles.previewOverlay}>
                  <span>Analytics</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionTag}>Testimonials</span>
            <h2>Loved by Thousands</h2>
            <p>See what our users have to say about their experience.</p>
          </motion.div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.testimonialCard}
              >
                <div className={styles.testimonialStars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className={styles.testimonialContent}>
                  "{testimonial.content}"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <span className={styles.testimonialName}>
                      {testimonial.name}
                    </span>
                    <span className={styles.testimonialRole}>
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionTag}>Pricing</span>
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free, upgrade when you're ready.</p>
          </motion.div>

          <div className={styles.pricingGrid}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.pricingCard}
            >
              <div className={styles.pricingHeader}>
                <h3>Free</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>0</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p>Perfect for getting started</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <CheckCircle2 size={16} /> Up to 5 goals
                </li>
                <li>
                  <CheckCircle2 size={16} /> Up to 3 habits
                </li>
                <li>
                  <CheckCircle2 size={16} /> Basic analytics
                </li>
                <li>
                  <CheckCircle2 size={16} /> Local storage
                </li>
              </ul>
              <button onClick={onGetStarted} className={styles.pricingBtn}>
                Get Started Free
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`${styles.pricingCard} ${styles.featured}`}
            >
              <div className={styles.popularBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Pro</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>9.99</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p>For serious goal achievers</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <CheckCircle2 size={16} /> Unlimited goals
                </li>
                <li>
                  <CheckCircle2 size={16} /> Unlimited habits
                </li>
                <li>
                  <CheckCircle2 size={16} /> Advanced analytics
                </li>
                <li>
                  <CheckCircle2 size={16} /> Cloud sync
                </li>
                <li>
                  <CheckCircle2 size={16} /> Custom themes
                </li>
                <li>
                  <CheckCircle2 size={16} /> Priority support
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className={`${styles.pricingBtn} ${styles.primaryPricingBtn}`}
              >
                Start Free Trial
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaContent}
          >
            <h2>Ready to Transform Your Life?</h2>
            <p>
              Join thousands of users who are already achieving their goals with
              LifeTrack.
            </p>
            <button onClick={onGetStarted} className={styles.ctaBtnLarge}>
              Get Started for Free
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Target size={24} />
                </div>
                <span className={styles.logoText}>LifeTrack</span>
              </div>
              <p>
                Your personal companion for achieving goals and building lasting
                habits.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Twitter">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#">Changelog</a>
              </div>
              <div className={styles.footerColumn}>
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className={styles.footerColumn}>
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">Community</a>
                <a href="#">Status</a>
              </div>
              <div className={styles.footerColumn}>
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 LifeTrack. All rights reserved.</p>
            <p>
              Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for
              goal achievers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
