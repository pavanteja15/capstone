import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./ViewProfile.css";

type Pin = {
  id: number;
  img: string;
  title: string;
};

type Board = {
  id: number;
  name: string;
  cover: string;
  pinCount: number;
};

type UserProfile = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
};

const ViewProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'created' | 'saved'>('created');
  
  // Get user from navigation state or use default
  const { user: passedUser } = location.state || {};
  
  const [userProfile, setUserProfile] = useState<UserProfile>(passedUser || {
    id: 1,
    name: "Sophia Chen",
    username: "sophiachen",
    avatar: "/assets/images/profilepic1.jpg",
    bio: "Digital artist & designer | Creating visual stories ✨ | Based in San Francisco",
    followers: 12500,
    following: 892,
    isFollowing: false
  });

  // Sample boards
  const userBoards: Board[] = [
    { id: 1, name: "Travel Dreams", cover: "/assets/images/one.jpg", pinCount: 45 },
    { id: 2, name: "Home Decor", cover: "/assets/images/two.jpg", pinCount: 32 },
    { id: 3, name: "Fashion Inspo", cover: "/assets/images/three.jpg", pinCount: 28 },
    { id: 4, name: "Art & Design", cover: "/assets/images/four.jpg", pinCount: 56 },
    { id: 5, name: "Food & Recipes", cover: "/assets/images/five.jpg", pinCount: 19 },
  ];

  // Sample pins
  const userPins: Pin[] = [
    { id: 1, img: "/assets/images/one.jpg", title: "Sunset view" },
    { id: 2, img: "/assets/images/two.jpg", title: "Modern interior" },
    { id: 3, img: "/assets/images/three.jpg", title: "Street style" },
    { id: 4, img: "/assets/images/four.jpg", title: "Abstract art" },
    { id: 5, img: "/assets/images/five.jpg", title: "Delicious meal" },
    { id: 6, img: "/assets/images/seven.jpg", title: "Nature" },
    { id: 7, img: "/assets/images/eight.jpg", title: "Architecture" },
    { id: 8, img: "/assets/images/nine.jpg", title: "Photography" },
  ];

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleFollowToggle = () => {
    setUserProfile(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBoardClick = (board: Board) => {
    navigate("/viewboard", {
      state: {
        board: {
          name: board.name,
          cover: board.cover,
          description: `${userProfile.name}'s ${board.name} collection`,
          pins: []
        },
        isOwner: false
      }
    });
  };

  const handlePinClick = (pin: Pin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.img,
          title: pin.title,
          description: "Check out this amazing pin!",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: userProfile.name,
          userProfile: userProfile.avatar
        }
      }
    });
  };

  const handleMessage = () => {
    // Navigate to messages or open chat
    console.log("Open message with", userProfile.name);
  };

  return (
    <div className="viewprofile-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="viewprofile-content">
        {/* Back Button */}
        <button className="viewprofile-back-btn" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {/* Profile Header */}
        <div className="viewprofile-header">
          <div className="viewprofile-avatar-wrapper">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="viewprofile-avatar"
            />
          </div>

          <h1 className="viewprofile-name">{userProfile.name}</h1>
          <p className="viewprofile-username">@{userProfile.username}</p>
          
          {userProfile.bio && (
            <p className="viewprofile-bio">{userProfile.bio}</p>
          )}

          {/* Stats */}
          <div className="viewprofile-stats">
            <div className="viewprofile-stat">
              <span className="stat-count">{formatCount(userProfile.followers)}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="viewprofile-stat-divider">•</div>
            <div className="viewprofile-stat">
              <span className="stat-count">{formatCount(userProfile.following)}</span>
              <span className="stat-label">following</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="viewprofile-actions">
            <button 
              className={`viewprofile-follow-btn ${userProfile.isFollowing ? 'following' : ''}`}
              onClick={handleFollowToggle}
            >
              {userProfile.isFollowing ? (
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
            <button className="viewprofile-message-btn" onClick={handleMessage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </button>
            <button className="viewprofile-more-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="viewprofile-tabs">
          <button 
            className={`viewprofile-tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            Created
          </button>
          <button 
            className={`viewprofile-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </div>

        {/* Content */}
        <div className="viewprofile-tab-content">
          {activeTab === 'created' && (
            <div className="viewprofile-pins-section">
              <div className="viewprofile-pins-masonry">
                {userPins.map(pin => (
                  <div 
                    key={pin.id} 
                    className="viewprofile-pin-card"
                    onClick={() => handlePinClick(pin)}
                  >
                    <img src={pin.img} alt={pin.title} className="viewprofile-pin-image" />
                    <div className="viewprofile-pin-overlay">
                      <button className="viewprofile-pin-save-btn" onClick={(e) => { e.stopPropagation(); }}>
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="viewprofile-boards-section">
              <div className="viewprofile-boards-grid">
                {userBoards.map(board => (
                  <div 
                    key={board.id} 
                    className="viewprofile-board-card"
                    onClick={() => handleBoardClick(board)}
                  >
                    <div className="viewprofile-board-cover">
                      <img src={board.cover} alt={board.name} />
                    </div>
                    <div className="viewprofile-board-info">
                      <h3 className="viewprofile-board-name">{board.name}</h3>
                      <span className="viewprofile-board-count">{board.pinCount} Pins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
