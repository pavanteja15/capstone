import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./Sponsored.css";

type SponsoredPin = {
  id: number;
  img: string;
  title: string;
  description: string;
  businessName: string;
  businessUsername: string;
  businessAvatar: string;
  businessVerified: boolean;
  category: string;
  cta: string;
  ctaLink: string;
  impressions: number;
  clicks: number;
  saves: number;
};

const Sponsored: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const sponsoredPins: SponsoredPin[] = [
    {
      id: 1,
      img: "/assets/images/one.jpg",
      title: "New Air Max Collection",
      description: "Discover the latest Nike Air Max shoes. Comfort meets style in every step.",
      businessName: "Nike",
      businessUsername: "nike",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Sports & Fitness",
      cta: "Shop Now",
      ctaLink: "https://nike.com",
      impressions: 125000,
      clicks: 8500,
      saves: 3200
    },
    {
      id: 2,
      img: "/assets/images/two.jpg",
      title: "Transform Your Living Room",
      description: "Scandinavian design meets modern comfort. Explore our furniture collection.",
      businessName: "IKEA",
      businessUsername: "ikea",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Home & Decor",
      cta: "Explore",
      ctaLink: "https://ikea.com",
      impressions: 98000,
      clicks: 6200,
      saves: 4100
    },
    {
      id: 3,
      img: "/assets/images/three.jpg",
      title: "Summer Beauty Essentials",
      description: "Get ready for summer with our curated beauty collection. SPF, glow, and more.",
      businessName: "Sephora",
      businessUsername: "sephora",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Beauty & Cosmetics",
      cta: "Shop Now",
      ctaLink: "https://sephora.com",
      impressions: 156000,
      clicks: 12400,
      saves: 5600
    },
    {
      id: 4,
      img: "/assets/images/four.jpg",
      title: "Organic & Fresh Produce",
      description: "Farm to table freshness. Discover our organic produce selection.",
      businessName: "Whole Foods Market",
      businessUsername: "wholefoods",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Food & Beverage",
      cta: "Find a Store",
      ctaLink: "https://wholefoodsmarket.com",
      impressions: 67000,
      clicks: 4300,
      saves: 2100
    },
    {
      id: 5,
      img: "/assets/images/five.jpg",
      title: "Handcrafted Jewelry Collection",
      description: "Unique, handmade jewelry from independent artisans around the world.",
      businessName: "Etsy",
      businessUsername: "etsy",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Handmade & Crafts",
      cta: "Discover",
      ctaLink: "https://etsy.com",
      impressions: 89000,
      clicks: 7100,
      saves: 4800
    },
    {
      id: 6,
      img: "/assets/images/seven.jpg",
      title: "Unique Stays Await",
      description: "From treehouses to castles, find your next unforgettable stay.",
      businessName: "Airbnb",
      businessUsername: "airbnb",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Travel & Hospitality",
      cta: "Book Now",
      ctaLink: "https://airbnb.com",
      impressions: 203000,
      clicks: 15600,
      saves: 8900
    },
    {
      id: 7,
      img: "/assets/images/eight.jpg",
      title: "Yoga Collection 2024",
      description: "Feel the flow. New yoga essentials designed for comfort and flexibility.",
      businessName: "Lululemon",
      businessUsername: "lululemon",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Sports & Fitness",
      cta: "Shop Now",
      ctaLink: "https://lululemon.com",
      impressions: 78000,
      clicks: 5400,
      saves: 3100
    },
    {
      id: 8,
      img: "/assets/images/nine.jpg",
      title: "Modern Bedroom Makeover",
      description: "Create your dream bedroom with our curated collection of modern furniture.",
      businessName: "West Elm",
      businessUsername: "westelm",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Home & Decor",
      cta: "Shop Now",
      ctaLink: "https://westelm.com",
      impressions: 54000,
      clicks: 3800,
      saves: 2400
    },
    {
      id: 9,
      img: "/assets/images/one.jpg",
      title: "5-Minute Breakfast Ideas",
      description: "Quick, delicious breakfast recipes to start your day right.",
      businessName: "Tasty",
      businessUsername: "buzzfeedtasty",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Food & Beverage",
      cta: "See Recipe",
      ctaLink: "https://tasty.co",
      impressions: 312000,
      clicks: 28500,
      saves: 15200
    },
    {
      id: 10,
      img: "/assets/images/two.jpg",
      title: "The Perfect Everyday Look",
      description: "Minimal makeup, maximum impact. Discover our bestsellers.",
      businessName: "Glossier",
      businessUsername: "glossier",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Beauty & Cosmetics",
      cta: "Shop Now",
      ctaLink: "https://glossier.com",
      impressions: 145000,
      clicks: 11200,
      saves: 6700
    },
    {
      id: 11,
      img: "/assets/images/three.jpg",
      title: "Fall Fashion Preview",
      description: "Get a first look at our fall collection. Cozy meets chic.",
      businessName: "Anthropologie",
      businessUsername: "anthropologie",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Fashion & Lifestyle",
      cta: "Preview",
      ctaLink: "https://anthropologie.com",
      impressions: 92000,
      clicks: 6800,
      saves: 4200
    },
    {
      id: 12,
      img: "/assets/images/four.jpg",
      title: "Gear Up for Adventure",
      description: "Everything you need for your next outdoor adventure. Quality gear, fair prices.",
      businessName: "REI",
      businessUsername: "rei",
      businessAvatar: "/assets/images/profilepic1.jpg",
      businessVerified: true,
      category: "Travel & Hospitality",
      cta: "Shop Gear",
      ctaLink: "https://rei.com",
      impressions: 67000,
      clicks: 4900,
      saves: 2800
    },
  ];

  const categories = [
    { key: 'all', label: 'All Ads' },
    { key: 'Sports & Fitness', label: 'Sports & Fitness' },
    { key: 'Home & Decor', label: 'Home & Decor' },
    { key: 'Food & Beverage', label: 'Food & Beverage' },
    { key: 'Beauty & Cosmetics', label: 'Beauty & Cosmetics' },
    { key: 'Travel & Hospitality', label: 'Travel & Hospitality' },
    { key: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
    { key: 'Handmade & Crafts', label: 'Handmade & Crafts' },
  ];

  const filteredPins = activeCategory === 'all' 
    ? sponsoredPins 
    : sponsoredPins.filter(pin => pin.category === activeCategory);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handlePinClick = (pin: SponsoredPin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.img,
          title: pin.title,
          description: pin.description,
          likes: pin.saves,
          userName: pin.businessName,
          userProfile: pin.businessAvatar
        }
      }
    });
  };

  const handleBusinessClick = (pin: SponsoredPin, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/viewprofile", {
      state: {
        user: {
          id: pin.id,
          name: pin.businessName,
          username: pin.businessUsername,
          avatar: pin.businessAvatar,
          bio: `Official ${pin.businessName} Pinterest account`,
          followers: Math.floor(Math.random() * 2000000) + 500000,
          following: 50,
          isFollowing: false
        }
      }
    });
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
          <p className="sponsored-subtitle">Promoted content from businesses you might like</p>
        </div>

        {/* Category Filters */}
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

        {/* Sponsored Pins Grid */}
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

              {/* Pin Image */}
              <img src={pin.img} alt={pin.title} className="sponsored-pin-image" />

              {/* Overlay */}
              <div className="sponsored-pin-overlay">
                <button className="sponsored-pin-save-btn" onClick={(e) => e.stopPropagation()}>
                  Save
                </button>
              </div>

              {/* Pin Info */}
              <div className="sponsored-pin-info">
                <h3 className="sponsored-pin-title">{pin.title}</h3>
                <p className="sponsored-pin-description">{pin.description}</p>

                {/* Business Info */}
                <div 
                  className="sponsored-business-info"
                  onClick={(e) => handleBusinessClick(pin, e)}
                >
                  <img src={pin.businessAvatar} alt={pin.businessName} className="sponsored-business-avatar" />
                  <div className="sponsored-business-details">
                    <span className="sponsored-business-name">
                      {pin.businessName}
                      {pin.businessVerified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0076D3">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </span>
                    <span className="sponsored-business-category">{pin.category}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href={pin.ctaLink} 
                  className="sponsored-cta-btn"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pin.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>

                {/* Stats */}
                <div className="sponsored-pin-stats">
                  <span className="sponsored-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#767676">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    {formatCount(pin.impressions)}
                  </span>
                  <span className="sponsored-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#767676">
                      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    {formatCount(pin.saves)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
