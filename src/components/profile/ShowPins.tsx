import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TabSection.css";

const API_BASE_URL = "http://localhost:8765";

export interface PinCard {
  id: number;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  description?: string;
  likes?: number;
  status?: string; // DRAFT or PUBLISHED
  // User info from backend PinViewDTO
  userId?: number;
  userName?: string;
  userFullname?: string;
  userProfilePath?: string;
  // Or nested user object
  user?: {
    id?: number;
    name?: string;
    fullname?: string;
    profilePath?: string;
  };
}

interface ShowPinsProps {
  pins?: PinCard[];
  isLoading?: boolean;
  onCreatePin?: () => void;
  onPinDeleted?: (pinId: number) => void;
  isOwner?: boolean;
}

const placeholderPin = "/assets/images/one.jpg";

const ShowPins: React.FC<ShowPinsProps> = ({ 
  pins = [], 
  isLoading = false, 
  onCreatePin,
  onPinDeleted,
  isOwner = true 
}) => {
  const navigate = useNavigate();
  const [deleteConfirmPin, setDeleteConfirmPin] = useState<PinCard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          id: pin.id,
          image: pin.imageUrl ?? placeholderPin,
          videoUrl: pin.videoUrl ?? undefined,
          title: pin.title ?? "Untitled Pin",
          description: pin.description ?? "Check out this pin!",
          // Pass user info from backend (flat fields from PinViewDTO)
          userId: pin.userId,
          userName: pin.userName,
          userFullname: pin.userFullname,
          userProfilePath: pin.userProfilePath,
          // Also pass nested user object if present
          user: pin.user,
        },
      },
    });
  };

  const handleEditPin = (e: React.MouseEvent, pin: PinCard) => {
    e.stopPropagation();
    navigate("/create-pin", {
      state: {
        pinId: pin.id,
        pin: {
          id: pin.id,
          title: pin.title,
          description: pin.description,
          imageUrl: pin.imageUrl,
          videoUrl: pin.videoUrl,
        }
      }
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, pin: PinCard) => {
    e.stopPropagation();
    setDeleteConfirmPin(pin);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmPin) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/pins/${deleteConfirmPin.id}`);
      if (onPinDeleted) {
        onPinDeleted(deleteConfirmPin.id);
      }
      setDeleteConfirmPin(null);
    } catch (error) {
      console.error("Error deleting pin:", error);
      alert("Failed to delete pin. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if pin is a video
  const isVideoPin = (pin: PinCard): boolean => {
    return Boolean(pin.videoUrl && !pin.imageUrl);
  };

  if (isLoading) {
    return <div className="pins-section">Loading pins...</div>;
  }

  return (
    <div className="pins-section">
      <div className="pins-masonry">
        {isOwner && (
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
        )}

        {pins.map((p) => (
          <div key={p.id} className="pin-card" onClick={() => handlePinClick(p)}>
            {/* Draft Label */}
            {p.status === "DRAFT" && (
              <div className="pin-draft-label">Draft</div>
            )}
            {isVideoPin(p) ? (
              <video 
                src={p.videoUrl} 
                className="pin-image pin-video"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
              />
            ) : (
              <img 
                src={p.imageUrl || placeholderPin} 
                alt={p.title} 
                className="pin-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== placeholderPin) {
                    target.src = placeholderPin;
                  }
                }}
              />
            )}
            <div className="pin-hover-overlay">
              {isOwner && (
                <>
                  <button
                    className="pin-edit-btn"
                    onClick={(e) => handleEditPin(e, p)}
                    title="Edit Pin"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button
                    className="pin-delete-btn"
                    onClick={(e) => handleDeleteClick(e, p)}
                    title="Delete Pin"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmPin && (
        <div className="pin-delete-modal-overlay" onClick={() => setDeleteConfirmPin(null)}>
          <div className="pin-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Pin?</h3>
            <p>Are you sure you want to delete "{deleteConfirmPin.title || 'this pin'}"? This action cannot be undone.</p>
            <div className="pin-delete-modal-actions">
              <button 
                className="pin-delete-cancel-btn" 
                onClick={() => setDeleteConfirmPin(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="pin-delete-confirm-btn" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowPins;