
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import "./CreatePin.css";
import { useAppSelector } from "./store/hooks";

type Board = {
    id: number;
    title: string;
    coverImageUrl?: string;
};

const API_BASE_URL = "http://localhost:8765";
const PLACEHOLDER_BOARD = "/assets/images/nine.jpg";
const TOPIC_OPTIONS: string[] = [
    "Travel",
    "Food",
    "Fitness",
    "Technology",
    "Fashion",
    "Photography",
    "DIY",
    "Motivation",
];

const CreatePin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedBoardFromPage: string = location.state?.boardName || "";
    const { userId } = useAppSelector((state) => state.user);

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [link, setLink] = useState("");

    const [showTopics, setShowTopics] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const [showProducts, setShowProducts] = useState(false);
    const [productText, setProductText] = useState("");
    const [products, setProducts] = useState<string[]>([]);

    const [showKeywords, setShowKeywords] = useState(false);
    const [keywordText, setKeywordText] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);

    const [boards, setBoards] = useState<Board[]>([]);
    const [boardsLoading, setBoardsLoading] = useState(false);
    const [boardError, setBoardError] = useState("");
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [showBoardPicker, setShowBoardPicker] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleSelectBoard = (board: Board) => {
        setSelectedBoard(board);
        setShowBoardPicker(false);
    };

    const addProduct = () => {
        if (!productText.trim()) {
            return;
        }
        setProducts((prev) => [...prev, productText.trim()]);
        setProductText("");
    };

    const deleteProduct = (index: number) => {
        setProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const addKeywords = () => {
        if (!keywordText.trim()) {
            return;
        }
        setKeywords((prev) => [...prev, keywordText.trim()]);
        setKeywordText("");
    };

    const deleteKeyword = (index: number) => {
        setKeywords((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchBoards = async () => {
            setBoardsLoading(true);
            setBoardError("");

            try {
                const { data } = await axios.get<Board[]>(`${API_BASE_URL}/board/users/${userId}/boards`);
                setBoards(data ?? []);
            } catch (error) {
                setBoardError("Unable to load boards. Please try again later.");
            } finally {
                setBoardsLoading(false);
            }
        };

        fetchBoards();
    }, [userId]);

    useEffect(() => {
        if (!selectedBoard && selectedBoardFromPage && boards.length) {
            const found = boards.find((board) => board.title === selectedBoardFromPage);
            if (found) {
                setSelectedBoard(found);
            }
        }
    }, [selectedBoardFromPage, boards, selectedBoard]);

    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const canCreatePin = Boolean(title.trim() && coverImage && userId);

    const handleCreatePin = async () => {
        if (!canCreatePin || !userId || !coverImage) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const formData = new FormData();
            const payload: Record<string, unknown> = {
                title: title.trim(),
                description: desc.trim(),
                sourceUrl: link.trim(),
                keywords: keywords.join(","),
                tags: selectedTopics.join(","),
                products,
                isPrivate: false,
                userId,
            };

            if (selectedBoard?.id) {
                payload.boardId = selectedBoard.id;
            }

            formData.append("pin", new Blob([JSON.stringify(payload)], { type: "application/json" }));
            formData.append("file", coverImage);

            await axios.post(`${API_BASE_URL}/pins/createpin`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Pin created successfully");
            navigate("/home");
        } catch (error) {
            setSubmitError("Unable to create pin. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pin-container">
            <header className="pin-header">
                <span className="back" onClick={() => navigate(-1)}>
                    {"<"}
                </span>
                <h3>Create Pin</h3>
            </header>

            {submitError && <div className="pin-error">{submitError}</div>}
            {boardError && <div className="pin-error">{boardError}</div>}

            <div className="cb-cover-box">
                <label className="cb-cover-label">
                    {coverImage ? (
                        <img src={URL.createObjectURL(coverImage)} alt="Cover" className="cb-cover-preview" />
                    ) : (
                        <span className="cb-cover-text">Upload Image</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="cb-hidden-input" />
                </label>
            </div>

            <div className="form-section">
                <div className="input-box">
                    <label>Title</label>
                    <textarea
                        placeholder="Tell everyone what your Pin is about"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <span className="count">{title.length}/100</span>
                </div>

                <div className="input-box">
                    <label>Description</label>
                    <textarea
                        placeholder="Add a description, mention, or hashtags to your Pin."
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>

                <div className="input-box">
                    <label>Link</label>
                    <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>

                <div className="section-row" onClick={() => setShowBoardPicker((prev) => !prev)}>
                    <span>Pick a board</span>
                    <span className="right">
                        {selectedBoard ? selectedBoard.title : boardsLoading ? "Loading..." : "Select"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#767676" style={{ marginLeft: 8 }}>
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                    </span>
                </div>

                {showBoardPicker && (
                    <div className="board-picker-dropdown">
                        <div className="board-picker-header">
                            <span>Your boards</span>
                            <button className="create-new-board-btn" onClick={() => navigate("/create-board")}>
                                + Create board
                            </button>
                        </div>
                        <div className="board-picker-list">
                            {boards.map((board) => (
                                <div
                                    key={board.id}
                                    className={`board-picker-item ${selectedBoard?.id === board.id ? "selected" : ""}`}
                                    onClick={() => handleSelectBoard(board)}
                                >
                                    <img src={board.coverImageUrl || PLACEHOLDER_BOARD} alt={board.title} className="board-picker-img" />
                                    <span className="board-picker-title">{board.title}</span>
                                    {selectedBoard?.id === board.id && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#e60023" className="board-picker-check">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                            {!boards.length && !boardsLoading && <p>You have no boards yet.</p>}
                        </div>
                    </div>
                )}

                {selectedBoardFromPage && !selectedBoard && (
                    <div className="selected-board-display">{selectedBoardFromPage}</div>
                )}

                <div className="section-row" onClick={() => setShowTopics((prev) => !prev)}>
                    <span>Tag related topics</span>
                    <span className="right" />
                </div>

                {showTopics && (
                    <div className="topics-dropdown">
                        {TOPIC_OPTIONS.map((topic) => (
                            <div key={topic} className="topic-option" onClick={() => toggleTopic(topic)}>
                                {topic}
                            </div>
                        ))}
                        <div className="chip-container">
                            {selectedTopics.map((topic) => (
                                <div key={topic} className="chip">
                                    <span>{topic}</span>
                                    <span className="chip-close" onClick={() => toggleTopic(topic)}>
                                        x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="section-row" onClick={() => setShowProducts((prev) => !prev)}>
                    <span>Tag products</span>
                    <span className="right" />
                </div>

                {showProducts && (
                    <div className="product-box">
                        <div className="product-input-area">
                            <input
                                className="product-search"
                                type="text"
                                placeholder="Search products"
                                value={productText}
                                onChange={(e) => setProductText(e.target.value)}
                            />
                            <button className="add-btn" onClick={addProduct}>
                                Add
                            </button>
                        </div>
                        <div className="chip-container">
                            {products.map((product, index) => (
                                <div key={`${product}-${index}`} className="chip">
                                    <span>{product}</span>
                                    <span className="chip-close" onClick={() => deleteProduct(index)}>
                                        x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="section-row" onClick={() => setShowKeywords((prev) => !prev)}>
                    <span>Keywords</span>
                    <span className="right" />
                </div>

                {showKeywords && (
                    <div className="product-box">
                        <div className="product-input-area">
                            <input
                                className="product-search"
                                type="text"
                                placeholder="Search keywords"
                                value={keywordText}
                                onChange={(e) => setKeywordText(e.target.value)}
                            />
                            <button className="add-btn" onClick={addKeywords}>
                                Add
                            </button>
                        </div>
                        <div className="chip-container">
                            {keywords.map((keyword, index) => (
                                <div key={`${keyword}-${index}`} className="chip">
                                    <span>{keyword}</span>
                                    <span className="chip-close" onClick={() => deleteKeyword(index)}>
                                        x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <footer className="pin-footer">
                <div className="bottom-btns">
                    <button className="btn icon" type="button">
                        File
                    </button>
                    <button className="btn icon" type="button">
                        Download
                    </button>
                </div>
                <button className="btn create" onClick={handleCreatePin} disabled={!canCreatePin || isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </footer>
        </div>
    );
};

export default CreatePin;