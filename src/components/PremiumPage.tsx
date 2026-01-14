import { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Target, 
  BarChart3, 
  Calendar, 
  Cloud, 
  Users, 
  Shield, 
  Sparkles,
  Infinity,
  Bell,
  Palette,
  Download,
  HeadphonesIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './PremiumPage.module.css';
import CheckoutPage from './CheckoutPage';

interface PremiumPageProps {
  darkMode: boolean;
}

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: '/forever',
    icon: 'free',
    buttonStyle: 'secondary',
    buttonText: 'Current Plan',
    features: [
      { text: 'Up to 5 goals', included: true },
      { text: 'Up to 3 habits', included: true },
      { text: 'Basic progress tracking', included: true },
      { text: '7-day history', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Custom emoji icons', included: false },
      { text: 'Advanced insights', included: false },
      { text: 'Cloud sync', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'For serious goal achievers',
    price: '$9.99',
    period: '/month',
    icon: 'pro',
    buttonStyle: 'primary',
    buttonText: 'Upgrade to Pro',
    popular: true,
    features: [
      { text: 'Unlimited goals', included: true },
      { text: 'Unlimited habits', included: true },
      { text: 'Advanced progress tracking', included: true },
      { text: 'Unlimited history', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Cloud sync across devices', included: true },
      { text: 'Custom emoji icons (100+)', included: true },
      { text: 'Custom themes & colors', included: true },
      { text: 'Export data (CSV, PDF)', included: true },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: '$29.99',
    period: '/month',
    icon: 'enterprise',
    buttonStyle: 'gradient',
    buttonText: 'Contact Sales',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Shared goals & habits', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Team analytics', included: true },
      { text: 'API access', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Dedicated support', included: true },
    ],
  },
];

const premiumFeatures = [
  {
    icon: Infinity,
    title: 'Unlimited Everything',
    description: 'Create as many goals and habits as you need without any restrictions.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep insights into your progress with detailed charts and trend analysis.',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Access your data from any device with automatic cloud synchronization.',
  },
  {
    icon: Sparkles,
    title: 'Custom Emoji Icons',
    description: 'Choose from 100+ emojis to personalize your goals and habits.',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    description: 'Personalize your dashboard with custom colors and themes.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'AI-powered reminders that adapt to your schedule and habits.',
  },
  {
    icon: Download,
    title: 'Data Export',
    description: 'Export your data in multiple formats including CSV and PDF reports.',
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start.',
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'Your data is always safe. If you downgrade, you\'ll keep access to your most recent goals and habits within the free plan limits.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
  },
];

export default function PremiumPage({ darkMode }: PremiumPageProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');
  
  // Check if user is already premium
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user.isPremium || false;
  const currentPlanType = user.planType || 'free';

  const handleUpgradeClick = (planType: 'pro' | 'enterprise') => {
    setSelectedPlan(planType);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    // Reload page to reflect premium status
    window.location.reload();
  };

  if (showCheckout) {
    return (
      <CheckoutPage
        darkMode={darkMode}
        planType={selectedPlan}
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  // If user is already premium, show their current plan status
  if (isPremium) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.header}>
          <div className={styles.premiumBadge}>
            <Crown size={24} />
            <span>Pro Member</span>
          </div>
          <h1>You're a Pro! 🎉</h1>
          <p>Thank you for being a premium member. You have access to all Pro features.</p>
        </div>
        
        <div className={styles.currentPlanCard}>
          <div className={styles.planStatusHeader}>
            <div className={`${styles.planIcon} ${styles.pro}`}>
              <Zap size={32} />
            </div>
            <div>
              <h2>{currentPlanType === 'enterprise' ? 'Enterprise Plan' : 'Pro Plan'}</h2>
              <p>Active subscription</p>
            </div>
          </div>
          
          <div className={styles.benefitsList}>
            <h3>Your Premium Benefits:</h3>
            <ul>
              <li><Check size={18} /> Unlimited goals & habits</li>
              <li><Check size={18} /> Advanced analytics & insights</li>
              <li><Check size={18} /> Cloud sync across devices</li>
              <li><Check size={18} /> Custom emoji icons (100+)</li>
              <li><Check size={18} /> Custom themes & colors</li>
              <li><Check size={18} /> Export data (CSV, PDF)</li>
              <li><Check size={18} /> Priority support</li>
            </ul>
          </div>
          
          {currentPlanType !== 'enterprise' && (
            <div className={styles.upgradeSection}>
              <h3>Want more?</h3>
              <p>Upgrade to Enterprise for team collaboration and advanced features.</p>
              <button 
                className={styles.upgradeToEnterprise}
                onClick={() => handleUpgradeClick('enterprise')}
              >
                <Crown size={18} />
                Upgrade to Enterprise
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Crown size={18} />
          Premium Plans
        </div>
        <h1>Unlock Your Full Potential</h1>
        <p>Choose the perfect plan to supercharge your goal tracking and habit building journey</p>
      </div>

      {/* Pricing Grid */}
      <div className={styles.pricingGrid}>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
            
            <div className={`${styles.planIcon} ${styles[plan.icon]}`}>
              {plan.icon === 'free' && <Target size={24} />}
              {plan.icon === 'pro' && <Zap size={24} />}
              {plan.icon === 'enterprise' && <Crown size={24} />}
            </div>
            
            <h2 className={styles.planName}>{plan.name}</h2>
            <p className={styles.planDescription}>{plan.description}</p>
            
            <div className={styles.priceSection}>
              <span className={styles.price}>{plan.price}</span>
              <span className={styles.pricePeriod}>{plan.period}</span>
            </div>
            
            <ul className={styles.featureList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  {feature.included ? (
                    <Check className={`${styles.featureIcon} ${styles.included}`} />
                  ) : (
                    <X className={`${styles.featureIcon} ${styles.excluded}`} />
                  )}
                  <span style={{ opacity: feature.included ? 1 : 0.5 }}>{feature.text}</span>
                </li>
              ))}
            </ul>
            
            <button 
              className={`${styles.subscribeButton} ${styles[plan.buttonStyle]}`}
              onClick={() => {
                if (plan.name === 'Pro') handleUpgradeClick('pro');
                else if (plan.name === 'Enterprise') handleUpgradeClick('enterprise');
              }}
              disabled={plan.name === 'Free'}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Premium Features */}
      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Go Premium?</h2>
        <div className={styles.featuresGrid}>
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className={styles.featureCardIcon}>
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Money Back Guarantee */}
      <motion.div
        className={styles.guarantee}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Shield className={styles.guaranteeIcon} />
        <h3>30-Day Money-Back Guarantee</h3>
        <p>Try Premium risk-free. If you're not completely satisfied, we'll refund your payment.</p>
      </motion.div>
    </div>
  );
}
