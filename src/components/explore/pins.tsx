import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./explore.css";
import { mapMediaPath } from "../../utils/userMapper";
import { useAppSelector } from "../../store/hooks";

const API_BASE_URL = "http://localhost:8765";

interface PinData {
    id: number;
    title?: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    userId?: number;
    userName?: string;
    userProfilePath?: string;
}

const getImageSrc = (pin: PinData): string => {
    const path = pin.imageUrl || pin.videoUrl;
    return mapMediaPath(path, API_BASE_URL) || "/assets/images/one.jpg";
};

interface ExplorePinsProps {
    selectedCategory: string | null;
}

const Explorepins: React.FC<ExplorePinsProps> = ({ selectedCategory }) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const userId = user.userId;
    
    const [pins, setPins] = useState<PinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedPins, setSavedPins] = useState<Set<number>>(new Set());
    const [savingPins, setSavingPins] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchPins = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE_URL}/pins/feed`;
                if (selectedCategory) {
                    url = `${API_BASE_URL}/pins/category/${encodeURIComponent(selectedCategory)}`;
                }
                const { data } = await axios.get<PinData[]>(url);
                setPins(data ?? []);
            } catch (error) {
                console.error("Failed to fetch pins:", error);
                setPins([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPins();
    }, [selectedCategory]);

    // Check saved pins status when pins load
    useEffect(() => {
        if (userId && pins.length > 0) {
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
            checkSavedPins();
        }
    }, [userId, pins]);

    // Handle save pin
    const handleSavePin = async (e: React.MouseEvent, pinId: number) => {
        e.stopPropagation();
        
        if (!userId) {
            alert("Please login to save pins");
            navigate("/");
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

    const handlePinClick = (pinId: number) => {
        navigate(`/pin/${pinId}`);
    };

    const title = selectedCategory 
        ? `Pins in "${selectedCategory}"` 
        : "What's new on Pinterest";

    if (loading) {
        return (
            <div className="explore-pins-section">
                <h3 className="explore-pins-title">{title}</h3>
                <div className="text-center py-4">Loading pins...</div>
            </div>
        );
    }

    if (pins.length === 0) {
        return (
            <div className="explore-pins-section">
                <h3 className="explore-pins-title">{title}</h3>
                <div className="explore-no-pins">
                    <p>No pins found{selectedCategory ? ` in "${selectedCategory}"` : ""}.</p>
                    {selectedCategory && <p>Try selecting a different category or create new pins with this topic!</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="explore-pins-section">
            <h3 className="explore-pins-title">{title}</h3>

            <div className="explore-masonry-container">
                {pins.map((pin, index) => (
                    <div key={pin.id} className="explore-pin-card">
                        <div className="explore-pin-wrapper">
                            <img
                                className="explore-pin-image"
                                src={getImageSrc(pin)}
                                alt={pin.title || `Pin ${index + 1}`}
                                onClick={() => handlePinClick(pin.id)}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/assets/images/one.jpg";
                                }}
                            />
                            <div className="explore-pin-overlay">
                                <button 
                                    className={`explore-btn-save ${savedPins.has(pin.id) ? 'saved' : ''}`}
                                    onClick={(e) => handleSavePin(e, pin.id)}
                                    disabled={savingPins.has(pin.id) || savedPins.has(pin.id)}
                                >
                                    {savedPins.has(pin.id) ? 'Saved' : savingPins.has(pin.id) ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        {pin.title && (
                            <div className="explore-pin-info">
                                <p className="explore-pin-title">{pin.title}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explorepins;
