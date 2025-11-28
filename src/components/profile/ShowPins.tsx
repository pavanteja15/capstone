import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";

export interface PinCard {
  id: number;
  title?: string;
  imageUrl?: string;
  description?: string;
  likes?: number;
}

interface ShowPinsProps {
  pins?: PinCard[];
  isLoading?: boolean;
  onCreatePin?: () => void;
}

const placeholderPin = "/assets/images/one.jpg";

const ShowPins: React.FC<ShowPinsProps> = ({ pins = [], isLoading = false, onCreatePin }) => {
  const navigate = useNavigate();

  const handleCreatePin = () => {
    if (onCreatePin) {
      onCreatePin();
      return;
    }
    navigate("/create-pin");
  };

  const handlePinClick = (pin: PinCard) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.imageUrl ?? placeholderPin,
          title: pin.title ?? "Untitled Pin",
          description: pin.description ?? "Check out this pin!",
          likes: pin.likes ?? Math.floor(Math.random() * 500) + 50,
          userName: "",
          userProfile: "/assets/images/profilepic1.jpg",
        },
      },
    });
  };

  if (isLoading) {
    return <div className="pins-section">Loading pins...</div>;
  }

  return (
    <div className="pins-section">
      <div className="pins-masonry">
        <div className="pin-card create-pin-card" onClick={handleCreatePin}>
          <div className="create-pin-content">
            <div className="create-pin-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#767676">
                <path d="M12 4v16m-8-8h16" stroke="#767676" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="create-pin-text">Create Pin</span>
          </div>
        </div>

        {pins.map((p) => (
          <div key={p.id} className="pin-card" onClick={() => handlePinClick(p)}>
            <img src={p.imageUrl || placeholderPin} alt={p.title} className="pin-image" />
            <div className="pin-hover-overlay">
              <button
                className="pin-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
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