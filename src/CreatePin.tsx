import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import "./CreatePin.css";
import { useAppSelector } from "./store/hooks";
import { mapMediaPath } from "./utils/userMapper";

type Board = {
	id: number;
	title: string;
	coverImageUrl?: string;
};

type PinDetails = {
	id?: number;
	title?: string;
	description?: string;
	imageUrl?: string;
	videoUrl?: string;
	sourceUrl?: string;
	keywords?: string;
	topics?: string;
	productTags?: string;
	attribution?: string;
	boardId?: number;
	status?: "DRAFT" | "PUBLISHED";
	isPrivate?: boolean;
};

type MediaSource = "upload" | "link";
type MediaKind = "image" | "video";

const API_BASE_URL = "http://localhost:8765";
const PLACEHOLDER_BOARD = "/assets/images/nine.jpg";
const PLACEHOLDER_PIN = "/assets/images/one.jpg";
const TOPIC_OPTIONS: string[] = ["Travel", "Food", "Fitness", "Technology", "Fashion", "Photography", "DIY", "Motivation"];

const sanitizeList = (value?: string | null) => {
	if (!value) {
		return [];
	}
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
};

const withMediaPath = (path?: string | null) => (path ? mapMediaPath(path) : undefined);

const CreatePin: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const selectedBoardFromPage: string = location.state?.boardName || "";
	const editingPinId: number | undefined = location.state?.pinId;
	const editingPinFromState: PinDetails | undefined = location.state?.pin;
	const { userId } = useAppSelector((state) => state.user);

	const [boards, setBoards] = useState<Board[]>([]);
	const [boardsLoading, setBoardsLoading] = useState(false);
	const [boardError, setBoardError] = useState("");
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
	const [pendingBoardId, setPendingBoardId] = useState<number | null>(null);
	const [showBoardPicker, setShowBoardPicker] = useState(false);

	const [mediaSource, setMediaSource] = useState<MediaSource>("upload");
	const [mediaKind, setMediaKind] = useState<MediaKind>("image");
	const [mediaFile, setMediaFile] = useState<File | null>(null);
	const [mediaUrlInput, setMediaUrlInput] = useState<string>("");
	const [mediaPreview, setMediaPreview] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		sourceUrl: "",
		attribution: "",
	});
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string[]>([]);
	const [keywordText, setKeywordText] = useState("");
	const [productTags, setProductTags] = useState<string[]>([]);
	const [productText, setProductText] = useState("");
	const [showTopics, setShowTopics] = useState(false);
	const [showProducts, setShowProducts] = useState(false);
	const [showKeywords, setShowKeywords] = useState(false);

	const [isPrivate, setIsPrivate] = useState(false);
	const [pinStatus, setPinStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"create" | "drafts">("create");
	const [draftPins, setDraftPins] = useState<PinDetails[]>([]);
	const [pinInEdit, setPinInEdit] = useState<PinDetails | null>(null);
	const [pinPendingDelete, setPinPendingDelete] = useState<PinDetails | null>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const hydrateFromPin = useCallback((pin: PinDetails) => {
		setPinInEdit(pin);
		setFormData({
			title: pin.title ?? "",
			description: pin.description ?? "",
			sourceUrl: pin.sourceUrl ?? "",
			attribution: pin.attribution ?? "",
		});
		setSelectedTopics(sanitizeList(pin.topics));
		setKeywords(sanitizeList(pin.keywords));
		setProductTags(sanitizeList(pin.productTags));
		setIsPrivate(Boolean(pin.isPrivate));
		setPinStatus(pin.status ?? "PUBLISHED");
		setPendingBoardId(pin.boardId ?? null);
		setMediaFile(null);

		if (pin.videoUrl) {
			const videoPath = withMediaPath(pin.videoUrl) ?? "";
			setMediaSource("link");
			setMediaKind("video");
			setMediaUrlInput(videoPath);
			setMediaPreview(videoPath || null);
		} else if (pin.imageUrl) {
			const imagePath = withMediaPath(pin.imageUrl) ?? "";
			setMediaSource("link");
			setMediaKind("image");
			setMediaUrlInput(imagePath);
			setMediaPreview(imagePath || null);
		} else {
			setMediaSource("upload");
			setMediaUrlInput("");
			setMediaPreview(null);
		}
	}, []);

	const refreshDrafts = useCallback(async () => {
		if (!userId) {
			return;
		}
		try {
			const { data } = await axios.get<PinDetails[]>(`${API_BASE_URL}/pins/users/${userId}/pins`, {
				params: { status: "DRAFT" },
			});
			setDraftPins(
				(data ?? []).map((pin) => ({
					...pin,
					imageUrl: withMediaPath(pin.imageUrl),
					videoUrl: withMediaPath(pin.videoUrl),
				}))
			);
		} catch (error) {
			// ignore draft refresh failure
		}
	}, [userId]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		const fetchBoards = async () => {
			setBoardsLoading(true);
			setBoardError("");
			try {
				const { data } = await axios.get<Board[]>(`${API_BASE_URL}/board/users/${userId}/boards`);
				const normalized = (data ?? []).map((board) => ({
					...board,
					coverImageUrl: withMediaPath(board.coverImageUrl) ?? PLACEHOLDER_BOARD,
				}));
				setBoards(normalized);
			} catch (error) {
				setBoardError("Unable to load boards. Please try again later.");
			} finally {
				setBoardsLoading(false);
			}
		};

		fetchBoards();
		refreshDrafts();
	}, [refreshDrafts, userId]);

	useEffect(() => {
		if (editingPinFromState) {
			hydrateFromPin(editingPinFromState);
		}
	}, [editingPinFromState, hydrateFromPin]);

	useEffect(() => {
		if (!editingPinId) {
			return;
		}

		const fetchPinForEdit = async () => {
			try {
				const { data } = await axios.get<PinDetails>(`${API_BASE_URL}/pins/${editingPinId}`);
				hydrateFromPin({
					...data,
					imageUrl: withMediaPath(data.imageUrl),
					videoUrl: withMediaPath(data.videoUrl),
				});
			} catch (error) {
				setSubmitError("Unable to load pin. Please try again later.");
			}
		};

		fetchPinForEdit();
	}, [editingPinId, hydrateFromPin]);

	useEffect(() => {
		if (!boards.length) {
			return;
		}

		if (pendingBoardId) {
			const boardMatch = boards.find((board) => board.id === pendingBoardId);
			if (boardMatch) {
				setSelectedBoard(boardMatch);
				setPendingBoardId(null);
				return;
			}
		}

		if (selectedBoardFromPage && !selectedBoard) {
			const fromLink = boards.find(
				(board) => board.title.toLowerCase() === selectedBoardFromPage.toLowerCase()
			);
			if (fromLink) {
				setSelectedBoard(fromLink);
			}
		}
	}, [boards, pendingBoardId, selectedBoardFromPage, selectedBoard]);

	useEffect(() => {
		if (mediaSource === "upload") {
			if (mediaFile) {
				const previewUrl = URL.createObjectURL(mediaFile);
				setMediaPreview(previewUrl);
				return () => URL.revokeObjectURL(previewUrl);
			}
			setMediaPreview(null);
			return;
		}

		if (mediaUrlInput.trim()) {
			setMediaPreview(mediaUrlInput.trim());
		} else {
			setMediaPreview(null);
		}
	}, [mediaFile, mediaSource, mediaUrlInput]);


	const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || !event.target.files[0]) {
			return;
		}
		setMediaSource("upload");
		setMediaFile(event.target.files[0]);
		setMediaUrlInput("");
	};

	const handleBoardSelect = (board: Board) => {
		setSelectedBoard(board);
		setShowBoardPicker(false);
	};

	const toggleTopic = (topic: string) => {
		setSelectedTopics((prev) =>
			prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
		);
	};

	const addKeyword = () => {
		if (!keywordText.trim()) {
			return;
		}
		setKeywords((prev) => [...prev, keywordText.trim()]);
		setKeywordText("");
	};

	const removeKeyword = (index: number) => {
		setKeywords((prev) => prev.filter((_, idx) => idx !== index));
	};

	const addProductTag = () => {
		if (!productText.trim()) {
			return;
		}
		setProductTags((prev) => [...prev, productText.trim()]);
		setProductText("");
	};

	const removeProductTag = (index: number) => {
		setProductTags((prev) => prev.filter((_, idx) => idx !== index));
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			sourceUrl: "",
			attribution: "",
		});
		setMediaSource("upload");
		setMediaKind("image");
		setMediaFile(null);
		setMediaUrlInput("");
		setMediaPreview(null);
		setSelectedTopics([]);
		setKeywords([]);
		setProductTags([]);
		setKeywordText("");
		setProductText("");
		setIsPrivate(false);
		setPinStatus("PUBLISHED");
		setSelectedBoard(null);
		setPinInEdit(null);
	};

	const buildPayload = (nextStatus: "DRAFT" | "PUBLISHED") => {
		if (!userId) {
			throw new Error("User not authenticated");
		}

		const payload: Record<string, unknown> = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			sourceUrl: formData.sourceUrl.trim(),
			attribution: formData.attribution.trim(),
			keywords: keywords.join(","),
			topics: selectedTopics.join(","),
			productTags: productTags.join(","),
			isPrivate,
			mediaType: mediaKind,
			status: nextStatus,
			draft: nextStatus === "DRAFT",
			userId,
		};

		if (selectedBoard?.id) {
			payload.boardId = selectedBoard.id;
		} else if (pinInEdit?.boardId) {
			payload.boardId = pinInEdit.boardId;
		}

		if (mediaSource === "link" && mediaUrlInput.trim()) {
			if (mediaKind === "video") {
				payload.videoUrl = mediaUrlInput.trim();
				payload.imageUrl = null;
			} else {
				payload.imageUrl = mediaUrlInput.trim();
				payload.videoUrl = null;
			}
		}

		if (pinInEdit?.id) {
			payload.id = pinInEdit.id;
		}

		return payload;
	};

	const submitPin = async (nextStatus: "DRAFT" | "PUBLISHED") => {
		if (!userId) {
			setSubmitError("Please sign in again to continue.");
			return;
		}

		if (!formData.title.trim()) {
			setSubmitError("A title is required to continue.");
			return;
		}

		const hasMedia = mediaSource === "upload" ? Boolean(mediaFile) : Boolean(mediaUrlInput.trim());
		if (!hasMedia && !pinInEdit?.imageUrl && !pinInEdit?.videoUrl) {
			setSubmitError("Add an image or video to continue.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError("");

		try {
			const payload = buildPayload(nextStatus);
			setPinStatus(nextStatus);
			const formPayload = new FormData();
			formPayload.append("pin", new Blob([JSON.stringify(payload)], { type: "application/json" }));
			if (mediaSource === "upload" && mediaFile) {
				formPayload.append("file", mediaFile);
			}

			const config = { headers: { "Content-Type": "multipart/form-data" } };
			if (pinInEdit?.id) {
				await axios.put(`${API_BASE_URL}/pins/${pinInEdit.id}`, formPayload, config);
			} else {
				await axios.post(`${API_BASE_URL}/pins/createpin`, formPayload, config);
			}

			await refreshDrafts();

			if (nextStatus === "PUBLISHED") {
				resetForm();
				navigate("/home");
			} else {
				setActiveTab("drafts");
				resetForm();
			}
		} catch (error) {
			setSubmitError("Unable to save your pin. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

 

	const handleDeletePin = async () => {
		if (!pinPendingDelete?.id) {
			return;
		}
		try {
			await axios.delete(`${API_BASE_URL}/pins/${pinPendingDelete.id}`);
			setPinPendingDelete(null);
			await refreshDrafts();
		} catch (error) {
			setSubmitError("Unable to delete the pin right now.");
		}
	};

	const handleEditDraft = (pin: PinDetails) => {
		hydrateFromPin(pin);
		setActiveTab("create");
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const selectedBoardCover = useMemo(
		() => selectedBoard?.coverImageUrl ?? PLACEHOLDER_BOARD,
		[selectedBoard]
	);

	const hasPreviewMedia = Boolean(mediaPreview || pinInEdit?.imageUrl || pinInEdit?.videoUrl);
	const canPublish = Boolean(formData.title.trim() && hasPreviewMedia);

	return (
		<div className="pin-container">
			<header className="pin-header">
				<span className="back" onClick={() => navigate(-1)}>
					{"<"}
				</span>
				<h3>{pinInEdit ? "Update Pin" : "Create Pin"}</h3>
				<div className="pin-header-actions">
					<button className="btn ghost" onClick={resetForm} type="button">
						Reset
					</button>
					<button className="btn ghost" onClick={() => submitPin("DRAFT")} type="button" disabled={isSubmitting}>
						{pinInEdit && pinStatus === "DRAFT" ? "Update Draft" : "Save Draft"}
					</button>
					<button className="btn ghost" type="button" onClick={() => setIsPreviewOpen(true)} disabled={!mediaPreview && !pinInEdit}>
						Preview
					</button>
					<button className="btn create" onClick={() => submitPin("PUBLISHED")} disabled={!canPublish || isSubmitting}>
						{isSubmitting ? "Saving..." : pinInEdit ? "Publish changes" : "Publish"}
					</button>
				</div>
			</header>

			{submitError && <div className="pin-error">{submitError}</div>}
			{boardError && <div className="pin-error">{boardError}</div>}

			<div className="pin-tabs">
				<button className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>
					Build Pin
				</button>
				<button className={activeTab === "drafts" ? "active" : ""} onClick={() => setActiveTab("drafts")}>
					Drafts ({draftPins.length})
				</button>
			</div>

			{activeTab === "create" ? (
				<div className="pin-builder">
					<section className="pin-media-card">
						<div className="media-type-toggle">
							<label>
								<input
									type="radio"
									name="media-kind"
									checked={mediaKind === "image"}
									onChange={() => setMediaKind("image")}
								/>
								Image
							</label>
							<label>
								<input
									type="radio"
									name="media-kind"
									checked={mediaKind === "video"}
									onChange={() => setMediaKind("video")}
								/>
								Video
							</label>
						</div>

						<div className="media-source-toggle">
							<button
								className={mediaSource === "upload" ? "active" : ""}
								type="button"
								onClick={() => {
									setMediaSource("upload");
									setMediaUrlInput("");
								}}
							>
								Upload file
							</button>
							<button
								className={mediaSource === "link" ? "active" : ""}
								type="button"
								onClick={() => {
									setMediaSource("link");
									setMediaFile(null);
								}}
							>
								Use URL
							</button>
						</div>

						{mediaSource === "upload" ? (
							<label className="cb-cover-label">
								{mediaPreview ? (
									<img src={mediaPreview} alt="Preview" className="cb-cover-preview" />
								) : (
									<span className="cb-cover-text">Click to upload your {mediaKind}</span>
								)}
								<input type="file" accept={mediaKind === "image" ? "image/*" : "video/*"} onChange={handleMediaUpload} className="cb-hidden-input" />
							</label>
						) : (
							<div className="input-box">
								<label>{mediaKind === "video" ? "Video URL" : "Image URL"}</label>
								<input
									value={mediaUrlInput}
									placeholder="https://example.com/media"
									onChange={(e) => setMediaUrlInput(e.target.value)}
								/>
							</div>
						)}

						{mediaPreview && (
							<div className="pin-preview-mini">
								{mediaKind === "video" ? (
									<video src={mediaPreview} controls />
								) : (
									<img src={mediaPreview} alt="Preview" />
								)}
							</div>
						)}
					</section>

					<section className="form-section">
						<div className="input-box">
							<label>Title</label>
							<textarea
								placeholder="Tell everyone what your Pin is about"
								maxLength={100}
								value={formData.title}
								onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
							/>
							<span className="count">{formData.title.length}/100</span>
						</div>

						<div className="input-box">
							<label>Description</label>
							<textarea
								placeholder="Add a description, mentions, or hashtags"
								value={formData.description}
								onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
							/>
						</div>

						<div className="input-box">
							<label>Destination link</label>
							<input
								type="text"
								placeholder="https://your-site.com"
								value={formData.sourceUrl}
								onChange={(e) => setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
							/>
						</div>

						<div className="input-box">
							<label>Attribution</label>
							<input
								type="text"
								placeholder="Credit collaborators or sources"
								value={formData.attribution}
								onChange={(e) => setFormData((prev) => ({ ...prev, attribution: e.target.value }))}
							/>
						</div>

						<div className="input-box">
							<label>Privacy</label>
							<div className="privacy-toggle">
								<span>{isPrivate ? "Private" : "Public"}</span>
								<label className="switch">
									<input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
									<span className="slider" />
								</label>
							</div>
						</div>

						<div className="section-row" onClick={() => setShowBoardPicker((prev) => !prev)}>
							<span>Pick a board</span>
							<span className="right">{selectedBoard ? selectedBoard.title : boardsLoading ? "Loading..." : "Select"}</span>
						</div>

						{showBoardPicker && (
							<div className="board-picker-dropdown">
								<div className="board-picker-header">
									<span>Your boards</span>
									<button className="create-new-board-btn" onClick={() => navigate("/create-board")}>+ Create board</button>
								</div>
								<div className="board-picker-list">
									{boards.map((board) => (
										<div
											key={board.id}
											className={`board-picker-item ${selectedBoard?.id === board.id ? "selected" : ""}`}
											onClick={() => handleBoardSelect(board)}
										>
											<img src={board.coverImageUrl || PLACEHOLDER_BOARD} alt={board.title} className="board-picker-img" />
											<div>
												<p className="board-picker-title">{board.title}</p>
											</div>
										</div>
									))}
									{!boards.length && !boardsLoading && <p>You have no boards yet.</p>}
								</div>
							</div>
						)}

						{selectedBoard && (
							<div className="selected-board-card">
								<img src={selectedBoardCover} alt={selectedBoard.title} />
								<div>
									<p className="board-name">{selectedBoard.title}</p>
									<p className="board-meta">Pinned content will be saved here.</p>
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
										placeholder="Add keywords"
										value={keywordText}
										onChange={(e) => setKeywordText(e.target.value)}
									/>
									<button className="add-btn" onClick={addKeyword}>
										Add
									</button>
								</div>
								<div className="chip-container">
									{keywords.map((keyword, index) => (
										<div key={`${keyword}-${index}`} className="chip">
											<span>{keyword}</span>
											<span className="chip-close" onClick={() => removeKeyword(index)}>
												x
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="section-row" onClick={() => setShowTopics((prev) => !prev)}>
							<span>Tag related topics</span>
							<span className="right" />
						</div>

						{showTopics && (
							<div className="topics-dropdown">
								{TOPIC_OPTIONS.map((topic) => (
									<div key={topic} className={`topic-option ${selectedTopics.includes(topic) ? "selected" : ""}`} onClick={() => toggleTopic(topic)}>
										{topic}
									</div>
								))}
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
										placeholder="Add product tags"
										value={productText}
										onChange={(e) => setProductText(e.target.value)}
									/>
									<button className="add-btn" onClick={addProductTag}>
										Add
									</button>
								</div>
								<div className="chip-container">
									{productTags.map((product, index) => (
										<div key={`${product}-${index}`} className="chip">
											<span>{product}</span>
											<span className="chip-close" onClick={() => removeProductTag(index)}>
												x
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</section>
				</div>
			) : (
				<section className="drafts-section">
					{draftPins.length ? (
						<div className="draft-grid">
							{draftPins.map((pin, index) => (
								<article key={pin.id ?? `draft-${index}`} className="draft-card">
									<img src={pin.imageUrl || pin.videoUrl || PLACEHOLDER_PIN} alt={pin.title || "Pin draft"} />
									<div className="draft-card-body">
										<h4>{pin.title || "Untitled pin"}</h4>
										<p>{pin.description || "No description"}</p>
										<div className="draft-card-actions">
											<button onClick={() => handleEditDraft(pin)}>Open</button>
											<button className="danger" onClick={() => setPinPendingDelete(pin)}>Delete</button>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						<p>You do not have any drafts yet.</p>
					)}
				</section>
			)}

			{isPreviewOpen && (
				<div className="pin-preview-modal">
					<div className="pin-preview-content">
						<button className="close" onClick={() => setIsPreviewOpen(false)}>
							×
						</button>
						<div className="preview-media">
							{mediaKind === "video" ? (
								<video src={mediaPreview || pinInEdit?.videoUrl || ""} controls />
							) : (
								<img src={mediaPreview || pinInEdit?.imageUrl || PLACEHOLDER_PIN} alt={formData.title || "Preview"} />
							)}
						</div>
						<div className="preview-details">
							<h3>{formData.title || "Untitled"}</h3>
							<p>{formData.description || "No description added yet."}</p>
							{selectedBoard && (
								<div className="preview-board">
									<img src={selectedBoardCover} alt={selectedBoard.title} />
									<span>{selectedBoard.title}</span>
								</div>
							)}
							<div className="preview-meta">
								{selectedTopics.length > 0 && (
									<p>
										<strong>Topics:</strong> {selectedTopics.join(", ")}
									</p>
								)}
								{keywords.length > 0 && (
									<p>
										<strong>Keywords:</strong> {keywords.join(", ")}
									</p>
								)}
								{productTags.length > 0 && (
									<p>
										<strong>Products:</strong> {productTags.join(", ")}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{pinPendingDelete && (
				<div className="pin-preview-modal">
					<div className="pin-preview-content confirm">
						<p>Delete "{pinPendingDelete.title || "this pin"}" draft?</p>
						<div className="draft-card-actions">
							<button onClick={() => setPinPendingDelete(null)}>Cancel</button>
							<button className="danger" onClick={handleDeletePin}>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreatePin;
