import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import "./UserProfile.css";

import BoardsList, { BoardCard } from "../components/profile/ShowBoards";
import PinsList, { PinCard } from "../components/profile/ShowPins";
import SavedList, { SavedPinCard } from "../components/profile/ShowSaved";
import TopNav from "../components/global/TopNav";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, UserState } from "../store/userSlice";
import { UserResponse } from "../types/user";
import { mapMediaPath, normalizeUserPayload } from "../utils/userMapper";
import { setStoredUser, getStoredUser } from "../utils/authUtils";

const API_BASE_URL = "http://localhost:8765";
const FALLBACK_AVATAR = "/assets/images/profilepic1.jpg";

type UserSummary = {
  id: number;
  name?: string;
  fullName?: string;
  bio?: string;
  profilePicUrl?: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupList, setPopupList] = useState<UserSummary[]>([]);
  const [popupType, setPopupType] = useState<"followers" | "following" | "">("");
  const [openPicPopup, setOpenPicPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"saved" | "pins" | "boards">("boards");
  const [boards, setBoards] = useState<BoardCard[]>([]);
  const [pins, setPins] = useState<PinCard[]>([]);
  const [savedPins, setSavedPins] = useState<SavedPinCard[]>([]);
  const [followers, setFollowers] = useState<UserSummary[]>([]);
  const [following, setFollowing] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    mobile: "",
    businessName: "",
    websiteUrl: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const profileImage = useMemo(
    () => mapMediaPath(user.profilePath, API_BASE_URL) ?? FALLBACK_AVATAR,
    [user.profilePath]
  );

  const handlePopupOpen = useCallback((title: string, list: UserSummary[], type: "followers" | "following") => {
    // Don't open popup if list is empty
    if (list.length === 0) {
      return;
    }
    setPopupTitle(title);
    setPopupList(list);
    setPopupType(type);
    setOpenPopup(true);
  }, []);

  // Unfollow a user (current user stops following targetUserId)
  const handleUnfollow = useCallback(async (targetUserId: number) => {
    if (!user.userId || actionLoading !== null) return;
    
    setActionLoading(targetUserId);
    try {
      await axios.delete(`${API_BASE_URL}/follow/${user.userId}/unfollow/${targetUserId}`);
      
      // Update following list
      setFollowing(prev => prev.filter(u => u.id !== targetUserId));
      setPopupList(prev => prev.filter(u => u.id !== targetUserId));
      
      // Close popup if list becomes empty
      if (popupList.length <= 1) {
        setOpenPopup(false);
      }
    } catch (err) {
      console.error("Failed to unfollow user:", err);
      setError("Failed to unfollow user. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }, [user.userId, actionLoading, popupList.length]);

  // Remove a follower (make the follower unfollow current user)
  const handleRemoveFollower = useCallback(async (followerUserId: number) => {
    if (!user.userId || actionLoading !== null) return;
    
    setActionLoading(followerUserId);
    try {
      // To remove a follower, we need to make them unfollow us
      // This requires the follower to unfollow the current user
      await axios.delete(`${API_BASE_URL}/follow/${followerUserId}/unfollow/${user.userId}`);
      
      // Update followers list
      setFollowers(prev => prev.filter(u => u.id !== followerUserId));
      setPopupList(prev => prev.filter(u => u.id !== followerUserId));
      
      // Close popup if list becomes empty
      if (popupList.length <= 1) {
        setOpenPopup(false);
      }
    } catch (err) {
      console.error("Failed to remove follower:", err);
      setError("Failed to remove follower. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }, [user.userId, actionLoading, popupList.length]);

  const handleShareProfile = useCallback(() => {
    const url = window.location.href;
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title?: string; url?: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      shareNavigator.share({ title: "My Pinterest profile", url }).catch(() => undefined);
      return;
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => alert("Profile link copied"));
      return;
    }

    alert(`Share this link: ${url}`);
  }, []);

  // Open edit profile modal
  const handleEditProfile = useCallback(() => {
    setEditForm({
      name: user.name || "",
      bio: user.bio || "",
      mobile: user.mobile || "",
      businessName: user.businessName || "",
      websiteUrl: user.websiteUrl || "",
      description: user.description || "",
    });
    setEditError("");
    setShowEditModal(true);
  }, [user]);

  // Save profile changes
  const handleSaveProfile = useCallback(async () => {
    if (!user.userId) return;
    
    setIsSaving(true);
    setEditError("");

    try {
      const updateData: any = {
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        mobile: editForm.mobile.trim(),
      };

      // Include business fields if user is a business account
      if (user.accountType === "BUSINESS") {
        updateData.businessName = editForm.businessName.trim();
        updateData.websiteUrl = editForm.websiteUrl.trim();
        updateData.description = editForm.description.trim();
      }

      const response = await axios.put<UserResponse>(
        `${API_BASE_URL}/auth/user/${user.userId}`,
        updateData
      );

      // Update Redux store
      const updatedUser = {
        ...user,
        name: updateData.name,
        bio: updateData.bio,
        mobile: updateData.mobile,
        ...(user.accountType === "BUSINESS" && {
          businessName: updateData.businessName,
          websiteUrl: updateData.websiteUrl,
          description: updateData.description,
        }),
      };
      
      dispatch(setUser(updatedUser));

      // Update localStorage
      const storedUser = getStoredUser();
      if (storedUser) {
        setStoredUser({
          ...storedUser,
          name: updateData.name,
          bio: updateData.bio,
          mobile: updateData.mobile,
          ...(user.accountType === "BUSINESS" && {
            businessName: updateData.businessName,
            websiteUrl: updateData.websiteUrl,
            description: updateData.description,
          }),
        });
      }

      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setEditError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [user, editForm, dispatch]);

  const handleProfilePicClick = useCallback(() => {
    if (profileImage === FALLBACK_AVATAR || !user.profilePath) {
      // No profile picture, trigger file upload
      fileInputRef.current?.click();
    } else {
      // Has profile picture, show enlarged popup
      setOpenPicPopup(true);
    }
  }, [profileImage, user.profilePath]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.userId) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingPic(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<string>(
        `${API_BASE_URL}/auth/user/${user.userId}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user state with new profile path
      dispatch(setUser({
        ...user,
        profilePath: response.data,
      }));

    } catch (uploadError) {
      console.error("Profile picture upload failed:", uploadError);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingPic(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user.userId) {
      navigate("/");
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          userRes,
          boardRes,
          pinRes,
          savedRes,
          followersRes,
          followingRes,
        ]: [
          AxiosResponse<UserResponse>,
          AxiosResponse<BoardCard[]>,
          AxiosResponse<PinCard[]>,
          AxiosResponse<SavedPinCard[]>,
          AxiosResponse<UserSummary[]>,
          AxiosResponse<UserSummary[]>,
        ] = await Promise.all([
          axios.get<UserResponse>(`${API_BASE_URL}/auth/user/${user.userId}`, { signal: controller.signal }),
          axios.get<BoardCard[]>(`${API_BASE_URL}/board/users/${user.userId}/boards`, { signal: controller.signal }),
          axios.get<PinCard[]>(`${API_BASE_URL}/pins/users/${user.userId}/pins`, { signal: controller.signal }),
          axios.get<SavedPinCard[]>(`${API_BASE_URL}/api/pins/saved`, {
            params: { userId: user.userId },
            signal: controller.signal,
          }),
          axios.get<UserSummary[]>(`${API_BASE_URL}/follow/${user.userId}/followers`, { signal: controller.signal }),
          axios.get<UserSummary[]>(`${API_BASE_URL}/follow/${user.userId}/following`, { signal: controller.signal }),
        ]);

        if (!isMounted) {
          return;
        }

        if (userRes.data) {
          dispatch(setUser(normalizeUserPayload(userRes.data, user)));
        }

        const normalizedBoards = (boardRes.data ?? []).map((board: BoardCard) => ({
          ...board,
          coverImageUrl: mapMediaPath(board.coverImageUrl, API_BASE_URL) ?? FALLBACK_AVATAR,
          ownerId: user.userId ?? undefined
        }));

        const normalizePins = (pinList: PinCard[]): PinCard[] =>
          (pinList ?? []).map((pin) => ({
            ...pin,
            imageUrl:
              mapMediaPath(pin.imageUrl, API_BASE_URL) ??
              mapMediaPath((pin as any).videoUrl, API_BASE_URL) ??
              FALLBACK_AVATAR,
          }));

        const normalizedSavedPins: SavedPinCard[] = (savedRes.data ?? []).map((pin) => ({
          ...pin,
          imageUrl: mapMediaPath(pin.imageUrl, API_BASE_URL) ?? FALLBACK_AVATAR,
        }));

        setBoards(normalizedBoards);
        setPins(normalizePins(pinRes.data ?? []));
        setSavedPins(normalizedSavedPins);
        setFollowers(followersRes.data ?? []);
        setFollowing(followingRes.data ?? []);
      } catch (fetchError) {
        if (!axios.isCancel(fetchError) && isMounted) {
          setError("Unable to load profile details right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user.userId, dispatch, navigate]);

  const profileName = user.username || user.name || "Pinterest user";
  const username = user.name ? `@${user.name}` : "";

  const renderError = error ? <div className="profile-error">{error}</div> : null;

  return (
    <>
      <TopNav />

      {/* Hidden file input for profile picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="profile-wrapper">
        <div className="center-content">
          {renderError}

          <div className="profile-pic-container" onClick={handleProfilePicClick}>
            <img
              src={profileImage}
              alt="Profile"
              className={`profile-pic ${uploadingPic ? "uploading" : ""}`}
            />
            {profileImage === FALLBACK_AVATAR && !user.profilePath && (
              <div className="profile-pic-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span>Add Photo</span>
              </div>
            )}
            {uploadingPic && (
              <div className="profile-pic-uploading">
                <span>Uploading...</span>
              </div>
            )}
          </div>

          <h2 className="profile-name">
            {profileName}
            {user.accountType === "BUSINESS" && (
              <span className="business-badge">Business</span>
            )}
          </h2>
          {username && <p className="username">{username}</p>}
          {user.bio && <p className="profile-bio">{user.bio}</p>}

          {/* Business Details Section */}
          {user.accountType === "BUSINESS" && (
            <div className="business-details">
              {user.businessName && (
                <p className="business-name">{user.businessName}</p>
              )}
              {user.websiteUrl && (
                <a 
                  href={user.websiteUrl.startsWith('http') ? user.websiteUrl : `https://${user.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="business-website"
                >
                  {user.websiteUrl}
                </a>
              )}
              {user.description && (
                <p className="business-description">{user.description}</p>
              )}
            </div>
          )}

          <div className="follow-row">
            <span onClick={() => handlePopupOpen("Followers", followers, "followers")}>
              {followers.length} followers
            </span>
            <span>·</span>
            <span onClick={() => handlePopupOpen("Following", following, "following")}>
              {following.length} following
            </span>
          </div>

          <div className="profile-buttons">
            <button className="profile-btn" onClick={handleEditProfile}>Edit profile</button>
            <button className="profile-btn" onClick={handleShareProfile}>Share</button>
          </div>

          <div className="tabs">
            <button
              className={`tab-text ${selectedTab === "boards" ? "active-tab" : ""}`}
              onClick={() => setSelectedTab("boards")}
            >
              Boards
            </button>

            <button
              className={`tab-text ${selectedTab === "pins" ? "active-tab" : ""}`}
              onClick={() => setSelectedTab("pins")}
            >
              Pins
            </button>

            <button
              className={`tab-text ${selectedTab === "saved" ? "active-tab" : ""}`}
              onClick={() => setSelectedTab("saved")}
            >
              Saved
            </button>
          </div>

          <div className="tab-content">
            {selectedTab === "boards" && (
              <BoardsList
                boards={boards}
                isLoading={loading}
                onCreateBoard={() => navigate("/create-board")}
                onBoardUpdated={(updatedBoard) => {
                  setBoards(prev => prev.map(b => 
                    b.id === updatedBoard.id ? { ...b, ...updatedBoard } : b
                  ));
                }}
                onBoardDeleted={(boardId) => {
                  setBoards(prev => prev.filter(b => b.id !== boardId));
                }}
                isOwner={true}
              />
            )}
            {selectedTab === "pins" && (
              <PinsList
                pins={pins}
                isLoading={loading}
                onCreatePin={() => navigate("/create-pin")}
                onPinDeleted={(pinId) => {
                  setPins(prev => prev.filter(p => p.id !== pinId));
                }}
                isOwner={true}
              />
            )}
            {selectedTab === "saved" && <SavedList items={savedPins} isLoading={loading} />}
          </div>
        </div>

        {openPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <div className="popup-close-star" onClick={() => setOpenPopup(false)}>
                X
              </div>
              <h2>{popupTitle}</h2>
              <div className="popup-list-scroll">
                <ul>
                  {popupList.map((u) => (
                    <li key={u.id}>
                      <div 
                        className="popup-user-info clickable"
                        onClick={() => {
                          setOpenPopup(false);
                          navigate("/viewprofile", {
                            state: {
                              user: {
                                id: u.id,
                                name: u.fullName || u.name,
                                username: u.name || "",
                                avatar: mapMediaPath(u.profilePicUrl, API_BASE_URL) ?? FALLBACK_AVATAR,
                                bio: u.bio || "",
                                followers: 0,
                                following: 0,
                                isFollowing: popupType === "following"
                              }
                            }
                          });
                        }}
                      >
                        <img
                          src={mapMediaPath(u.profilePicUrl, API_BASE_URL) ?? FALLBACK_AVATAR}
                          alt={u.fullName || u.name}
                          className="popup-user-pic"
                        />
                        <div className="popup-user-details">
                          <div className="popup-user-name">{u.fullName || u.name}</div>
                          <div className="popup-user-bio">{u.bio || ""}</div>
                        </div>
                      </div>
                      <button 
                        className="remove-btn"
                        disabled={actionLoading === u.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          popupType === "following" ? handleUnfollow(u.id) : handleRemoveFollower(u.id);
                        }}
                      >
                        {actionLoading === u.id 
                          ? "..." 
                          : popupType === "following" ? "Unfollow" : "Remove"
                        }
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {openPicPopup && (
          <div className="popup-overlay">
            <div className="popup-image-box">
              <img src={profileImage} alt="Enlarged" />
              <div className="popup-image-actions">
                <button
                  className="change-pic-btn"
                  onClick={() => {
                    setOpenPicPopup(false);
                    fileInputRef.current?.click();
                  }}
                >
                  Change Photo
                </button>
              </div>
              <button className="close-btn" onClick={() => setOpenPicPopup(false)}>
                X
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="popup-overlay">
            <div className="edit-profile-modal">
              <div className="edit-modal-header">
                <h2>Edit profile</h2>
                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                  ×
                </button>
              </div>
              
              {editError && <div className="edit-error">{editError}</div>}
              
              <div className="edit-form">
                <div className="edit-form-group">
                  <label>Display name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your display name"
                  />
                </div>

                <div className="edit-form-group">
                  <label>Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself"
                    rows={3}
                  />
                </div>

                <div className="edit-form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </div>

                {/* Business fields - only shown for business accounts */}
                {user.accountType === "BUSINESS" && (
                  <>
                    <div className="business-section-divider">
                      <span>Business Details</span>
                    </div>
                    
                    <div className="edit-form-group">
                      <label>Business Name</label>
                      <input
                        type="text"
                        value={editForm.businessName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your business name"
                      />
                    </div>

                    <div className="edit-form-group">
                      <label>Website URL</label>
                      <input
                        type="url"
                        value={editForm.websiteUrl}
                        onChange={(e) => setEditForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="https://yourbusiness.com"
                      />
                    </div>

                    <div className="edit-form-group">
                      <label>Business Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your business"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="edit-form-info">
                  <p>Email and username cannot be changed</p>
                </div>

                <div className="edit-form-actions">
                  <button 
                    className="edit-cancel-btn"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="edit-save-btn"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;