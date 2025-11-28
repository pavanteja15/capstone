import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";

export interface SavedPinCard {
  id: number;
  title?: string;
  imageUrl?: string;
  description?: string;
  // User info - nested user object from Pin entity
  user?: {
    id?: number;
    name?: string;
    fullname?: string;
    profilePath?: string;
  };
}

interface ShowSavedProps {
  items?: SavedPinCard[];
  isLoading?: boolean;
}

const placeholderSaved = "/assets/images/four.jpg";

const ShowSaved: React.FC<ShowSavedProps> = ({ items = [], isLoading = false }) => {
  const navigate = useNavigate();

  const handlePinClick = (item: SavedPinCard) => {
    navigate("/viewpin", {
      state: {
        pin: {
          id: item.id,
          image: item.imageUrl ?? placeholderSaved,
          title: item.title ?? "Saved Pin",
          description: item.description ?? "Check out this saved pin!",
          // Pass nested user object from saved Pin entity
          user: item.user,
        },
      },
    });
  };

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // TODO: Wire up remove saved pin API when backend is ready
    console.log("Remove saved pin:", id);
  };

  if (isLoading) {
    return <div className="saved-section">Loading saved pins...</div>;
  }

  return (
    <div className="saved-section">
      <div className="saved-masonry">
        {items.map((s) => (
          <div key={s.id} className="saved-card" onClick={() => handlePinClick(s)}>
            <img src={s.imageUrl || placeholderSaved} alt={s.title} className="saved-image" />
            <div className="saved-hover-overlay">
              <button className="saved-remove-btn" onClick={(e) => handleRemove(e, s.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="saved-empty-state">
            <p>You have not saved any pins yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSaved;