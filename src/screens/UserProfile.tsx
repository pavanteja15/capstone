import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const handlePopupOpen = useCallback((title: string, list: UserSummary[], type: "followers" | "following") => {
    setPopupTitle(title);
    setPopupList(list);
    setPopupType(type);
    setOpenPopup(true);
  }, []);

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

  const profileName = user.fullname || user.name || "Pinterest user";
  const username = user.name ? `@${user.name}` : "";
  const profileImage = useMemo(
    () => mapMediaPath(user.profilePath, API_BASE_URL) ?? FALLBACK_AVATAR,
    [user.profilePath]
  );

  const renderError = error ? <div className="profile-error">{error}</div> : null;

  return (
    <>
      <TopNav />

      <div className="profile-wrapper">
        <div className="center-content">
          {renderError}

          <img
            src={profileImage}
            alt="Profile"
            className="profile-pic"
            onClick={() => setOpenPicPopup(true)}
          />

          <h2 className="profile-name">{profileName}</h2>
          {username && <p className="username">{username}</p>}
          {user.bio && <p className="profile-bio">{user.bio}</p>}

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
            <button className="profile-btn" onClick={() => navigate("/settings/profile")}>Edit profile</button>
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
              />
            )}
            {selectedTab === "pins" && (
              <PinsList
                pins={pins}
                isLoading={loading}
                onCreatePin={() => navigate("/create-pin")}
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
                      <div className="popup-user-info">
                        <img
                          src={u.profilePicUrl ?? FALLBACK_AVATAR}
                          alt={u.fullName || u.name}
                          className="popup-user-pic"
                        />
                        <div className="popup-user-details">
                          <div className="popup-user-name">{u.fullName || u.name}</div>
                          <div className="popup-user-bio">{u.bio || ""}</div>
                        </div>
                      </div>
                      <button className="remove-btn">
                        {popupType === "following" ? "Unfollow" : "Remove"}
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
              <button className="close-btn" onClick={() => setOpenPicPopup(false)}>
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;