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

type Collaborator = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: 'accepted' | 'pending';
};

type CollabRequest = {
  id: number;
  email: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
};

const ViewBoard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabEmail, setCollabEmail] = useState('');
  const [activeCollabTab, setActiveCollabTab] = useState<'invite' | 'requests' | 'collaborators'>('collaborators');
  const { board, isOwner = true } = location.state || {};

  // Sample collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 1, name: "Sophia Chen", email: "sophia@example.com", avatar: "/assets/images/profilepic1.jpg", status: 'accepted' },
    { id: 2, name: "Alex Johnson", email: "alex@example.com", avatar: "/assets/images/profilepic1.jpg", status: 'accepted' },
  ]);

  // Sample pending requests
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([
    { id: 1, email: "john@example.com", sentAt: "2 days ago", status: 'pending' },
    { id: 2, email: "emma@example.com", sentAt: "1 week ago", status: 'pending' },
  ]);

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

  const handleSendCollabRequest = () => {
    if (collabEmail.trim()) {
      const newRequest: CollabRequest = {
        id: Date.now(),
        email: collabEmail.trim(),
        sentAt: "Just now",
        status: 'pending'
      };
      setCollabRequests(prev => [...prev, newRequest]);
      setCollabEmail('');
      setActiveCollabTab('requests');
    }
  };

  const handleRemoveCollaborator = (id: number) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  const handleCancelRequest = (id: number) => {
    setCollabRequests(prev => prev.filter(r => r.id !== id));
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
            <button className="viewboard-collab-btn" onClick={() => setShowCollabModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <span>Collaborators</span>
              {collaborators.length > 0 && (
                <span className="collab-count">{collaborators.length}</span>
              )}
            </button>
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

        {/* Collaborator Modal */}
        {showCollabModal && (
          <div className="collab-modal-overlay" onClick={() => setShowCollabModal(false)}>
            <div className="collab-modal" onClick={(e) => e.stopPropagation()}>
              <div className="collab-modal-header">
                <h2>Collaborators</h2>
                <button className="collab-modal-close" onClick={() => setShowCollabModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="collab-tabs">
                {isOwner && (
                  <>
                    <button 
                      className={`collab-tab ${activeCollabTab === 'invite' ? 'active' : ''}`}
                      onClick={() => setActiveCollabTab('invite')}
                    >
                      Invite
                    </button>
                    <button 
                      className={`collab-tab ${activeCollabTab === 'requests' ? 'active' : ''}`}
                      onClick={() => setActiveCollabTab('requests')}
                    >
                      Requests
                      {collabRequests.filter(r => r.status === 'pending').length > 0 && (
                        <span className="tab-badge">{collabRequests.filter(r => r.status === 'pending').length}</span>
                      )}
                    </button>
                  </>
                )}
                <button 
                  className={`collab-tab ${activeCollabTab === 'collaborators' ? 'active' : ''}`}
                  onClick={() => setActiveCollabTab('collaborators')}
                >
                  Members
                  {collaborators.length > 0 && (
                    <span className="tab-badge">{collaborators.length}</span>
                  )}
                </button>
              </div>

              <div className="collab-modal-content">
                {/* Invite Tab */}
                {activeCollabTab === 'invite' && (
                  <div className="collab-invite-section">
                    <p className="collab-invite-text">
                      Invite people to collaborate on this board. They'll be able to add and edit pins.
                    </p>
                    <div className="collab-invite-input-wrapper">
                      <input
                        type="email"
                        className="collab-invite-input"
                        placeholder="Enter email address"
                        value={collabEmail}
                        onChange={(e) => setCollabEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCollabRequest()}
                      />
                      <button 
                        className="collab-send-btn"
                        onClick={handleSendCollabRequest}
                        disabled={!collabEmail.trim()}
                      >
                        Send Invite
                      </button>
                    </div>
                  </div>
                )}

                {/* Requests Tab */}
                {activeCollabTab === 'requests' && (
                  <div className="collab-requests-section">
                    {collabRequests.length === 0 ? (
                      <div className="collab-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <p>No pending requests</p>
                      </div>
                    ) : (
                      <div className="collab-list">
                        {collabRequests.map((request) => (
                          <div key={request.id} className="collab-item">
                            <div className="collab-item-avatar">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="#767676">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                              </svg>
                            </div>
                            <div className="collab-item-info">
                              <span className="collab-item-email">{request.email}</span>
                              <span className="collab-item-time">Sent {request.sentAt}</span>
                            </div>
                            <span className={`collab-status ${request.status}`}>{request.status}</span>
                            <button 
                              className="collab-cancel-btn"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Collaborators Tab */}
                {activeCollabTab === 'collaborators' && (
                  <div className="collab-members-section">
                    {/* Board Owner - Show differently based on if user is owner */}
                    {isOwner ? (
                      <div className="collab-item owner">
                        <img src="/assets/images/profilepic1.jpg" alt="Owner" className="collab-item-avatar-img" />
                        <div className="collab-item-info">
                          <span className="collab-item-name">You (Owner)</span>
                          <span className="collab-item-email">you@example.com</span>
                        </div>
                        <span className="collab-role owner-badge">Owner</span>
                      </div>
                    ) : (
                      <div className="collab-item owner">
                        <img src="/assets/images/profilepic1.jpg" alt="Owner" className="collab-item-avatar-img" />
                        <div className="collab-item-info">
                          <span className="collab-item-name">velu sonali</span>
                          <span className="collab-item-email">velusonali@example.com</span>
                        </div>
                        <span className="collab-role owner-badge">Owner</span>
                      </div>
                    )}

                    {collaborators.length === 0 ? (
                      <div className="collab-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <p>No collaborators yet</p>
                      </div>
                    ) : (
                      <div className="collab-list">
                        {collaborators.map((collab) => (
                          <div key={collab.id} className="collab-item">
                            <img src={collab.avatar} alt={collab.name} className="collab-item-avatar-img" />
                            <div className="collab-item-info">
                              <span className="collab-item-name">{collab.name}</span>
                              <span className="collab-item-email">{collab.email}</span>
                            </div>
                            <span className="collab-role">Editor</span>
                            {isOwner && (
                              <button 
                                className="collab-remove-btn"
                                onClick={() => handleRemoveCollaborator(collab.id)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Leave Board button for non-owners */}
                    {!isOwner && (
                      <div className="collab-leave-section">
                        <button className="collab-leave-btn" onClick={() => navigate(-1)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                          </svg>
                          Leave Board
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBoard;
