import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./Sponsored.css";

type SponsoredPin = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string | null;
  userId: number;
  userName: string;
  userFullname: string;
  userProfilePath: string;
  businessName: string | null;
  websiteUrl: string | null;
  category: string | null;
  boardId: number | null;
  boardTitle: string | null;
};

const Sponsored: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [pins, setPins] = useState<SponsoredPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSponsoredPins();
  }, []);

  const fetchSponsoredPins = async () => {
    try {
      setLoading(true);
      const response = await axios.get<SponsoredPin[]>("http://localhost:8765/pins/sponsored");
      setPins(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching sponsored pins:", err);
      setError("Failed to load sponsored pins");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from pins
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    pins.forEach(pin => {
      if (pin.category) {
        uniqueCategories.add(pin.category);
      }
    });
    return [
      { key: 'all', label: 'All' },
      ...Array.from(uniqueCategories).map(cat => ({ key: cat, label: cat }))
    ];
  }, [pins]);

  const filteredPins = activeCategory === 'all' 
    ? pins 
    : pins.filter(pin => pin.category === activeCategory);

  const handlePinClick = (pin: SponsoredPin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          id: pin.id,
          image: pin.imageUrl,
          video: pin.videoUrl,
          title: pin.title,
          description: pin.description,
          userName: pin.businessName || pin.userName,
          userProfile: pin.userProfilePath
        }
      }
    });
  };

  const handleBusinessClick = (pin: SponsoredPin, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pin.websiteUrl) {
      window.open(pin.websiteUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/viewprofile/${pin.userId}`);
    }
  };

  const handleVisitWebsite = (websiteUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const getMediaUrl = (pin: SponsoredPin): string => {
    const url = pin.videoUrl || pin.imageUrl;
    if (!url) return '/assets/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `http://localhost:8765${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const isVideo = (pin: SponsoredPin): boolean => {
    return !!pin.videoUrl;
  };

  return (
    <div className="sponsored-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="sponsored-content">
        {/* Header */}
        <div className="sponsored-header">
          <div className="sponsored-header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#e60023">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
          </div>
          <h1 className="sponsored-title">Sponsored Pins</h1>
          <p className="sponsored-subtitle">Promoted content from business accounts</p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="sponsored-categories">
            {categories.map(category => (
              <button
                key={category.key}
                className={`sponsored-category-btn ${activeCategory === category.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="sponsored-loading">
            <div className="sponsored-spinner"></div>
            <p>Loading sponsored pins...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="sponsored-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#e60023">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{error}</p>
            <button onClick={fetchSponsoredPins} className="sponsored-retry-btn">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPins.length === 0 && (
          <div className="sponsored-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#767676">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            <h3>No sponsored pins yet</h3>
            <p>Pins from business accounts will appear here</p>
          </div>
        )}

        {/* Sponsored Pins Grid */}
        {!loading && !error && filteredPins.length > 0 && (
          <div className="sponsored-pins-masonry">
            {filteredPins.map(pin => (
              <div 
                key={pin.id} 
                className="sponsored-pin-card"
                onClick={() => handlePinClick(pin)}
              >
                {/* Sponsored Badge */}
                <div className="sponsored-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                  Sponsored
                </div>

                {/* Pin Media */}
                {isVideo(pin) ? (
                  <video 
                    src={getMediaUrl(pin)} 
                    className="sponsored-pin-image"
                    muted
                    loop
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  />
                ) : (
                  <img src={getMediaUrl(pin)} alt={pin.title} className="sponsored-pin-image" />
                )}

                {/* Overlay */}
                <div className="sponsored-pin-overlay">
                  <button className="sponsored-pin-save-btn" onClick={(e) => e.stopPropagation()}>
                    Save
                  </button>
                </div>

                {/* Pin Info */}
                <div className="sponsored-pin-info">
                  {pin.title && <h3 className="sponsored-pin-title">{pin.title}</h3>}
                  {pin.description && <p className="sponsored-pin-description">{pin.description}</p>}

                  {/* Business Info */}
                  <div 
                    className="sponsored-business-info"
                    onClick={(e) => handleBusinessClick(pin, e)}
                  >
                    {pin.userProfilePath && (
                      <img 
                        src={pin.userProfilePath.startsWith('http') ? pin.userProfilePath : `http://localhost:8765${pin.userProfilePath}`} 
                        alt={pin.businessName || pin.userName} 
                        className="sponsored-business-avatar" 
                      />
                    )}
                    <div className="sponsored-business-details">
                      <span className="sponsored-business-name">
                        {pin.businessName || pin.userName}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0076D3">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </span>
                      {pin.category && (
                        <span className="sponsored-business-category">{pin.category}</span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {pin.websiteUrl && (
                    <button 
                      className="sponsored-cta-btn"
                      onClick={(e) => handleVisitWebsite(pin.websiteUrl!, e)}
                    >
                      Visit Website
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsored;
