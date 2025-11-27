import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Validator from '../../Validator';
import './SignupSection.css';

type AccountType = 'NORMAL' | 'BUSINESS';
type StepType = 'BASIC_INFO' | 'PROFILE_SECURITY' | 'BUSINESS';

interface UserState {
  email: string;
  userName: string;
  password: string;
  conformPassword: string;
  fullName: string;
  mobile: string;
  bio: string;
  accountType: AccountType;
  businessName?: string;
  websiteUrl?: string;
}

interface UserErrorState {
  userNameError: string;
  emailError: string;
  passwordError: string;
  mobileError: string;
  fullNameError: string;
}

const initialState: UserState = {
  email: '',
  userName: '',
  password: '',
  conformPassword: '',
  fullName: '',
  mobile: '',
  bio: '',
  accountType: 'NORMAL',
  businessName: '',
  websiteUrl: ''
};

const stepLabels: Record<StepType, string> = {
  BASIC_INFO: 'Account info',
  PROFILE_SECURITY: 'Profile & security',
  BUSINESS: 'Business details'
};

const baseSteps: StepType[] = ['BASIC_INFO', 'PROFILE_SECURITY'];

const SignupSection: React.FC = () => {
  const [state, setState] = useState<UserState>(initialState);
  const [formErrors, setFormErrors] = useState<UserErrorState>({
    userNameError: '',
    passwordError: '',
    emailError: '',
    mobileError: '',
    fullNameError: ''
  });
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [step, setStep] = useState<StepType>('BASIC_INFO');
  const [submitting, setSubmitting] = useState(false);

  const isBusinessFlow = state.accountType === 'BUSINESS';
  const steps = useMemo<StepType[]>(() => (isBusinessFlow ? [...baseSteps, 'BUSINESS'] : baseSteps), [isBusinessFlow]);
  const currentStepIndex = steps.indexOf(step);

  useEffect(() => {
    if (state.conformPassword && state.password !== state.conformPassword) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  }, [state.password, state.conformPassword]);

  useEffect(() => {
    if (!isBusinessFlow && step === 'BUSINESS') {
      setStep('PROFILE_SECURITY');
    }
  }, [isBusinessFlow, step]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setState((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'accountType') {
      setStep('BASIC_INFO');
    }

    validateField(name, value);
  };

  const validateField = (name: string, value: string): void => {
    setFormErrors((prev) => {
      const errors = { ...prev };
      switch (name) {
        case 'userName':
          errors.userNameError = Validator.validateUserName(value) ? '' : 'Enter a valid username';
          break;
        case 'password':
          errors.passwordError = Validator.validatePassword(value) ? '' : 'Enter a valid password';
          break;
        case 'mobile':
          errors.mobileError = Validator.validateMobile(value) ? '' : 'Enter a valid mobile number';
          break;
        case 'email':
          errors.emailError = Validator.validateEmail(value) ? '' : 'Enter a valid email';
          break;
        case 'fullName':
          errors.fullNameError = Validator.validateFullName(value) ? '' : 'Enter a valid name';
          break;
        default:
          break;
      }
      return errors;
    });
  };

  const basicInfoValid = useMemo(() => {
    const hasValues = state.email.trim() && state.userName.trim() && state.fullName.trim();
    const hasErrors =
      !!formErrors.emailError || !!formErrors.userNameError || !!formErrors.fullNameError;
    return Boolean(hasValues) && !hasErrors;
  }, [state.email, state.userName, state.fullName, formErrors.emailError, formErrors.userNameError, formErrors.fullNameError]);

  const profileSecurityValid = useMemo(() => {
    const hasValues = state.mobile.trim() && state.password.trim() && state.conformPassword.trim();
    const hasErrors =
      !!formErrors.mobileError || !!formErrors.passwordError || !!passwordMatchError;
    return Boolean(hasValues) && !hasErrors;
  }, [state.mobile, state.password, state.conformPassword, formErrors.mobileError, formErrors.passwordError, passwordMatchError]);

  const businessStepValid = useMemo(() => {
    if (!isBusinessFlow) {
      return true;
    }
    return Boolean(state.businessName?.trim() && state.websiteUrl?.trim());
  }, [isBusinessFlow, state.businessName, state.websiteUrl]);

  const isStepValid = (stepType: StepType) => {
    switch (stepType) {
      case 'BASIC_INFO':
        return basicInfoValid;
      case 'PROFILE_SECURITY':
        return profileSecurityValid;
      case 'BUSINESS':
        return businessStepValid;
      default:
        return false;
    }
  };

  const allStepsValid = steps.every((stepType: StepType) => isStepValid(stepType));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isStepValid(step)) {
      return;
    }

    const isLastStep = currentStepIndex === steps.length - 1;

    if (!isLastStep) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        setStep(nextStep);
      }
      return;
    }

    if (!allStepsValid) {
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:8765/auth/registeruser', state);
      alert('Registered successfully');
      setState(initialState);
      setStep('BASIC_INFO');
    } catch (err) {
      alert('Failed to register');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      if (previousStep) {
        setStep(previousStep);
      }
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const primaryButtonLabel = submitting ? 'Registering...' : isLastStep ? 'Register' : 'Next';
  const isPrimaryDisabled = submitting || !isStepValid(step);

  return (
    <section className="signup-section">
      {/* Background Image Grid */}
      <div className="signup-bg-grid">
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1482049016gy-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
        <div className="signup-col">
          <img src="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=300&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80" alt="" />
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="signup-overlay"></div>

      {/* Scroll Up Button */}
      <button className="scroll-up-btn">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M7.707 14.707 12 10.414l4.293 4.293 1.414-1.414L12 7.586l-5.707 5.707z"/>
        </svg>
      </button>

      {/* Left Text */}
      <div className="signup-text">
        <h2>Sign up to get<br/>your ideas</h2>
      </div>

      {/* Signup Form Card */}
      <div className="signup-card">
        <h3>Welcome to Pinterest</h3>
        <p className="signup-subtitle">Find new ideas to try</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-stepper">
            {steps.map((stepName: StepType) => (
              <span key={stepName} className={step === stepName ? 'active' : ''}>
                {stepLabels[stepName]}
              </span>
            ))}
          </div>

          {step === 'BASIC_INFO' && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={state.email}
                  onChange={handleChange}
                />
                {formErrors.emailError && <span className="error-text">{formErrors.emailError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="userName">Username</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="Pick a username"
                  value={state.userName}
                  onChange={handleChange}
                />
                {formErrors.userNameError && <span className="error-text">{formErrors.userNameError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={state.fullName}
                  onChange={handleChange}
                />
                {formErrors.fullNameError && <span className="error-text">{formErrors.fullNameError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="accountType">Account type</label>
                <select id="accountType" name="accountType" value={state.accountType} onChange={handleChange}>
                  <option value="NORMAL">Personal</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
            </>
          )}

          {step === 'PROFILE_SECURITY' && (
            <>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell people about yourself"
                  value={state.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={state.mobile}
                  onChange={handleChange}
                />
                {formErrors.mobileError && <span className="error-text">{formErrors.mobileError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={state.password}
                  onChange={handleChange}
                />
                {formErrors.passwordError && <span className="error-text">{formErrors.passwordError}</span>}
                <span className="password-hint">Use 8 or more letters, numbers and symbols</span>
              </div>

              <div className="form-group">
                <label htmlFor="conformPassword">Confirm password</label>
                <input
                  type="password"
                  id="conformPassword"
                  name="conformPassword"
                  placeholder="Re-enter your password"
                  value={state.conformPassword}
                  onChange={handleChange}
                />
                {passwordMatchError && <span className="error-text">{passwordMatchError}</span>}
              </div>
            </>
          )}

          {isBusinessFlow && step === 'BUSINESS' && (
            <>
              <div className="form-group">
                <label htmlFor="businessName">Business name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="Enter your business name"
                  value={state.businessName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="websiteUrl">Website</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  placeholder="https://your-company.com"
                  value={state.websiteUrl}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {currentStepIndex > 0 && (
            <div className="step-actions">
              <button type="button" className="btn-secondary" onClick={handleGoBack}>
                Back
              </button>
            </div>
          )}

          <button type="submit" className="btn-continue" disabled={isPrimaryDisabled}>
            {primaryButtonLabel}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="terms">
            By continuing, you agree to Pinterest's <a href="#">Terms of Service</a> and acknowledge you've read our <a href="#">Privacy Policy</a>. <a href="#">Notice at collection</a>.
          </p>

          <p className="login-link">
            Already a member? <a href="#">Log in</a>
          </p>
        </form>

        <button
          type="button"
          className="btn-business"
          onClick={() => {
            setState((prev) => ({
              ...prev,
              accountType: 'BUSINESS'
            }));
            setStep('BASIC_INFO');
          }}
        >
          Create a free business account
        </button>
      </div>
    </section>
  );
};

export default SignupSection;
