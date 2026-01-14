import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Zap,
  Check,
  Shield,
  CreditCard,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import styles from './CheckoutPage.module.css';

interface CheckoutPageProps {
  darkMode: boolean;
  planType: 'pro' | 'enterprise';
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

export default function CheckoutPage({ darkMode, planType, onBack, onSuccess }: CheckoutPageProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const errorRef = useRef<HTMLDivElement>(null);
  
  // Scroll to error message when error occurs
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const planDetails = {
    pro: {
      name: 'Pro Plan',
      price: 9.99,
      priceNGN: 15000, // NGN equivalent
      currency: 'USD',
      period: 'month',
      icon: Zap,
      color: '#3b82f6',
      features: [
        'Unlimited goals',
        'Unlimited habits',
        'Advanced analytics & insights',
        'Cloud sync across devices',
        'Custom emoji icons (100+)',
        'Custom themes & colors',
        'Export data (CSV, PDF)',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 29.99,
      priceNGN: 45000, // NGN equivalent
      currency: 'USD',
      period: 'month',
      icon: Crown,
      color: '#8b5cf6',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Shared goals & habits',
        'Admin dashboard',
        'Team analytics',
        'API access',
        'SSO integration',
        'Dedicated support'
      ]
    }
  };

  const plan = planDetails[planType];
  const PlanIcon = plan.icon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (planType === 'enterprise' && !formData.company) {
      setError('Company name is required for Enterprise plan');
      return false;
    }
    return true;
  };

  const initializePaystack = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Get Paystack public key - using PAYSTACK_KEY from env which maps to VITE_PAYSTACK_KEY
      // In Vite, env vars must be prefixed with VITE_ to be exposed to client
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_KEY || import.meta.env.PAYSTACK_KEY;

      console.log('Paystack key available:', !!paystackPublicKey);

      if (!paystackPublicKey) {
        throw new Error('Payment configuration is not available. The PAYSTACK_KEY environment variable needs to be set as VITE_PAYSTACK_KEY for browser access. Please contact support.');
      }

      // Check if Paystack is loaded
      if (!(window as any).PaystackPop) {
        throw new Error('Payment system is loading. Please try again in a moment.');
      }

      // Create a unique reference
      const reference = `lifetrack_${planType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Initialize Paystack popup - amount in kobo (smallest currency unit)
      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: formData.email,
        amount: plan.priceNGN * 100, // Convert to kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          phone: formData.phone,
          planType: planType,
          custom_fields: [
            {
              display_name: 'Plan',
              variable_name: 'plan',
              value: plan.name
            }
          ]
        },
        callback: function(response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          setStep('success');
          
          // Save premium status
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.isPremium = true;
          user.planType = planType;
          user.subscriptionRef = response.reference;
          user.subscriptionDate = new Date().toISOString();
          localStorage.setItem('user', JSON.stringify(user));
          
          setTimeout(() => {
            onSuccess();
          }, 2000);
        },
        onClose: function() {
          setLoading(false);
          setError('Payment was cancelled. Please try again when ready.');
        }
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handleContactSales = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setStep('processing');

    // Simulate sending contact request
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  if (step === 'success') {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={styles.successCard}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={styles.successIcon}
          >
            <CheckCircle2 size={64} />
          </motion.div>
          <h2>{planType === 'enterprise' ? 'Request Submitted!' : 'Payment Successful!'}</h2>
          <p>
            {planType === 'enterprise'
              ? 'Our sales team will contact you within 24 hours to discuss your enterprise needs.'
              : 'Welcome to LifeTrack Pro! Your premium features are now active.'}
          </p>
          <div className={styles.successFeatures}>
            <h4>You now have access to:</h4>
            <ul>
              {plan.features.slice(0, 4).map((feature, idx) => (
                <li key={idx}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Plans
      </button>

      <div className={styles.checkoutGrid}>
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.orderSummary}
        >
          <h2>Order Summary</h2>

          <div className={styles.planCard} style={{ borderColor: plan.color }}>
            <div className={styles.planHeader}>
              <div className={styles.planIcon} style={{ background: plan.color }}>
                <PlanIcon size={24} />
              </div>
              <div>
                <h3>{plan.name}</h3>
                <p>Billed monthly</p>
              </div>
            </div>

            <div className={styles.planPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{plan.price}</span>
              <span className={styles.period}>/{plan.period}</span>
            </div>

            <ul className={styles.planFeatures}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <Check size={16} style={{ color: plan.color }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${plan.price.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>${plan.price.toFixed(2)} USD</span>
            </div>
          </div>

          <div className={styles.securityBadges}>
            <div className={styles.badge}>
              <Shield size={16} />
              <span>Secure Payment</span>
            </div>
            <div className={styles.badge}>
              <Lock size={16} />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.paymentForm}
        >
          <h2>{planType === 'enterprise' ? 'Contact Information' : 'Payment Details'}</h2>
          <p className={styles.formSubtitle}>
            {planType === 'enterprise'
              ? 'Fill in your details and our sales team will reach out to you.'
              : 'Complete your purchase securely with Paystack.'}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                ref={errorRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.errorMessage}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={(e) => { e.preventDefault(); planType === 'enterprise' ? handleContactSales() : initializePaystack(); }}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {planType === 'enterprise' && (
              <>
                <div className={styles.formGroup}>
                  <label>Company Name</label>
                  <div className={styles.inputWrapper}>
                    <Building size={18} />
                    <input
                      type="text"
                      name="company"
                      placeholder="Your Company Inc."
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number (Optional)</label>
                  <div className={styles.inputWrapper}>
                    <Phone size={18} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {planType === 'pro' && (
              <div className={styles.paymentMethodSection}>
                <h3>Payment Method</h3>
                <div className={styles.paystackInfo}>
                  <CreditCard size={24} />
                  <div>
                    <span>Secure payment via Paystack</span>
                    <p>We accept cards, bank transfers, and more.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              style={{ background: plan.color }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className={styles.spinner} />
                  {planType === 'enterprise' ? 'Submitting...' : 'Processing...'}
                </>
              ) : (
                <>
                  {planType === 'enterprise' ? (
                    <>
                      <Mail size={20} />
                      Contact Sales
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay ${plan.price.toFixed(2)}
                    </>
                  )}
                </>
              )}
            </button>

            <p className={styles.termsText}>
              By proceeding, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <div className={styles.guaranteeSection}>
            <Shield size={20} />
            <div>
              <strong>30-Day Money-Back Guarantee</strong>
              <p>Not satisfied? Get a full refund within 30 days.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
