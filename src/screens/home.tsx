
import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './home.css';

import TopNav from "../components/global/TopNav";
import { mapMediaPath } from "../utils/userMapper";
import { useAppSelector } from "../store/hooks";

const API_BASE_URL = "http://localhost:8765";

interface PinData {
    id: number;
    title?: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    userId?: number;
    userName?: string;
    userFullname?: string;
    userProfilePath?: string;
    boardId?: number;
    boardTitle?: string;
}

const Home: FC = () => {

    const navigate = useNavigate();
    
    // Get user ID from Redux store
    const user = useAppSelector((state) => state.user);
    const userId = user.userId;

    const [pins, setPins] = useState<PinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBoard, setSelectedBoard] = useState("All");
    const [savedPins, setSavedPins] = useState<Set<number>>(new Set());
    const [savingPins, setSavingPins] = useState<Set<number>>(new Set());
    const [userBoards, setUserBoards] = useState<string[]>([]);

    // Fetch pins from API
    useEffect(() => {
        const fetchPins = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get<PinData[]>(`${API_BASE_URL}/pins/feed`);
                console.log("Fetched pins:", response.data);
                setPins(response.data || []);
            } catch (err) {
                console.error("Error fetching pins:", err);
                setError("Failed to load pins");
            } finally {
                setLoading(false);
            }
        };

        fetchPins();
    }, []);

    // Fetch user's boards for filter
    useEffect(() => {
        const fetchUserBoards = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/board/users/${userId}/boards`);
                const boardTitles = response.data.map((board: any) => board.title);
                setUserBoards(boardTitles);
            } catch (err) {
                console.error("Error fetching user boards:", err);
            }
        };

        fetchUserBoards();
    }, [userId]);

    // Use only user's boards for filter (not all boards from all pins)
    const boards = ["All", ...userBoards];

    // Filter pins by selected board
    const filteredPins = selectedBoard === "All" 
        ? pins 
        : pins.filter(p => p.boardTitle === selectedBoard);

    const handleBoardSelect = (board: string) => {
        setSelectedBoard(board);
    };

    const handlePinClick = (pin: PinData) => {
        const imageUrl = mapMediaPath(pin.imageUrl, API_BASE_URL) || "/assets/images/one.jpg";
        const videoUrl = mapMediaPath(pin.videoUrl, API_BASE_URL) || undefined;
        
        navigate("/viewpin", {
            state: {
                pin: {
                    id: pin.id,
                    image: imageUrl,
                    videoUrl: videoUrl,
                    title: pin.title || "Untitled Pin",
                    description: pin.description || "Discover amazing content on Pinterest.",
                    userId: pin.userId,
                    userName: pin.userName,
                    userFullname: pin.userFullname,
                    userProfilePath: pin.userProfilePath,
                    boardTitle: pin.boardTitle,
                }
            }
        });
    };

    // Get display image for a pin
    const getPinImage = (pin: PinData): string => {
        return mapMediaPath(pin.imageUrl, API_BASE_URL) || 
               mapMediaPath(pin.videoUrl, API_BASE_URL) || 
               "/assets/images/one.jpg";
    };

    // Check if pin has video
    const isVideoPin = (pin: PinData): boolean => {
        return Boolean(pin.videoUrl && !pin.imageUrl);
    };

    // Get video URL for a pin
    const getPinVideo = (pin: PinData): string => {
        return mapMediaPath(pin.videoUrl, API_BASE_URL) || "";
    };

    // Fetch saved pins status on mount
    useEffect(() => {
        if (userId) {
            const checkSavedPins = async () => {
                try {
                    const savedSet = new Set<number>();
                    for (const pin of pins) {
                        const res = await axios.get(`${API_BASE_URL}/api/pins/isSaved`, {
                            params: { userId, pinId: pin.id }
                        });
                        if (res.data === true) {
                            savedSet.add(pin.id);
                        }
                    }
                    setSavedPins(savedSet);
                } catch (err) {
                    console.error("Error checking saved pins:", err);
                }
            };
            if (pins.length > 0) {
                checkSavedPins();
            }
        }
    }, [userId, pins]);

    // Handle save pin
    const handleSavePin = async (e: React.MouseEvent, pinId: number) => {
        e.stopPropagation();
        
        if (!userId) {
            alert("Please login to save pins");
            navigate("/login");
            return;
        }

        if (savingPins.has(pinId) || savedPins.has(pinId)) {
            return;
        }

        setSavingPins(prev => new Set(prev).add(pinId));
        try {
            await axios.post(`${API_BASE_URL}/api/pins/save`, null, {
                params: { userId, pinId }
            });
            setSavedPins(prev => new Set(prev).add(pinId));
        } catch (error) {
            console.error("Error saving pin:", error);
        } finally {
            setSavingPins(prev => {
                const newSet = new Set(prev);
                newSet.delete(pinId);
                return newSet;
            });
        }
    };

    return (
        <>
            <TopNav/>

            <div className="home-board-filter">
                <div className="home-board-filter-scroll">
                    {boards.map((board) => (
                        <button
                            key={board}
                            className={`home-board-chip ${selectedBoard === board ? 'active' : ''}`}
                            onClick={() => handleBoardSelect(board)}
                        >
                            {board}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="home-loading">
                    <p>Loading pins...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="home-error">
                    <p>{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredPins.length === 0 && (
                <div className="home-empty">
                    <p>No pins available yet. Be the first to create one!</p>
                </div>
            )}

            {/* Pins Grid */}
            {!loading && !error && filteredPins.length > 0 && (
                <div className="home-masonry-container">
                    {filteredPins.map((pin, index) => (
                        <div key={pin.id} className="home-pin-card">
                            <div className="home-pin-wrapper" onClick={() => handlePinClick(pin)}>
                                {isVideoPin(pin) ? (
                                    <video 
                                        className="home-pin-image home-pin-video"
                                        src={getPinVideo(pin)} 
                                        muted
                                        loop
                                        playsInline
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                    />
                                ) : (
                                    <img 
                                        className="home-pin-image"
                                        src={getPinImage(pin)} 
                                        alt={pin.title || `Pin ${index + 1}`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target.src !== "/assets/images/one.jpg") {
                                                console.error("Image failed to load:", getPinImage(pin));
                                                target.src = "/assets/images/one.jpg";
                                            }
                                        }}
                                    />
                                )}

                                <div className="home-pin-overlay">
                                    <button 
                                        className={`home-btn-save ${savedPins.has(pin.id) ? 'saved' : ''}`}
                                        onClick={(e) => handleSavePin(e, pin.id)}
                                        disabled={savingPins.has(pin.id) || savedPins.has(pin.id)}
                                    >
                                        {savedPins.has(pin.id) ? 'Saved' : savingPins.has(pin.id) ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Home;