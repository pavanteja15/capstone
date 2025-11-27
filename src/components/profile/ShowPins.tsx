
import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";



 

type Pin = {

  id: number;

  img: string;

  title: string;

};


 

const pins: Pin[] = [
  { id: 1, img: "/assets/images/one.jpg", title: "Nature Vibes" },
  { id: 2, img: "/assets/images/two.jpg", title: "Urban Style" },
  { id: 3, img: "/assets/images/three.jpg", title: "Art Collection" },
  { id: 4, img: "/assets/images/four.jpg", title: "Travel Goals" },
  { id: 5, img: "/assets/images/five.jpg", title: "Food Ideas" },
  { id: 6, img: "/assets/images/seven.jpg", title: "Home Decor" },
  { id: 7, img: "/assets/images/eight.jpg", title: "Fashion Inspo" },
];


 

const ShowPins: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePin = () => {
    navigate("/create-pin");
  };

  const handlePinClick = (pin: Pin) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.img,
          title: pin.title,
          description: "Check out this amazing pin!",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: "velu sonali",
          userProfile: "/assets/images/profilepic1.jpg"
        }
      }
    });
  };

  return (
    <div className="pins-section">
      <div className="pins-masonry">
        {/* Create Pin Card */}
        <div className="pin-card create-pin-card" onClick={handleCreatePin}>
          <div className="create-pin-content">
            <div className="create-pin-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#767676">
                <path d="M12 4v16m-8-8h16" stroke="#767676" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="create-pin-text">Create Pin</span>
          </div>
        </div>

        {/* Pin Cards */}
        {pins.map(p => (
          <div 
            key={p.id} 
            className="pin-card"
            onClick={() => handlePinClick(p)}
          >
            <img src={p.img} alt={p.title} className="pin-image" />
            <div className="pin-hover-overlay">
              <button className="pin-edit-btn" onClick={(e) => { e.stopPropagation(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};


 

export default ShowPins;