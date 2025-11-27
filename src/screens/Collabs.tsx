import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./Collabs.css";

type CollabRequest = {
  id: number;
  boardName: string;
  boardCover: string;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
};

type CollabBoard = {
  id: number;
  name: string;
  cover: string;
  ownerName: string;
  ownerAvatar: string;
  pinCount: number;
  role: 'collaborator' | 'owner';
};

const Collabs: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'boards'>('requests');

  // Sample incoming requests
  const [requests, setRequests] = useState<CollabRequest[]>([
    {
      id: 1,
      boardName: "Travel Ideas",
      boardCover: "/assets/images/nine.jpg",
      senderName: "John Smith",
      senderEmail: "john@example.com",
      senderAvatar: "/assets/images/profilepic1.jpg",
      sentAt: "2 hours ago",
      status: 'pending'
    },
    {
      id: 2,
      boardName: "Recipe Collection",
      boardCover: "/assets/images/eleven.jpg",
      senderName: "Emily Davis",
      senderEmail: "emily@example.com",
      senderAvatar: "/assets/images/profilepic1.jpg",
      sentAt: "1 day ago",
      status: 'pending'
    },
    {
      id: 3,
      boardName: "Workout Plans",
      boardCover: "/assets/images/twelve.jpg",
      senderName: "Mike Wilson",
      senderEmail: "mike@example.com",
      senderAvatar: "/assets/images/profilepic1.jpg",
      sentAt: "3 days ago",
      status: 'pending'
    },
  ]);

  // Sample boards where user is a collaborator
  const [collabBoards, setCollabBoards] = useState<CollabBoard[]>([
    {
      id: 1,
      name: "Home Decor Ideas",
      cover: "/assets/images/one.jpg",
      ownerName: "Sarah Johnson",
      ownerAvatar: "/assets/images/profilepic1.jpg",
      pinCount: 42,
      role: 'collaborator'
    },
    {
      id: 2,
      name: "Fashion Inspiration",
      cover: "/assets/images/two.jpg",
      ownerName: "Alex Chen",
      ownerAvatar: "/assets/images/profilepic1.jpg",
      pinCount: 28,
      role: 'collaborator'
    },
    {
      id: 3,
      name: "DIY Projects",
      cover: "/assets/images/three.jpg",
      ownerName: "Lisa Brown",
      ownerAvatar: "/assets/images/profilepic1.jpg",
      pinCount: 15,
      role: 'collaborator'
    },
  ]);

  const handleViewRequestBoard = (request: CollabRequest) => {
    navigate("/viewboard", {
      state: {
        board: {
          id: request.id,
          name: request.boardName,
          description: `Board by ${request.senderName}`,
          cover: request.boardCover
        },
        isPreview: true,
        isOwner: false
      }
    });
  };

  const handleAcceptRequest = (id: number) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      // Add to collab boards
      const newBoard: CollabBoard = {
        id: Date.now(),
        name: request.boardName,
        cover: request.boardCover,
        ownerName: request.senderName,
        ownerAvatar: request.senderAvatar,
        pinCount: 0,
        role: 'collaborator'
      };
      setCollabBoards(prev => [...prev, newBoard]);
      // Remove from requests
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDeclineRequest = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleLeaveBoard = (id: number) => {
    setCollabBoards(prev => prev.filter(b => b.id !== id));
  };

  const handleBoardClick = (board: CollabBoard) => {
    navigate("/viewboard", {
      state: {
        board: {
          id: board.id,
          name: board.name,
          description: `Collaborating with ${board.ownerName}`,
          cover: board.cover
        }
      }
    });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="collabs-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="collabs-content">
        <div className="collabs-header">
          <h1>Collaborations</h1>
          <p className="collabs-subtitle">Manage your collaboration requests and boards</p>
        </div>

        {/* Tabs */}
        <div className="collabs-tabs">
          <button
            className={`collabs-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
            {pendingCount > 0 && <span className="collabs-tab-badge">{pendingCount}</span>}
          </button>
          <button
            className={`collabs-tab ${activeTab === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveTab('boards')}
          >
            Collab Boards
            {collabBoards.length > 0 && <span className="collabs-tab-badge">{collabBoards.length}</span>}
          </button>
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="collabs-requests-section">
            {requests.length === 0 ? (
              <div className="collabs-empty">
                <div className="collabs-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <h3>No pending requests</h3>
                <p>When someone invites you to collaborate on a board, it will appear here</p>
              </div>
            ) : (
              <div className="collabs-requests-list">
                {requests.map(request => (
                  <div key={request.id} className="collabs-request-card">
                    <div className="request-board-preview">
                      <img src={request.boardCover} alt={request.boardName} />
                    </div>
                    <div className="request-info">
                      <h3 className="request-board-name">{request.boardName}</h3>
                      <div className="request-sender">
                        <img src={request.senderAvatar} alt={request.senderName} className="request-sender-avatar" />
                        <div className="request-sender-info">
                          <span className="request-sender-name">{request.senderName}</span>
                          <span className="request-sender-email">{request.senderEmail}</span>
                        </div>
                      </div>
                      <span className="request-time">Invited {request.sentAt}</span>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="request-view-btn"
                        onClick={() => handleViewRequestBoard(request)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        View Board
                      </button>
                      <div className="request-actions-row">
                        <button 
                          className="request-accept-btn"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="request-decline-btn"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collab Boards Tab */}
        {activeTab === 'boards' && (
          <div className="collabs-boards-section">
            {collabBoards.length === 0 ? (
              <div className="collabs-empty">
                <div className="collabs-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <h3>No collaboration boards</h3>
                <p>Boards you collaborate on will appear here</p>
              </div>
            ) : (
              <div className="collabs-boards-grid">
                {collabBoards.map(board => (
                  <div key={board.id} className="collabs-board-card">
                    <div 
                      className="board-card-cover"
                      onClick={() => handleBoardClick(board)}
                    >
                      <img src={board.cover} alt={board.name} />
                      <div className="board-card-overlay">
                        <span className="board-card-name">{board.name}</span>
                      </div>
                    </div>
                    <div className="board-card-footer">
                      <div className="board-card-owner">
                        <img src={board.ownerAvatar} alt={board.ownerName} className="board-owner-avatar" />
                        <div className="board-owner-info">
                          <span className="board-owner-name">{board.ownerName}</span>
                          <span className="board-pin-count">{board.pinCount} pins</span>
                        </div>
                      </div>
                      <button 
                        className="board-leave-btn"
                        onClick={() => handleLeaveBoard(board.id)}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collabs;
