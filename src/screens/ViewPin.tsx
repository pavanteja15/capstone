import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ViewPin.css";
import TopNav from "../components/global/TopNav";

interface PinData {
  image: string;
  title: string;
  description: string;
  likes: number;
  userName: string;
  userProfile: string;
}

const ViewPin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get pin data from navigation state or use defaults
  const pinFromState = location.state?.pin;
  
  const pin: PinData = pinFromState || {
    image: "/assets/images/one.jpg",
    title: "Beautiful Artwork",
    description: "A stunning piece of digital art with vibrant colors and amazing detail.",
    likes: 172,
    userName: "VERONICA LODGE",
    userProfile: "/assets/images/three.jpg"
  };

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(pin.likes);
  const [selectedBoard, setSelectedBoard] = useState("Select");
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  const boards = ["Nature", "Anime", "Art", "Travel", "Food"];

  // Related pins data
  const relatedPins = [
    "/assets/images/one.jpg",
    "/assets/images/two.jpg",
    "/assets/images/three.jpg",
    "/assets/images/four.jpg",
    "/assets/images/five.jpg",
    "/assets/images/seven.jpg",
    "/assets/images/eight.jpg",
    "/assets/images/one.jpg",
    "/assets/images/two.jpg",
    "/assets/images/three.jpg",
    "/assets/images/four.jpg",
    "/assets/images/five.jpg",
  ];

  const toggleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
    } else {
      setLikeCount(likeCount - 1);
      setLiked(false);
    }
  };

  const handlePinClick = (imgSrc: string) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: imgSrc,
          title: "Related Pin",
          description: "Discover more amazing content like this.",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: "Pinterest User",
          userProfile: "/assets/images/three.jpg"
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
                <button className="viewpin-icon-btn" onClick={toggleLike}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? "#e60023" : "none"} stroke={liked ? "#e60023" : "currentColor"} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{likeCount}</span>
                </button>
                <button className="viewpin-icon-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </button>
                <button className="viewpin-icon-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
                <button className="viewpin-icon-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <div className="viewpin-right-actions">
                <div className="viewpin-board-selector" onClick={() => setShowBoardDropdown(!showBoardDropdown)}>
                  <span>{selectedBoard}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                  {showBoardDropdown && (
                    <div className="viewpin-board-dropdown">
                      {boards.map((board) => (
                        <div
                          key={board}
                          className="viewpin-board-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBoard(board);
                            setShowBoardDropdown(false);
                          }}
                        >
                          {board}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="viewpin-save-btn">Save</button>
              </div>
            </div>

            {/* User Info */}
            <div className="viewpin-user-section">
              <img src={pin.userProfile} alt={pin.userName} className="viewpin-user-avatar" />
              <span className="viewpin-username">{pin.userName}</span>
            </div>

            {/* Comments section placeholder */}
            <div className="viewpin-comments-section">
              <p className="viewpin-comments-placeholder">Comments</p>
              <p className="viewpin-no-comments">No comments yet! Add one to start the conversation.</p>
              
              <div className="viewpin-add-comment">
                <span className="viewpin-emoji">😊</span>
                <input type="text" placeholder="Add a comment" className="viewpin-comment-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Pins Section */}
        <div className="viewpin-related-section">
          <h2 className="viewpin-related-title">More to explore</h2>
          <div className="viewpin-related-grid">
            {relatedPins.map((imgSrc, index) => (
              <div
                key={index}
                className="viewpin-related-card"
                onClick={() => handlePinClick(imgSrc)}
              >
                <img src={imgSrc} alt={`Related ${index + 1}`} className="viewpin-related-image" />
                <div className="viewpin-related-overlay">
                  <button className="viewpin-related-save">Save</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPin;
