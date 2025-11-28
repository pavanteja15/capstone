
import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


 

import './home.css';

import TopNav from "../components/global/TopNav";
import { mapMediaPath } from "../utils/userMapper";

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

interface MenuPosition {
    top: number;
    left: number;
}

const Home: FC = () => {

    const navigate = useNavigate();

    const [pins, setPins] = useState<PinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBoard, setSelectedBoard] = useState("All");
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });

    // Fetch pins from API
    useEffect(() => {
        const fetchPins = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get<PinData[]>(`${API_BASE_URL}/pins/feed`);
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

    // Get unique board titles for filter
    const boardTitles = Array.from(new Set(pins.filter(p => p.boardTitle).map(p => p.boardTitle!)));
    const boards = ["All", ...boardTitles];

    // Filter pins by selected board
    const filteredPins = selectedBoard === "All" 
        ? pins 
        : pins.filter(p => p.boardTitle === selectedBoard);

    const handleBoardSelect = (board: string) => {
        setSelectedBoard(board);
    };

    const handlePinClick = (pin: PinData) => {
        const imageUrl = mapMediaPath(pin.imageUrl, API_BASE_URL) || 
                         mapMediaPath(pin.videoUrl, API_BASE_URL) || 
                         "/assets/images/one.jpg";
        
        navigate("/viewpin", {
            state: {
                pin: {
                    id: pin.id,
                    image: imageUrl,
                    title: pin.title || "Untitled Pin",
                    description: pin.description || "Discover amazing content on Pinterest.",
                    userId: pin.userId,
                    userName: pin.userName,
                    userFullname: pin.userFullname,
                    userProfilePath: pin.userProfilePath,
                }
            }
        });
    };

    
    const handleMenuToggle = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            const button = e.currentTarget as HTMLButtonElement;
            const rect = button.getBoundingClientRect();
            
            const menuHeight = 250;
            const spaceBelow = window.innerHeight - rect.bottom;
            
            let top: number;
            if (spaceBelow < menuHeight) {
                top = rect.top - menuHeight;
            } else {
                top = rect.bottom + 8;
            }
            
            let left = rect.right - 280;
            if (left < 10) left = 10;
            
            setMenuPosition({ top, left });
            setActiveMenuIndex(index);
        }
    };

    const handleMenuClose = () => {
        setActiveMenuIndex(null);
    };

    // Get display image for a pin
    const getPinImage = (pin: PinData): string => {
        return mapMediaPath(pin.imageUrl, API_BASE_URL) || 
               mapMediaPath(pin.videoUrl, API_BASE_URL) || 
               "/assets/images/one.jpg";
    };


 

        return(

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

            {/* Overlay to close menu when clicking outside */}
            {activeMenuIndex !== null && (
                <div className="home-menu-backdrop" onClick={handleMenuClose}></div>
            )}

            {/* Pin Menu Popup - Rendered outside the masonry grid */}
            {activeMenuIndex !== null && (
                <div 
                    className="home-pin-menu"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <div className="home-pin-menu-header">
                        This Pin was inspired by your recent activity
                    </div>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>See more like this</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            <line x1="4" y1="4" x2="20" y2="20"/>
                        </svg>
                        <span>See less like this</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span>Download image</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                        <span>Report Pin</span>
                    </button>
                </div>
            )}

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
                                <img 
                                    className="home-pin-image"
                                    src={getPinImage(pin)} 
                                    alt={pin.title || `Pin ${index + 1}`}
                                />

                                <div className="home-pin-overlay">
                                    <button className="home-btn-save" onClick={(e) => e.stopPropagation()}>Save</button>

                                    <div className="home-right-buttons">
                                        <button className="home-btn-icon" onClick={(e) => e.stopPropagation()}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M21 5V3h-2v2H5V3H3v2H1v2h2v12h8v2h-2v2h2v-2h4v2h2v-2h-2v-2h8V7h2V5h-2zM5 17V7h14v10H5z"/>
                                            </svg>
                                        </button>

                                        <button 
                                            className="home-btn-icon"
                                            onClick={(e) => { e.stopPropagation(); handleMenuToggle(index, e); }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm18 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Pin Title Overlay */}
                                {pin.title && (
                                    <div className="home-pin-title-overlay">
                                        <span className="home-pin-title">{pin.title}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </>

    )

}


 

export default Home;