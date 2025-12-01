import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./ViewBoard.css";
import { mapMediaPath } from "../utils/userMapper";

const API_BASE_URL = "http://localhost:8765";
const PLACEHOLDER_PIN = "/assets/images/one.jpg";
const PLACEHOLDER_BOARD = "/assets/images/nine.jpg";
const PLACEHOLDER_AVATAR = "/assets/images/profilepic1.jpg";

type LocationBoard = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  cover?: string;
  coverImageUrl?: string;
  pinCount?: number;
  ownerId?: number;
};

type BoardDetails = {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  pinCount?: number;
  isPrivate?: boolean;
  ownerId?: number;
};

type PinUser = {
  id?: number;
  name?: string;
  fullname?: string;
  profilePath?: string;
};

type PinResponse = {
  id?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  sourceUrl?: string;
  boardId?: number;
  userId?: number;
  attribution?: string;
  // User info from PinViewDTO (flat fields)
  userName?: string;
  userFullname?: string;
  userProfilePath?: string;
  // Or nested user object
  user?: PinUser;
};

type BoardPin = PinResponse & {
  id: number;
  displayImage?: string;
  displayVideo?: string;
  primaryMedia: string;
};

const mapPinsToView = (pins: PinResponse[] | undefined): BoardPin[] => {
  if (!pins?.length) {
    return [];
  }

  return pins
    .filter((pin): pin is PinResponse & { id: number } => typeof pin.id === "number")
    .map((pin) => {
      const resolvedImage = mapMediaPath(pin.imageUrl, API_BASE_URL);
      const resolvedVideo = mapMediaPath(pin.videoUrl, API_BASE_URL);

      return {
        ...pin,
        id: pin.id!,
        displayImage: resolvedImage ?? undefined,
        // Show video if videoUrl exists (video pins may have both imageUrl as thumbnail and videoUrl)
        displayVideo: resolvedVideo ?? undefined,
        primaryMedia: resolvedVideo ?? resolvedImage ?? PLACEHOLDER_PIN,
      };
    });
};

type Collaborator = {
  id: number;
  name: string;
  fullName?: string;
  email: string;
  profilePicUrl?: string;
};

type CollabRequest = {
  id: number;
  receiverEmail: string;
  receiverName?: string;
  receiverAvatar?: string;
  sentAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
};

type BoardOwner = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

