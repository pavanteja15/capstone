import React from 'react';
import './SignupSection.css';

const SignupSection: React.FC = () => {
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

        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input type="password" id="password" placeholder="Create a password" />
              <button type="button" className="toggle-password">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#767676">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span className="password-hint">Use 8 or more letters, numbers and symbols</span>
          </div>

          <div className="form-group">
            <label htmlFor="birthdate">
              Birthdate
              <span className="info-icon">ⓘ</span>
            </label>
            <input type="date" id="birthdate" placeholder="dd-mm-yyyy" />
          </div>

          <button type="submit" className="btn-continue">Continue</button>

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

        <button className="btn-business">Create a free business account</button>
      </div>
    </section>
  );
};

export default SignupSection;
