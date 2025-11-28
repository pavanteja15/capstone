import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewPin.css";
import TopNav from "../components/global/TopNav";
import { useAppSelector } from "../store/hooks";
import { mapMediaPath } from "../utils/userMapper";

const API_BASE_URL = "http://localhost:8765";

interface PinUser {
  id?: number;
  name?: string;
  fullname?: string;
  profilePath?: string;
}

interface PinData {
  id?: number;
  image: string;
  title: string;
  description: string;
  // Old format (from frontend navigation)
  userName?: string;
  userProfile?: string;
  // New format (from backend - nested user object)
  user?: PinUser;
  // New format (from backend PinViewDTO - flat fields)
  userId?: number;
  userFullname?: string;
  userProfilePath?: string;
  // Board info
  boardId?: number;
  boardTitle?: string;
}

interface RelatedPin {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  userId?: number;
  userFullname?: string;
  userProfilePath?: string;
  boardId?: number;
}

const ViewPin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user ID from Redux store
  const user = useAppSelector((state) => state.user);
  const userId = user.userId;
  
  // Get pin data from navigation state or use defaults
  const pinFromState = location.state?.pin;
  
  const pin: PinData = pinFromState || {
    id: undefined,
    image: "/assets/images/one.jpg",
    title: "Beautiful Artwork",
    description: "A stunning piece of digital art with vibrant colors and amazing detail.",
    userName: "VERONICA LODGE",
    userProfile: "/assets/images/three.jpg"
  };

  // Extract user info - handle multiple formats:
  // 1. Backend PinViewDTO: userFullname, userName, userProfilePath (flat fields)
  // 2. Backend Pin entity: user object with fullname, name, profilePath
  // 3. Frontend navigation: userName, userProfile (legacy format)
  const pinOwnerName = 
    pin.userFullname || 
    pin.user?.fullname || 
    pin.user?.name || 
    pin.userName || 
    "Pinterest User";
  
  // Get raw profile path from any source
  const rawProfilePath = 
    pin.userProfilePath || 
    pin.user?.profilePath || 
    pin.userProfile;
  
  // Use mapMediaPath to properly convert to URL (handles absolute paths with drive letters)
  const pinOwnerAvatar = mapMediaPath(rawProfilePath, API_BASE_URL) || "/assets/images/profilepic1.jpg";

  // Get the pin owner's user ID
  const pinOwnerId = pin.userId || pin.user?.id;

  // Handle click on user name/avatar to navigate to profile
  const handleUserClick = () => {
    if (pinOwnerId) {
      // If the pin owner is the current logged-in user, go to UserProfile
      if (userId && pinOwnerId === userId) {
        navigate("/profile");
      } else {
        // Otherwise, go to ViewProfile to see other user's profile
        navigate("/viewprofile", {
          state: {
            user: {
              id: pinOwnerId,
              name: pinOwnerName,
              username: pin.userName || pin.user?.name || pinOwnerName.toLowerCase().replace(/\s+/g, ''),
              avatar: pinOwnerAvatar,
              bio: "",
              followers: 0,
              following: 0,
              isFollowing: false
            }
          }
        });
      }
    }
  };

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Start with 0, fetch from API
  const [saved, setSaved] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [relatedPins, setRelatedPins] = useState<RelatedPin[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Check if pin has a valid ID for like/save operations
  const hasPinId = Boolean(pin.id);

  // Fetch like count and check like/save status on component mount
  useEffect(() => {
    // Always fetch like count if pin.id exists (regardless of user login)
    if (pin.id) {
      axios.get(`${API_BASE_URL}/api/pins/${pin.id}/likes`)
        .then(res => {
          setLikeCount(res.data ?? 0);
        }).catch(err => {
          console.error("Error fetching like count:", err);
          setLikeCount(0);
        });
    } else {
      setLikeCount(0);
    }

    // Check if user has liked/saved (only if logged in)
    if (userId && pin.id) {
      // Check if liked
      axios.get(`${API_BASE_URL}/api/pins/isLiked`, {
        params: { userId, pinId: pin.id }
      }).then(res => {
        setLiked(res.data === true);
      }).catch(err => {
        console.error("Error checking like status:", err);
        setLiked(false);
      });

      // Check if saved
      axios.get(`${API_BASE_URL}/api/pins/isSaved`, {
        params: { userId, pinId: pin.id }
      }).then(res => {
        setSaved(res.data === true);
      }).catch(err => {
        console.error("Error checking save status:", err);
        setSaved(false);
      });
    } else {
      setLiked(false);
      setSaved(false);
    }
  }, [userId, pin.id]);

  // Fetch related pins - same board first, then other pins
  useEffect(() => {
    const fetchRelatedPins = async () => {
      setLoadingRelated(true);
      try {
        let boardPins: RelatedPin[] = [];
        let allPins: RelatedPin[] = [];

        // If pin has a board, fetch pins from the same board first
        if (pin.boardId) {
          try {
            const boardRes = await axios.get<RelatedPin[]>(`${API_BASE_URL}/pins/boards/${pin.boardId}/pins`);
            boardPins = (boardRes.data ?? [])
              .filter(p => p.id !== pin.id) // Exclude current pin
              .map(p => ({
                ...p,
                imageUrl: mapMediaPath(p.imageUrl, API_BASE_URL) || "/assets/images/one.jpg"
              }));
          } catch (err) {
            console.error("Error fetching board pins:", err);
          }
        }

        // Fetch all pins from feed
        try {
          const feedRes = await axios.get<RelatedPin[]>(`${API_BASE_URL}/pins/feed`);
          const boardPinIds = new Set(boardPins.map(p => p.id));
          
          allPins = (feedRes.data ?? [])
            .filter(p => p.id !== pin.id && !boardPinIds.has(p.id)) // Exclude current pin and board pins
            .map(p => ({
              ...p,
              imageUrl: mapMediaPath(p.imageUrl, API_BASE_URL) || "/assets/images/one.jpg"
            }));
        } catch (err) {
          console.error("Error fetching feed pins:", err);
        }

        // Combine: board pins first, then other pins
        setRelatedPins([...boardPins, ...allPins]);
      } catch (err) {
        console.error("Error fetching related pins:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedPins();
  }, [pin.id, pin.boardId]);

  const toggleLike = async () => {
    if (!hasPinId) {
      return; // Silently return - button should be disabled anyway
    }

    if (!userId) {
      alert("Please login to like pins");
      navigate("/login");
      return;
    }

    if (isLiking || liked) {
      return;
    }

    setIsLiking(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/pins/like`, null, {
        params: { userId, pinId: pin.id }
      });
      
      // Check response message to confirm success
      if (response.data === "Pin liked successfully") {
        setLikeCount(prev => prev + 1);
        setLiked(true);
      } else {
        // Already liked message from backend
        setLiked(true);
      }
    } catch (error: any) {
      console.error("Error liking pin:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!hasPinId) {
      return; // Silently return - button should be disabled anyway
    }

    if (!userId) {
      alert("Please login to save pins");
      navigate("/login");
      return;
    }

    if (isSaving || saved) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/pins/save`, null, {
        params: { userId, pinId: pin.id }
      });
      
      if (response.data === "Pin saved successfully") {
        setSaved(true);
      } else {
        setSaved(true);
      }
    } catch (error: any) {
      console.error("Error saving pin:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePinClick = (relatedPin: RelatedPin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          id: relatedPin.id,
          image: relatedPin.imageUrl,
          title: relatedPin.title || "Related Pin",
          description: relatedPin.description || "Discover more amazing content like this.",
          userId: relatedPin.userId,
          userFullname: relatedPin.userFullname,
          userProfilePath: relatedPin.userProfilePath,
          boardId: relatedPin.boardId
        }
      }
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="viewpin-page">
      <TopNav />
      
      <div className="viewpin-container">
        {/* Main Pin Card */}
        <div className="viewpin-card">
          {/* Left - Pin Image */}
          <div className="viewpin-image-section">
            <img src={pin.image} alt={pin.title} className="viewpin-main-image" />
            <div className="viewpin-image-actions">
              <button className="viewpin-expand-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"/>
                </svg>
              </button>
              <button className="viewpin-lens-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right - Pin Details */}
          <div className="viewpin-details-section">
            {/* Top Action Bar */}
            <div className="viewpin-action-bar">
              <div className="viewpin-left-actions">
                <button 
                  className={`viewpin-icon-btn ${liked ? 'liked' : ''} ${!hasPinId ? 'disabled' : ''}`} 
                  onClick={toggleLike}
                  disabled={isLiking || !hasPinId}
                  title={!hasPinId ? "Like not available for this pin" : ""}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? "#e60023" : "none"} stroke={liked ? "#e60023" : "currentColor"} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{likeCount}</span>
                </button>
              </div>

              <div className="viewpin-right-actions">
                <button 
                  className={`viewpin-save-btn ${saved ? 'saved' : ''} ${!hasPinId ? 'disabled' : ''}`}
                  onClick={handleSave}
                  disabled={isSaving || !hasPinId}
                  title={!hasPinId ? "Save not available for this pin" : ""}
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="viewpin-user-section">
              <img 
                src={pinOwnerAvatar} 
                alt={pinOwnerName} 
                className="viewpin-user-avatar clickable" 
                onClick={handleUserClick}
              />
              <span 
                className="viewpin-username clickable" 
                onClick={handleUserClick}
              >
                {pinOwnerName}
              </span>
            </div>
          </div>
        </div>

        {/* Related Pins Section */}
        <div className="viewpin-related-section">
          <h2 className="viewpin-related-title">More to explore</h2>
          {loadingRelated ? (
            <div className="viewpin-related-loading">Loading...</div>
          ) : relatedPins.length === 0 ? (
            <div className="viewpin-related-empty">No related pins found</div>
          ) : (
            <div className="viewpin-related-grid">
              {relatedPins.map((relatedPin) => (
                <div
                  key={relatedPin.id}
                  className="viewpin-related-card"
                  onClick={() => handlePinClick(relatedPin)}
                >
                  <img src={relatedPin.imageUrl} alt={relatedPin.title || "Related pin"} className="viewpin-related-image" />
                  <div className="viewpin-related-overlay">
                    <button className="viewpin-related-save">Save</button>
                  </div>
                  {relatedPin.title && (
                    <div className="viewpin-related-info">
                      <span className="viewpin-related-pin-title">{relatedPin.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPin;
