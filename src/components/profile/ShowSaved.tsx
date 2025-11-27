import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";

type SavedItem = {
  id: number;
  img: string;
  title: string;
};

const savedItems: SavedItem[] = [
  { id: 1, img: "/assets/images/four.jpg", title: "Makeup Look" },
  { id: 2, img: "/assets/images/five.jpg", title: "Bedroom Setup" },
  { id: 3, img: "/assets/images/six.jpg", title: "Travel Dreams" },
  { id: 4, img: "/assets/images/one.jpg", title: "Nature Vibes" },
  { id: 5, img: "/assets/images/two.jpg", title: "Urban Style" },
  { id: 6, img: "/assets/images/three.jpg", title: "Art Collection" },
];

const ShowSaved: React.FC = () => {
  const navigate = useNavigate();

  const handlePinClick = (item: SavedItem) => {
    navigate("/viewpin", {
      state: {
        pin: {
          image: item.img,
          title: item.title,
          description: "Check out this saved pin!",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: "velu sonali",
          userProfile: "/assets/images/profilepic1.jpg"
        }
      }
    });
  };

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // Handle remove logic here
    console.log("Remove saved pin:", id);
  };

  return (
    <div className="saved-section">
      <div className="saved-masonry">
        {savedItems.map(s => (
          <div 
            key={s.id} 
            className="saved-card"
            onClick={() => handlePinClick(s)}
          >
            <img src={s.img} alt={s.title} className="saved-image" />
            <div className="saved-hover-overlay">
              <button className="saved-remove-btn" onClick={(e) => handleRemove(e, s.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowSaved;