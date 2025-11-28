import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import { useAppSelector } from "../store/hooks";
import { mapMediaPath } from "../utils/userMapper";
import "./BusinessProfiles.css";

const API_BASE_URL = "http://localhost:8765";
const FALLBACK_AVATAR = "/assets/images/profilepic1.jpg";
const FALLBACK_COVER = "/assets/images/one.jpg";

type BusinessProfile = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  category: string;
  description: string;
  followers: number;
  pins: number;
  website: string;
  isFollowing: boolean;
  verified: boolean;
  ownerId: number;
};

const BusinessProfiles: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const userId = user.userId;
  
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());

  // Fetch business profiles from API
  useEffect(() => {
    const fetchBusinessProfiles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/business`);
        const data = response.data ?? [];
        
        const mapped: BusinessProfile[] = data
          .filter((bp: any) => bp.ownerId !== userId) // Exclude current user's business profile
          .map((bp: any) => ({
          id: bp.businessProfileId,
          name: bp.businessName || bp.ownerFullName || "Business",
          username: bp.ownerUsername || bp.ownerFullName?.toLowerCase().replace(/\s+/g, '') || "business",
          avatar: mapMediaPath(bp.ownerProfilePicUrl, API_BASE_URL) || FALLBACK_AVATAR,
          coverImage: mapMediaPath(bp.coverImageUrl, API_BASE_URL) || FALLBACK_COVER,
          category: bp.category || "General",
          description: bp.description || "",
          followers: bp.followerCount ?? 0,
          pins: bp.totalPins ?? 0,
          website: bp.websiteUrl || "",
          isFollowing: false,
          verified: bp.verified ?? false,
          ownerId: bp.ownerId
        }));
        
        setBusinesses(mapped);
        
        // If user is logged in, check which businesses they follow
        if (userId) {
          try {
            const followingRes = await axios.get(`${API_BASE_URL}/follow/${userId}/following`);
            const followingList = followingRes.data ?? [];
            const followingSet = new Set<number>(followingList.map((f: any) => f.id));
            setFollowingIds(followingSet);
            
            // Update isFollowing for each business
            setBusinesses(prev => prev.map(b => ({
              ...b,
              isFollowing: followingSet.has(b.ownerId)
            })));
          } catch (err) {
            console.error("Error fetching following list:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching business profiles:", err);
        setError("Failed to load business profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfiles();
  }, [userId]);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Sports & Fitness', label: 'Sports & Fitness' },
    { key: 'Home & Decor', label: 'Home & Decor' },
    { key: 'Food & Beverage', label: 'Food & Beverage' },
    { key: 'Beauty & Cosmetics', label: 'Beauty & Cosmetics' },
    { key: 'Travel & Hospitality', label: 'Travel & Hospitality' },
    { key: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
    { key: 'Handmade & Crafts', label: 'Handmade & Crafts' },
  ];

  const filteredBusinesses = activeCategory === 'all' 
    ? businesses 
    : businesses.filter(b => b.category === activeCategory);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleFollowToggle = async (business: BusinessProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      alert("Please login to follow businesses");
      navigate("/login");
      return;
    }
    
    try {
      if (business.isFollowing) {
        // Unfollow
        await axios.delete(`${API_BASE_URL}/follow/${userId}/unfollow/${business.ownerId}`);
        setBusinesses(prev => prev.map(b => 
          b.id === business.id 
            ? { ...b, isFollowing: false, followers: b.followers - 1 }
            : b
        ));
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(business.ownerId);
          return newSet;
        });
      } else {
        // Follow
        await axios.post(`${API_BASE_URL}/follow/${userId}/follow/${business.ownerId}`);
        setBusinesses(prev => prev.map(b => 
          b.id === business.id 
            ? { ...b, isFollowing: true, followers: b.followers + 1 }
            : b
        ));
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.add(business.ownerId);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleBusinessClick = (business: BusinessProfile) => {
    navigate("/viewprofile", {
      state: {
        user: {
          id: business.ownerId,
          name: business.name,
          username: business.username,
          avatar: business.avatar,
          bio: business.description,
          followers: business.followers,
          following: 0,
          isFollowing: business.isFollowing
        }
      }
    });
  };

  return (
    <div className="business-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="business-content">
        {/* Header */}
        <div className="business-header">
          <h1 className="business-title">Business Profiles</h1>
          <p className="business-subtitle">Discover and follow your favorite brands</p>
        </div>

        {/* Category Filters */}
        <div className="business-categories">
          {categories.map(category => (
            <button
              key={category.key}
              className={`business-category-btn ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="business-loading">
            <p>Loading business profiles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="business-error">
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBusinesses.length === 0 && (
          <div className="business-empty">
            <p>No business profiles found{activeCategory !== 'all' ? ` in ${activeCategory}` : ''}</p>
          </div>
        )}

        {/* Business Cards Grid */}
        {!loading && !error && filteredBusinesses.length > 0 && (
          <div className="business-grid">
            {filteredBusinesses.map(business => (
              <div 
                key={business.id} 
                className="business-card"
                onClick={() => handleBusinessClick(business)}
              >
                {/* Cover Image */}
                <div className="business-card-cover">
                  <img src={business.coverImage} alt={business.name} />
                </div>

                {/* Profile Section */}
                <div className="business-card-profile">
                  <div className="business-card-avatar-wrapper">
                    <img src={business.avatar} alt={business.name} className="business-card-avatar" />
                    {business.verified && (
                      <div className="business-verified-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0076D3">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="business-card-info">
                  <div className="business-card-name-row">
                    <h3 className="business-card-name">{business.name}</h3>
                  </div>
                  <p className="business-card-username">@{business.username}</p>
                  <span className="business-card-category">{business.category}</span>
                  <p className="business-card-description">{business.description}</p>

                  {/* Stats */}
                  <div className="business-card-stats">
                    <div className="business-stat">
                      <span className="stat-value">{formatCount(business.followers)}</span>
                      <span className="stat-label">followers</span>
                    </div>
                    <div className="business-stat">
                      <span className="stat-value">{formatCount(business.pins)}</span>
                      <span className="stat-label">pins</span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button 
                    className={`business-follow-btn ${business.isFollowing ? 'following' : ''}`}
                    onClick={(e) => handleFollowToggle(business, e)}
                  >
                    {business.isFollowing ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Following
                      </>
                    ) : (
                      'Follow'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfiles;
