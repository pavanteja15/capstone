import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import { useAppSelector } from "../store/hooks";
import { mapMediaPath } from "../utils/userMapper";
import "./ViewProfile.css";

const API_BASE_URL = "http://localhost:8765";

type PinData = {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  userId?: number;
  userName?: string;
  userFullname?: string;
  userProfilePath?: string;
  boardId?: number;
  boardTitle?: string;
};

type BoardData = {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  pinCount: number;
  ownerId: number;
  isPrivate?: boolean;
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
  accountType?: string;
  businessName?: string;
  websiteUrl?: string;
};

const ViewProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'created' | 'boards'>('created');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get current logged-in user from Redux
  const currentUser = useAppSelector((state) => state.user);
  const currentUserId = currentUser.userId;
  
  // Get user from navigation state or route parameter
  const { user: passedUser } = location.state || {};
  const targetUserId = routeUserId ? parseInt(routeUserId) : passedUser?.id;
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: passedUser?.id || 0,
    name: passedUser?.name || "User",
    username: passedUser?.username || "user",
    avatar: passedUser?.avatar || "/assets/images/profilepic1.jpg",
    bio: passedUser?.bio || "",
    followers: 0,
    following: 0,
    isFollowing: false,
    accountType: passedUser?.accountType || "USER",
    businessName: passedUser?.businessName || "",
    websiteUrl: passedUser?.websiteUrl || ""
  });

  const [userPins, setUserPins] = useState<PinData[]>([]);
  const [userBoards, setUserBoards] = useState<BoardData[]>([]);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Fetch user data, pins, boards, and follow status
  useEffect(() => {
    const fetchData = async () => {
      if (!targetUserId) {
        setError("User not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Fetch user details
        const userRes = await axios.get(`${API_BASE_URL}/auth/user/${targetUserId}`);
        const userData = userRes.data;

        // Fetch followers count
        const followersCountRes = await axios.get(`${API_BASE_URL}/follow/${targetUserId}/followers/count`);
        const followersCount = followersCountRes.data;

        // Fetch following count
        const followingCountRes = await axios.get(`${API_BASE_URL}/follow/${targetUserId}/following/count`);
        const followingCount = followingCountRes.data;

        // Check if current user is following this user
        let isFollowing = false;
        if (currentUserId && currentUserId !== targetUserId) {
          try {
            const isFollowingRes = await axios.get(`${API_BASE_URL}/follow/${currentUserId}/isfollowing/${targetUserId}`);
            isFollowing = isFollowingRes.data === true;
          } catch (err) {
            console.error("Error checking follow status:", err);
          }
        }

        // Update user profile with fetched data
        setUserProfile({
          id: userData.userId || targetUserId,
          name: userData.fullname || userData.name || passedUser?.name || "User",
          username: userData.name || passedUser?.username || "user",
          avatar: mapMediaPath(userData.profilePath, API_BASE_URL) || passedUser?.avatar || "/assets/images/profilepic1.jpg",
          bio: userData.bio || userData.description || passedUser?.bio || "",
          followers: followersCount || 0,
          following: followingCount || 0,
          isFollowing: isFollowing,
          accountType: userData.accountType || passedUser?.accountType || "USER",
          businessName: userData.businessProfile?.businessName || passedUser?.businessName || "",
          websiteUrl: userData.businessProfile?.websiteUrl || passedUser?.websiteUrl || ""
        });

        // Fetch public pins for this user
        const pinsRes = await axios.get(`${API_BASE_URL}/pins/users/${targetUserId}/pins/public`);
        setUserPins(pinsRes.data || []);

        // Fetch public boards for this user
        const boardsRes = await axios.get(`${API_BASE_URL}/board/users/${targetUserId}/boards/public`);
        setUserBoards(boardsRes.data || []);

      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetUserId, currentUserId, passedUser]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      alert("Please login to follow users");
      navigate("/Register");
      return;
    }

    if (currentUserId === userProfile.id) {
      return; // Can't follow yourself
    }

    setIsFollowLoading(true);

    try {
      if (userProfile.isFollowing) {
        // Unfollow
        await axios.delete(`${API_BASE_URL}/follow/${currentUserId}/unfollow/${userProfile.id}`);
        setUserProfile(prev => ({
          ...prev,
          isFollowing: false,
          followers: prev.followers - 1
        }));
      } else {
        // Follow
        await axios.post(`${API_BASE_URL}/follow/${currentUserId}/follow/${userProfile.id}`);
        setUserProfile(prev => ({
          ...prev,
          isFollowing: true,
          followers: prev.followers + 1
        }));
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBoardClick = (board: BoardData) => {
    navigate("/viewboard", {
      state: {
        board: {
          id: board.id,
          name: board.title,
          cover: mapMediaPath(board.coverImageUrl, API_BASE_URL) || "/assets/images/one.jpg",
          description: board.description || `${userProfile.name}'s ${board.title} collection`,
          pins: [],
          ownerId: userProfile.id
        },
        isOwner: false,
        ownerId: userProfile.id
      }
    });
  };

  const handlePinClick = (pin: PinData) => {
    const imageUrl = mapMediaPath(pin.imageUrl, API_BASE_URL) || 
                     mapMediaPath(pin.videoUrl, API_BASE_URL) || 
                     "/assets/images/one.jpg";
    
    navigate("/viewpin", {
      state: {
        pin: {
          id: pin.id,
          image: imageUrl,
          title: pin.title || "Untitled Pin",
          description: pin.description || "Check out this amazing pin!",
          userId: userProfile.id,
          userName: userProfile.username,
          userFullname: userProfile.name,
          userProfilePath: userProfile.avatar
        }
      }
    });
  };

  const handleMessage = () => {
    console.log("Open message with", userProfile.name);
  };

  const getPinImage = (pin: PinData): string => {
    return mapMediaPath(pin.imageUrl, API_BASE_URL) || 
           mapMediaPath(pin.videoUrl, API_BASE_URL) || 
           "/assets/images/one.jpg";
  };

  const getBoardCover = (board: BoardData): string => {
    return mapMediaPath(board.coverImageUrl, API_BASE_URL) || "/assets/images/one.jpg";
  };

  if (loading) {
    return (
      <div className="viewprofile-page">
        <SideNav openCreateMenu={() => setShowMenu(true)} />
        <TopNav />
        <div className="viewprofile-content">
          <div className="viewprofile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewprofile-page">
        <SideNav openCreateMenu={() => setShowMenu(true)} />
        <TopNav />
        <div className="viewprofile-content">
          <button className="viewprofile-back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="viewprofile-error">{error}</div>
        </div>
      </div>
    );
  }

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
          
          {/* Business Badge and Name */}
          {userProfile.accountType === 'BUSINESS' && (
            <div className="viewprofile-business-info">
              <span className="viewprofile-business-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                Business Account
              </span>
              {userProfile.businessName && (
                <p className="viewprofile-business-name">{userProfile.businessName}</p>
              )}
              {userProfile.websiteUrl && (
                <a 
                  href={userProfile.websiteUrl.startsWith('http') ? userProfile.websiteUrl : `https://${userProfile.websiteUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="viewprofile-website-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                  </svg>
                  {userProfile.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          )}
          
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
              disabled={isFollowLoading}
            >
              {userProfile.isFollowing ? 'Unfollow' : 'Follow'}
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
            className={`viewprofile-tab ${activeTab === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveTab('boards')}
          >
            Boards
          </button>
        </div>

        {/* Content */}
        <div className="viewprofile-tab-content">
          {activeTab === 'created' && (
            <div className="viewprofile-pins-section">
              {userPins.length === 0 ? (
                <div className="viewprofile-empty">
                  <p>No public pins yet</p>
                </div>
              ) : (
                <div className="viewprofile-pins-masonry">
                  {userPins.map(pin => (
                    <div 
                      key={pin.id} 
                      className="viewprofile-pin-card"
                      onClick={() => handlePinClick(pin)}
                    >
                      <img src={getPinImage(pin)} alt={pin.title || "Pin"} className="viewprofile-pin-image" />
                      <div className="viewprofile-pin-overlay">
                        <button className="viewprofile-pin-save-btn" onClick={(e) => { e.stopPropagation(); }}>
                          Save
                        </button>
                      </div>
                      {pin.title && (
                        <div className="viewprofile-pin-title">{pin.title}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'boards' && (
            <div className="viewprofile-boards-section">
              {userBoards.length === 0 ? (
                <div className="viewprofile-empty">
                  <p>No public boards yet</p>
                </div>
              ) : (
                <div className="viewprofile-boards-grid">
                  {userBoards.map(board => (
                    <div 
                      key={board.id} 
                      className="viewprofile-board-card"
                      onClick={() => handleBoardClick(board)}
                    >
                      <div className="viewprofile-board-cover">
                        <img src={getBoardCover(board)} alt={board.title} />
                      </div>
                      <div className="viewprofile-board-info">
                        <h3 className="viewprofile-board-name">{board.title}</h3>
                        <span className="viewprofile-board-count">{board.pinCount} Pins</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