const ViewBoard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabEmail, setCollabEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [activeCollabTab, setActiveCollabTab] = useState<'invite' | 'requests' | 'collaborators'>('collaborators');
  const locationState = (location.state || {}) as { board?: LocationBoard; isOwner?: boolean; ownerId?: number };
  const initialBoard = locationState.board;
  
  // Get current user from Redux
  const user = useSelector((state: any) => state.user);
  const currentUserId = user?.userId;

  // Board owner info
  const [boardOwner, setBoardOwner] = useState<BoardOwner | null>(null);

  // Collaborators from API
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [collaboratorsLoading, setCollaboratorsLoading] = useState(false);

  // Sent invitations/requests from API
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);

  // Edit/Delete Board Modal States
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const [editBoardForm, setEditBoardForm] = useState({ title: '', description: '', isPrivate: false });
  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false);
  const [isDeletingBoard, setIsDeletingBoard] = useState(false);

  // Edit/Delete Pin States
  const [deletePinConfirm, setDeletePinConfirm] = useState<BoardPin | null>(null);
  const [isDeletingPin, setIsDeletingPin] = useState(false);
  const [openPinMenuId, setOpenPinMenuId] = useState<number | null>(null);

  const [boardDetails, setBoardDetails] = useState<BoardDetails | null>(
    initialBoard
      ? {
          id: initialBoard.id,
          title: initialBoard.title ?? initialBoard.name ?? "Untitled board",
          description: initialBoard.description,
          coverImageUrl:
            mapMediaPath(initialBoard.coverImageUrl ?? initialBoard.cover, API_BASE_URL) ?? PLACEHOLDER_BOARD,
          pinCount: initialBoard.pinCount,
          ownerId: initialBoard.ownerId,
        }
      : null
  );

  // Derive ownership from board details or location state
  const boardOwnerId = boardDetails?.ownerId ?? locationState.ownerId ?? initialBoard?.ownerId;
  const isOwner = locationState.isOwner ?? (currentUserId && boardOwnerId ? currentUserId === boardOwnerId : false);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState("");
  const [boardPins, setBoardPins] = useState<BoardPin[]>([]);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [pinsError, setPinsError] = useState("");

  // Sort and Filter states
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');
  const [filterText, setFilterText] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const queryBoardId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get("boardId");
    if (!idParam) {
      return undefined;
    }
    const parsed = Number(idParam);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [location.search]);

  const resolvedBoardId = initialBoard?.id ?? queryBoardId;

  useEffect(() => {
    if (!resolvedBoardId) {
      return;
    }
    const controller = new AbortController();
    setBoardLoading(true);
    setBoardError("");
    axios
      .get(`${API_BASE_URL}/board/boards/${resolvedBoardId}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data) {
          return;
        }
        setBoardDetails((prev) => ({
          id: data.id ?? resolvedBoardId,
          title: data.title ?? prev?.title ?? "Untitled board",
          description: data.description ?? prev?.description,
          coverImageUrl:
            mapMediaPath(data.coverImageUrl, API_BASE_URL) ?? prev?.coverImageUrl ?? PLACEHOLDER_BOARD,
          pinCount: data.pinCount ?? prev?.pinCount,
          isPrivate: data.isPrivate ?? prev?.isPrivate,
          ownerId: data.ownerId ?? prev?.ownerId,
        }));
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setBoardError("Unable to load board details right now.");
        }
      })
      .finally(() => {
        setBoardLoading(false);
      });
    return () => controller.abort();
  }, [resolvedBoardId]);

  useEffect(() => {
    if (!resolvedBoardId) {
      setBoardPins([]);
      return;
    }
    const controller = new AbortController();
    setPinsLoading(true);
    setPinsError("");
    axios
      .get<PinResponse[]>(`${API_BASE_URL}/pins/boards/${resolvedBoardId}/pins`, { signal: controller.signal })
      .then(({ data }) => {
        setBoardPins(mapPinsToView(data));
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setPinsError("Unable to load pins for this board.");
        }
      })
      .finally(() => setPinsLoading(false));

    return () => controller.abort();
  }, [resolvedBoardId]);

  // Fetch collaborators
  useEffect(() => {
    if (!resolvedBoardId) {
      return;
    }
    setCollaboratorsLoading(true);
    axios
      .get(`${API_BASE_URL}/api/invitations/boards/${resolvedBoardId}/collaborators`)
      .then(({ data }) => {
        setCollaborators(data || []);
      })
      .catch(() => {
        setCollaborators([]);
      })
      .finally(() => setCollaboratorsLoading(false));
  }, [resolvedBoardId]);

  // Fetch sent invitations for this board (for owner)
  useEffect(() => {
    if (!resolvedBoardId || !currentUserId || !isOwner) {
      return;
    }
    axios
      .get(`${API_BASE_URL}/api/invitations/${currentUserId}/sent/board/${resolvedBoardId}`)
      .then(({ data }) => {
        const requests = (data || []).map((inv: any) => ({
          id: inv.id,
          receiverEmail: inv.receiverEmail,
          receiverName: inv.receiverName,
          receiverAvatar: inv.receiverAvatar,
          sentAt: inv.sentAt || 'Recently',
          status: inv.status
        }));
        setCollabRequests(requests);
      })
      .catch(() => {
        setCollabRequests([]);
      });
  }, [resolvedBoardId, currentUserId, isOwner]);

  // Fetch board owner info
  useEffect(() => {
    if (!boardOwnerId) return;
    
    axios.get(`${API_BASE_URL}/users/${boardOwnerId}`)
      .then(({ data }) => {
        setBoardOwner({
          id: data.id,
          name: data.fullname || data.name || 'Board Owner',
          email: data.email || '',
          avatar: mapMediaPath(data.profilePath, API_BASE_URL) || PLACEHOLDER_AVATAR
        });
      })
      .catch(() => {
        setBoardOwner(null);
      });
  }, [boardOwnerId]);

  const boardName = boardDetails?.title ?? "Untitled board";
  const boardDescription = boardDetails?.description ?? "No description";
  const totalPins = boardDetails?.pinCount ?? boardPins.length;
  const pinCountLabel = pinsLoading ? "Loading pins..." : `${totalPins} Pins`;
  const missingBoardSelection = !resolvedBoardId;

  // Sort and filter pins
  const sortedAndFilteredPins = useMemo(() => {
    let filtered = [...boardPins];
    
    // Filter by text
    if (filterText.trim()) {
      const searchLower = filterText.toLowerCase();
      filtered = filtered.filter(pin => 
        pin.title?.toLowerCase().includes(searchLower) ||
        pin.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort pins
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'a-z':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'z-a':
        filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
    }
    
    return filtered;
  }, [boardPins, sortOption, filterText]);

  const handleSortChange = (option: 'newest' | 'oldest' | 'a-z' | 'z-a') => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePinClick = (pin: BoardPin) => {
    const imageMedia = pin.displayImage ?? pin.primaryMedia ?? PLACEHOLDER_PIN;
    const videoMedia = pin.displayVideo || (pin.videoUrl ? mapMediaPath(pin.videoUrl, API_BASE_URL) : undefined);

    navigate("/viewpin", {
      state: {
        pin: {
          id: pin.id,
          image: imageMedia,
          videoUrl: videoMedia,
          title: pin.title ?? "Pin",
          description: pin.description ?? "Check out this pin from the board!",
          // Pass user info from backend (flat fields from PinViewDTO)
          userId: pin.userId,
          userName: pin.userName,
          userFullname: pin.userFullname,
          userProfilePath: pin.userProfilePath,
          // Also pass nested user object if present
          user: pin.user,
          boardId: pin.boardId
        }
      }
    });
  };

  const handleAddPin = () => {
    navigate("/create-pin");
  };

  // Edit Board Handlers
  const handleEditBoardClick = () => {
    if (boardDetails) {
      setEditBoardForm({
        title: boardDetails.title,
        description: boardDetails.description || '',
        isPrivate: boardDetails.isPrivate || false
      });
      setShowEditBoardModal(true);
    }
  };

  const handleEditBoardSave = async () => {
    if (!resolvedBoardId || !editBoardForm.title.trim()) return;
    
    setIsUpdatingBoard(true);
    try {
      await axios.put(`${API_BASE_URL}/board/boards/${resolvedBoardId}`, {
        title: editBoardForm.title.trim(),
        description: editBoardForm.description.trim(),
        isPrivate: editBoardForm.isPrivate
      });
      
      setBoardDetails(prev => prev ? {
        ...prev,
        title: editBoardForm.title.trim(),
        description: editBoardForm.description.trim(),
        isPrivate: editBoardForm.isPrivate
      } : null);
      
      setShowEditBoardModal(false);
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board. Please try again.");
    } finally {
      setIsUpdatingBoard(false);
    }
  };

  // Delete Board Handler
  const handleDeleteBoardConfirm = async () => {
    if (!resolvedBoardId) return;
    
    setIsDeletingBoard(true);
    try {
      await axios.delete(`${API_BASE_URL}/board/boards/${resolvedBoardId}`);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("Failed to delete board. Please try again.");
    } finally {
      setIsDeletingBoard(false);
    }
  };

  // Edit Pin Handler
  const handleEditPin = (e: React.MouseEvent, pin: BoardPin) => {
    e.stopPropagation();
    navigate("/create-pin", {
      state: {
        pinId: pin.id,
        pin: {
          id: pin.id,
          title: pin.title,
          description: pin.description,
          imageUrl: pin.displayImage,
          videoUrl: pin.displayVideo,
          boardId: pin.boardId
        }
      }
    });
  };

  // Delete Pin Handlers
  const handleDeletePinClick = (e: React.MouseEvent, pin: BoardPin) => {
    e.stopPropagation();
    setDeletePinConfirm(pin);
  };

  const handleDeletePinConfirm = async () => {
    if (!deletePinConfirm) return;
    
    setIsDeletingPin(true);
    try {
      await axios.delete(`${API_BASE_URL}/pins/${deletePinConfirm.id}`);
      setBoardPins(prev => prev.filter(p => p.id !== deletePinConfirm.id));
      setDeletePinConfirm(null);
    } catch (error) {
      console.error("Error deleting pin:", error);
      alert("Failed to delete pin. Please try again.");
    } finally {
      setIsDeletingPin(false);
    }
  };

  const handleSendCollabRequest = async () => {
    if (!collabEmail.trim() || !currentUserId || !resolvedBoardId) return;
    
    setInviteError('');
    setInviteSuccess('');
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/invitations/${currentUserId}/send-by-email`,
        { boardId: resolvedBoardId, email: collabEmail.trim() }
      );
      
      const inv = response.data;
      const newRequest: CollabRequest = {
        id: inv.id,
        receiverEmail: inv.receiverEmail,
        receiverName: inv.receiverName,
        receiverAvatar: inv.receiverAvatar,
        sentAt: inv.sentAt || 'Just now',
        status: inv.status
      };
      setCollabRequests(prev => [...prev, newRequest]);
      setCollabEmail('');
      setInviteSuccess('Invitation sent successfully!');
      setActiveCollabTab('requests');
      
      setTimeout(() => setInviteSuccess(''), 3000);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to send invitation';
      if (msg.includes('USER_NOT_FOUND_WITH_EMAIL')) {
        setInviteError('No user found with this email address');
      } else if (msg.includes('ALREADY_COLLABORATOR')) {
        setInviteError('This user is already a collaborator');
      } else if (msg.includes('INVITATION_ALREADY_EXISTS')) {
        setInviteError('An invitation has already been sent to this user');
      } else if (msg.includes('CANNOT_INVITE_SELF')) {
        setInviteError('You cannot invite yourself');
      } else {
        setInviteError(typeof msg === 'string' ? msg : 'Failed to send invitation');
      }
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: number) => {
    if (!resolvedBoardId || !currentUserId) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/invitations/boards/${resolvedBoardId}/collaborators/${collaboratorId}?requesterId=${currentUserId}`
      );
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
    }
  };

  const handleCancelRequest = async (invitationId: number) => {
    if (!currentUserId) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/invitations/${invitationId}/cancel?senderId=${currentUserId}`
      );
      setCollabRequests(prev => prev.filter(r => r.id !== invitationId));
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    }
  };

  const handleLeaveBoard = async () => {
    if (!resolvedBoardId || !currentUserId) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/invitations/boards/${resolvedBoardId}/collaborators/${currentUserId}?requesterId=${currentUserId}`
      );
      navigate(-1);
    } catch (error) {
      console.error('Failed to leave board:', error);
    }
  };

  return (
    <div className="viewboard-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="viewboard-content">
        {missingBoardSelection ? (
          <div className="viewboard-empty">
            <div className="viewboard-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <h3 className="viewboard-empty-title">Board not found</h3>
            <p className="viewboard-empty-text">Select a board from your profile to view its pins.</p>
            <button className="viewboard-add-btn" onClick={() => navigate("/profile")}>
              Go to profile
            </button>
          </div>
        ) : (
          <>
            {boardError && <div className="viewboard-error">{boardError}</div>}
            {pinsError && <div className="viewboard-error">{pinsError}</div>}

            {/* Board Header */}
            <div className="viewboard-header">
              <button className="viewboard-back-btn" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              </button>

              <div className="viewboard-info">
                <h1 className="viewboard-name">{boardLoading ? "Loading board..." : boardName}</h1>
                <p className="viewboard-description">
                  {boardLoading ? "Please wait while we load board details." : boardDescription}
                </p>
                <div className="viewboard-meta">
                  <span className="viewboard-pin-count">{pinCountLabel}</span>
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
                <button className="viewboard-action-btn" onClick={handleAddPin} title="Add Pin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isOwner && (
                  <>
                    <button className="viewboard-action-btn" onClick={handleEditBoardClick} title="Edit Board">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button className="viewboard-action-btn viewboard-delete-btn" onClick={() => setShowDeleteBoardModal(true)} title="Delete Board">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Pins Grid */}
            <div className="viewboard-pins-section">
              {/* Sort and Filter Controls */}
              <div className="viewboard-controls">
                <div className="viewboard-filter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#767676">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input
                    type="text"
                    className="viewboard-filter-input"
                    placeholder="Filter pins..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  {filterText && (
                    <button className="viewboard-filter-clear" onClick={() => setFilterText('')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#767676">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="viewboard-sort">
                  <button 
                    className="viewboard-sort-btn"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                    </svg>
                    <span>
                      {sortOption === 'newest' && 'Newest'}
                      {sortOption === 'oldest' && 'Oldest'}
                      {sortOption === 'a-z' && 'A-Z'}
                      {sortOption === 'z-a' && 'Z-A'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {showSortDropdown && (
                    <div className="viewboard-sort-dropdown">
                      <button 
                        className={`sort-option ${sortOption === 'newest' ? 'active' : ''}`}
                        onClick={() => handleSortChange('newest')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                        </svg>
                        Newest First
                      </button>
                      <button 
                        className={`sort-option ${sortOption === 'oldest' ? 'active' : ''}`}
                        onClick={() => handleSortChange('oldest')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                        </svg>
                        Oldest First
                      </button>
                      <button 
                        className={`sort-option ${sortOption === 'a-z' ? 'active' : ''}`}
                        onClick={() => handleSortChange('a-z')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                        Title A-Z
                      </button>
                      <button 
                        className={`sort-option ${sortOption === 'z-a' ? 'active' : ''}`}
                        onClick={() => handleSortChange('z-a')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                        Title Z-A
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {pinsLoading && <p className="viewboard-loading">Loading pins...</p>}
              <div className="viewboard-pins-masonry">
                {sortedAndFilteredPins.map(pin => (
                  <div 
                    key={pin.id} 
                    className="viewboard-pin-card"
                    onClick={() => handlePinClick(pin)}
                  >
                    {pin.displayVideo ? (
                      <video
                        src={pin.displayVideo}
                        className="viewboard-pin-video"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                    ) : (
                      <img 
                        src={pin.displayImage || pin.primaryMedia} 
                        alt={pin.title ?? "Pin"} 
                        className="viewboard-pin-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== PLACEHOLDER_PIN) {
                            target.src = PLACEHOLDER_PIN;
                          }
                        }}
                      />
                    )}
                    {isOwner && (
                      <div className="viewboard-pin-menu" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="viewboard-pin-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPinMenuId(openPinMenuId === pin.id ? null : pin.id);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#333">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                        {openPinMenuId === pin.id && (
                          <div className="viewboard-pin-menu-dropdown">
                            <button 
                              className="viewboard-pin-menu-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPinMenuId(null);
                                handleEditPin(e, pin);
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                              Edit
                            </button>
                            <button 
                              className="viewboard-pin-menu-item delete-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPinMenuId(null);
                                handleDeletePinClick(e, pin);
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State (if no pins) */}
            {!pinsLoading && sortedAndFilteredPins.length === 0 && (
              <div className="viewboard-empty">
                <div className="viewboard-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#767676">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                </div>
                <h3 className="viewboard-empty-title">
                  {filterText ? 'No matching pins' : 'No Pins yet'}
                </h3>
                <p className="viewboard-empty-text">
                  {filterText ? 'Try a different search term' : 'Add pins to this board to get started'}
                </p>
                {!filterText && (
                  <button className="viewboard-add-btn" onClick={handleAddPin}>
                    Add Pin
                  </button>
                )}
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
                          {collabRequests.filter(r => r.status === 'PENDING').length > 0 && (
                            <span className="tab-badge">{collabRequests.filter(r => r.status === 'PENDING').length}</span>
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
                            onChange={(e) => { setCollabEmail(e.target.value); setInviteError(''); }}
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
                        {inviteError && <p className="collab-error">{inviteError}</p>}
                        {inviteSuccess && <p className="collab-success">{inviteSuccess}</p>}
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
                                {request.receiverAvatar ? (
                                  <img 
                                    src={mapMediaPath(request.receiverAvatar, API_BASE_URL) || PLACEHOLDER_AVATAR} 
                                    alt={request.receiverName || request.receiverEmail} 
                                    className="collab-item-avatar-img" 
                                  />
                                ) : (
                                  <div className="collab-item-avatar">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#767676">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                  </div>
                                )}
                                <div className="collab-item-info">
                                  {request.receiverName && <span className="collab-item-name">{request.receiverName}</span>}
                                  <span className="collab-item-email">{request.receiverEmail}</span>
                                  <span className="collab-item-time">Sent {request.sentAt}</span>
                                </div>
                                <span className={`collab-status ${request.status.toLowerCase()}`}>{request.status.toLowerCase()}</span>
                                {request.status === 'PENDING' && (
                                  <button 
                                    className="collab-cancel-btn"
                                    onClick={() => handleCancelRequest(request.id)}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collaborators Tab */}
                    {activeCollabTab === 'collaborators' && (
                      <div className="collab-members-section">
                        {/* Board Owner */}
                        <div className="collab-item owner">
                          <img 
                            src={isOwner 
                              ? (mapMediaPath(user?.profilePath, API_BASE_URL) || PLACEHOLDER_AVATAR)
                              : (boardOwner?.avatar || PLACEHOLDER_AVATAR)
                            } 
                            alt="Owner" 
                            className="collab-item-avatar-img" 
                          />
                          <div className="collab-item-info">
                            <span className="collab-item-name">
                              {isOwner ? 'You (Owner)' : (boardOwner?.name || 'Board Owner')}
                            </span>
                            <span className="collab-item-email">
                              {isOwner ? (user?.email || '') : (boardOwner?.email || '')}
                            </span>
                          </div>
                          <span className="collab-role owner-badge">Owner</span>
                        </div>

                        {collaboratorsLoading ? (
                          <div className="collab-empty">
                            <p>Loading collaborators...</p>
                          </div>
                        ) : collaborators.length === 0 ? (
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
                                <img 
                                  src={mapMediaPath(collab.profilePicUrl, API_BASE_URL) || PLACEHOLDER_AVATAR} 
                                  alt={collab.fullName || collab.name} 
                                  className="collab-item-avatar-img" 
                                />
                                <div className="collab-item-info">
                                  <span className="collab-item-name">{collab.fullName || collab.name}</span>
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
                            <button className="collab-leave-btn" onClick={handleLeaveBoard}>
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
          </>
        )}

        {/* Edit Board Modal */}
        {showEditBoardModal && (
          <div className="modal-overlay" onClick={() => setShowEditBoardModal(false)}>
            <div className="edit-board-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Board</h2>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editBoardForm.title}
                  onChange={(e) => setEditBoardForm({...editBoardForm, title: e.target.value})}
                  placeholder="Board title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editBoardForm.description}
                  onChange={(e) => setEditBoardForm({...editBoardForm, description: e.target.value})}
                  placeholder="Board description (optional)"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowEditBoardModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleEditBoardSave} disabled={isUpdatingBoard}>
                  {isUpdatingBoard ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Board Modal */}
        {showDeleteBoardModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteBoardModal(false)}>
            <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Delete Board?</h2>
              <p>This will permanently delete this board and all its pins. This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteBoardModal(false)}>Cancel</button>
                <button className="delete-btn" onClick={handleDeleteBoardConfirm} disabled={isDeletingBoard}>
                  {isDeletingBoard ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Pin Modal */}
        {deletePinConfirm && (
          <div className="modal-overlay" onClick={() => setDeletePinConfirm(null)}>
            <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Delete Pin?</h2>
              <p>This will remove this pin from the board. This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setDeletePinConfirm(null)}>Cancel</button>
                <button className="delete-btn" onClick={handleDeletePinConfirm} disabled={isDeletingPin}>
                  {isDeletingPin ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBoard;
