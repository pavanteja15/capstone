import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./ViewBoard.css";

type Pin = {
  id: number;
  img: string;
  title: string;
};

const ViewBoard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { board } = location.state || {};

  // Default board data if none passed
  const boardData = board || {
    name: "My Board",
    description: "A collection of my favorite pins",
    cover: "/assets/images/one.jpg",
    pins: []
  };

  // Sample pins for the board
  const boardPins: Pin[] = [
    { id: 1, img: "/assets/images/one.jpg", title: "Pin 1" },
    { id: 2, img: "/assets/images/two.jpg", title: "Pin 2" },
    { id: 3, img: "/assets/images/three.jpg", title: "Pin 3" },
    { id: 4, img: "/assets/images/four.jpg", title: "Pin 4" },
    { id: 5, img: "/assets/images/five.jpg", title: "Pin 5" },
    { id: 6, img: "/assets/images/seven.jpg", title: "Pin 6" },
    { id: 7, img: "/assets/images/eight.jpg", title: "Pin 7" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handlePinClick = (pin: Pin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.img,
          title: pin.title,
          description: "Check out this pin from the board!",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: "velu sonali",
          userProfile: "/assets/images/profilepic1.jpg"
        }
      }
    });
  };

  const handleAddPin = () => {
    navigate("/create-pin");
  };

  return (
    <div className="viewboard-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="viewboard-content">
        {/* Board Header */}
        <div className="viewboard-header">
          <button className="viewboard-back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>

          <div className="viewboard-info">
            <h1 className="viewboard-name">{boardData.name}</h1>
            <p className="viewboard-description">
              {boardData.description || "No description"}
            </p>
            <div className="viewboard-meta">
              <span className="viewboard-pin-count">{boardPins.length} Pins</span>
              <span className="viewboard-separator">•</span>
              <span className="viewboard-time">2w</span>
            </div>
          </div>

          <div className="viewboard-actions">
            <button className="viewboard-action-btn" onClick={handleAddPin}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="viewboard-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Pins Grid */}
        <div className="viewboard-pins-section">
          <div className="viewboard-pins-masonry">
            {boardPins.map(pin => (
              <div 
                key={pin.id} 
                className="viewboard-pin-card"
                onClick={() => handlePinClick(pin)}
              >
                <img src={pin.img} alt={pin.title} className="viewboard-pin-image" />
                <div className="viewboard-pin-overlay">
                  <button className="viewboard-pin-edit-btn" onClick={(e) => { e.stopPropagation(); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no pins) */}
        {boardPins.length === 0 && (
          <div className="viewboard-empty">
            <div className="viewboard-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <h3 className="viewboard-empty-title">No Pins yet</h3>
            <p className="viewboard-empty-text">Add pins to this board to get started</p>
            <button className="viewboard-add-btn" onClick={handleAddPin}>
              Add Pin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBoard;
