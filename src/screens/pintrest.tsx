import React, { useState, useEffect } from 'react';
import './pintrest.css';
import SignupSection from '../components/auth/SignupSection';

type AuthMode = 'signup' | 'login';

// 1. Define Data Structure
interface SlideData {
  title: string;
  color: string; // The text color
  images: string[]; // 4 images per slide
}

// 2. Mock Data (Replicating the Video: DIY, Chai Time, Outfit, etc.)
const slides: SlideData[] = [
  {
    title: "DIY idea",
    color: "#407a57", // Greenish
    images: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1498993386900-3f86162a8d44?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1528696135012-6238b97d8c0b?auto=format&fit=crop&w=400&q=80",
    ]
  },
  {
    title: "chai time snacks idea",
    color: "#c28b00", // Yellow/Gold
    images: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80", // Samosa/Snack
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80", // Tea
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80", // Indian snack
      "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80", // Biscuits
    ]
  },
  {
    title: "outfit idea",
    color: "#0076d3", // Blue
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1550614000-4b9519e02a48?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
    ]
  },
  {
    title: "home decor idea",
    color: "#4a4a4a", // Teal/Dark
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=400&q=80",
    ]
  }
];

const PinterestHero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  const scrollToAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Cycle through slides every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pinterest-page">
    <div className="hero-section">
      {/* Navbar */}
      <nav className="pinterest-nav">
        <div className="nav-left">
          <a className="brand-logo" href="#">
            <svg height="24" width="24" viewBox="0 0 24 24" aria-label="Pinterest" role="img">
              <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.557-.99 3.978-.281 1.189.597 2.159 1.769 2.159 2.123 0 3.756-2.239 3.756-5.471 0-2.861-2.056-4.86-4.991-4.86-3.398 0-5.393 2.549-5.393 5.184 0 1.027.395 2.127.894 2.741a.361.361 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12" fill="#e60023"/>
            </svg>
            <span className="brand-name">Pinterest</span>
          </a>
          <a href="#" className="nav-explore">Explore</a>
        </div>
        
        <div className="nav-right">
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Businesses</a>
          <a href="#" className="nav-link">Create</a>
          <a href="#" className="nav-link">News</a>
          <button className="btn-login" onClick={() => scrollToAuth('login')}>Log in</button>
          <button className="btn-signup" onClick={() => scrollToAuth('signup')}>Sign up</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Heading */}
        <div className="heading-wrapper">
          <div className="heading-static">Get your next</div>
          <div className="heading-dynamic-wrapper">
            <div 
              className="heading-dynamic-list" 
              style={{ transform: `translateY(-${currentIndex * 72}px)` }}
            >
              {slides.map((slide, index) => (
                <div 
                  key={index} 
                  className="heading-dynamic-item" 
                  style={{ color: slide.color }}
                >
                  {slide.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="dots-container">
          {slides.map((_, index) => (
            <div 
              key={index}
              className="dot"
              onClick={() => setCurrentIndex(index)} 
              style={{ backgroundColor: index === currentIndex ? slides[currentIndex].color : '#ddd' }}
            />
          ))}
        </div>
      </div>

      {/* Image Grid - U Shape */}
      <div className="image-grid-wrapper">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`image-grid ${index === currentIndex ? 'active' : ''}`}
          >
            {/* Column 1 - Left edge */}
            <div className="image-column">
              <img src={slide.images[0]} alt="" className="pin-card" />
              <img src={slide.images[1]} alt="" className="pin-card" />
            </div>
            
            {/* Column 2 */}
            <div className="image-column">
              <img src={slide.images[2]} alt="" className="pin-card" />
              <img src={slide.images[3]} alt="" className="pin-card" />
            </div>
            
            {/* Column 3 */}
            <div className="image-column">
              <img src={slide.images[1]} alt="" className="pin-card" />
              <img src={slide.images[0]} alt="" className="pin-card" />
            </div>
            
            {/* Column 4 - Center (lowest) */}
            <div className="image-column">
              <img src={slide.images[3]} alt="" className="pin-card" />
              <img src={slide.images[2]} alt="" className="pin-card" />
            </div>
            
            {/* Column 5 */}
            <div className="image-column">
              <img src={slide.images[0]} alt="" className="pin-card" />
              <img src={slide.images[1]} alt="" className="pin-card" />
            </div>
            
            {/* Column 6 */}
            <div className="image-column">
              <img src={slide.images[2]} alt="" className="pin-card" />
              <img src={slide.images[3]} alt="" className="pin-card" />
            </div>
            
            {/* Column 7 - Right edge */}
            <div className="image-column">
              <img src={slide.images[1]} alt="" className="pin-card" />
              <img src={slide.images[0]} alt="" className="pin-card" />
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" style={{ backgroundColor: slides[currentIndex].color }}>
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"/>
        </svg>
      </div>
    </div>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-images">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" 
            alt="Food" 
            className="search-img search-img-1" 
          />
          <div className="search-img search-img-2"></div>
          <img 
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80" 
            alt="Food" 
            className="search-img search-img-3" 
          />
          <img 
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80" 
            alt="Food" 

            className="search-img search-img-4" 
          />
          <img 
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80" 
            alt="Food" 
            className="search-img search-img-5" 
          />
          <img 
            src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=400&q=80" 
            alt="Food" 
            className="search-img search-img-6" 
          />
          <div className="search-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
            </svg>
            <span>easy chicken dinner</span>
          </div>
        </div>
        
        <div className="search-content">
          <h2>Search for an idea</h2>
          <p>
            What do you want to try next? Think of something you're into—like 
            "easy chicken dinner"—and see what you find.
          </p>
          <button className="btn-explore">Explore</button>
        </div>
      </section>

      {/* Save Ideas Section */}
      <section className="save-section">
        <div className="save-content">
          <h2>Save ideas you like</h2>
          <p>
            Collect your favorites so you can
            get back to them later.
          </p>
          <button className="btn-explore">Explore</button>
        </div>
        
        <div className="save-boards">
          {/* Main large board */}
          <div className="board board-main">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" 
              alt="Home decor" 
              className="board-bg"
            />
            <div className="board-overlay">
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80" 
                alt="" 
                className="board-thumb board-thumb-1"
              />
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80" 
                alt="" 
                className="board-thumb board-thumb-2"
              />
            </div>
            <span className="board-label">Fern future home vibes</span>
          </div>
          
          {/* Right side boards */}
          <div className="board board-sm board-1">
            <img 
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80" 
              alt="Bedroom" 
            />
            <span className="board-label">My Scandinavian bedroom</span>
          </div>
          
          <div className="board board-sm board-2">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80" 
              alt="Deck" 
            />
            <span className="board-label">The deck of my dreams</span>
          </div>
          
          {/* Bottom boards */}
          <div className="board board-sm board-3">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=300&q=80" 
              alt="Drinks" 
            />
            <span className="board-label">Serve my drinks in style</span>
          </div>
          
          <div className="board board-sm board-4">
            <img 
              src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=300&q=80" 
              alt="Bathroom" 
            />
            <span className="board-label">Our bathroom</span>
          </div>
        </div>
      </section>

      {/* See It Make It Section */}
      <section className="seeit-section">
        <div className="seeit-image">
          <img 
            src="https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=80" 
            alt="Woman with creative makeup" 
            className="seeit-bg"
          />
          <div className="seeit-phone">
            <div className="phone-header">
              <span className="phone-back">&lt;</span>
              <span className="phone-dots">•••</span>
            </div>
            <div className="phone-content">
              <h3>How to find the perfect lip shade for any occasion</h3>
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80" 
                alt="Makeup tutorial" 
              />
            </div>
            <div className="phone-creator">
              <div className="creator-avatar"></div>
              <div className="creator-info">
                <span className="creator-name">Scout the City</span>
                <span className="creator-followers">56.7k followers</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="seeit-content">
          <h2>See it, make it,<br/>try it, do it</h2>
          <p>
            The best part of Pinterest is
            discovering new things and ideas
            from people around the world.
          </p>
          <button className="btn-explore">Explore</button>
        </div>
      </section>

      {/* Signup Section */}
      <SignupSection initialMode={authMode} />
    </div>
  );
};

export default PinterestHero;