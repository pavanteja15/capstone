import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./BusinessProfiles.css";

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
};

const BusinessProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [businesses, setBusinesses] = useState<BusinessProfile[]>([
    {
      id: 1,
      name: "Nike",
      username: "nike",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/one.jpg",
      category: "Sports & Fitness",
      description: "Just Do It. Official Nike Pinterest account for sports inspiration and athletic wear.",
      followers: 2500000,
      pins: 1250,
      website: "nike.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 2,
      name: "IKEA",
      username: "ikea",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/two.jpg",
      category: "Home & Decor",
      description: "Creating a better everyday life for everyone. Home furnishing ideas and inspiration.",
      followers: 1800000,
      pins: 3420,
      website: "ikea.com",
      isFollowing: true,
      verified: true
    },
    {
      id: 3,
      name: "Whole Foods Market",
      username: "wholefoods",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/three.jpg",
      category: "Food & Beverage",
      description: "America's Healthiest Grocery Store. Recipes, tips, and food inspiration.",
      followers: 950000,
      pins: 2890,
      website: "wholefoodsmarket.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 4,
      name: "Sephora",
      username: "sephora",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/four.jpg",
      category: "Beauty & Cosmetics",
      description: "The beauty authority. Makeup tutorials, skincare tips, and product inspiration.",
      followers: 3200000,
      pins: 4560,
      website: "sephora.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 5,
      name: "Etsy",
      username: "etsy",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/five.jpg",
      category: "Handmade & Crafts",
      description: "Find things you'll love. Handmade, vintage, and unique goods.",
      followers: 1450000,
      pins: 5670,
      website: "etsy.com",
      isFollowing: true,
      verified: true
    },
    {
      id: 6,
      name: "Airbnb",
      username: "airbnb",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/seven.jpg",
      category: "Travel & Hospitality",
      description: "Belong anywhere. Travel inspiration and unique stays around the world.",
      followers: 2100000,
      pins: 1890,
      website: "airbnb.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 7,
      name: "Lululemon",
      username: "lululemon",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/eight.jpg",
      category: "Sports & Fitness",
      description: "Technical athletic apparel for yoga, running, and training.",
      followers: 890000,
      pins: 1230,
      website: "lululemon.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 8,
      name: "West Elm",
      username: "westelm",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/nine.jpg",
      category: "Home & Decor",
      description: "Modern furniture and home decor. Sustainably sourced materials.",
      followers: 750000,
      pins: 2340,
      website: "westelm.com",
      isFollowing: true,
      verified: true
    },
    {
      id: 9,
      name: "Tasty",
      username: "buzzfeedtasty",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/one.jpg",
      category: "Food & Beverage",
      description: "Easy recipes and cooking videos. Food that brings people together.",
      followers: 4500000,
      pins: 8920,
      website: "tasty.co",
      isFollowing: false,
      verified: true
    },
    {
      id: 10,
      name: "Glossier",
      username: "glossier",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/two.jpg",
      category: "Beauty & Cosmetics",
      description: "Skin first. Makeup second. Smile always. Beauty essentials.",
      followers: 1200000,
      pins: 890,
      website: "glossier.com",
      isFollowing: false,
      verified: true
    },
    {
      id: 11,
      name: "Anthropologie",
      username: "anthropologie",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/three.jpg",
      category: "Fashion & Lifestyle",
      description: "Lifestyle brand offering clothing, accessories, and home decor.",
      followers: 980000,
      pins: 3450,
      website: "anthropologie.com",
      isFollowing: true,
      verified: true
    },
    {
      id: 12,
      name: "REI",
      username: "rei",
      avatar: "/assets/images/profilepic1.jpg",
      coverImage: "/assets/images/four.jpg",
      category: "Travel & Hospitality",
      description: "Life outdoors is a life well lived. Outdoor gear and adventure inspiration.",
      followers: 670000,
      pins: 2100,
      website: "rei.com",
      isFollowing: false,
      verified: true
    },
  ]);

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

  const handleFollowToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinesses(prev => prev.map(business => 
      business.id === id 
        ? { ...business, isFollowing: !business.isFollowing, followers: business.isFollowing ? business.followers - 1 : business.followers + 1 }
        : business
    ));
  };

  const handleBusinessClick = (business: BusinessProfile) => {
    navigate("/viewprofile", {
      state: {
        user: {
          id: business.id,
          name: business.name,
          username: business.username,
          avatar: business.avatar,
          bio: business.description,
          followers: business.followers,
          following: 50,
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

        {/* Business Cards Grid */}
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
                  onClick={(e) => handleFollowToggle(business.id, e)}
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
      </div>
    </div>
  );
};

export default BusinessProfiles;
