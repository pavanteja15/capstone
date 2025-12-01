import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./TabSection.css";

const API_BASE_URL = "http://localhost:8765";

export interface BoardCard {
  id: number;
  title: string;
  coverImageUrl?: string;
  description?: string;
  pinCount?: number;
  ownerId?: number;
  isPrivate?: boolean;
}

interface ShowBoardsProps {
  boards?: BoardCard[];
  isLoading?: boolean;
  onCreateBoard?: () => void;
  onSelectBoard?: (board: BoardCard) => void;
  onBoardUpdated?: (board: BoardCard) => void;
  onBoardDeleted?: (boardId: number) => void;
  isOwner?: boolean;
}

const placeholderCover = "/assets/images/nine.jpg";

const ShowBoards: React.FC<ShowBoardsProps> = ({
  boards = [],
  isLoading = false,
  onCreateBoard,
  onSelectBoard,
  onBoardUpdated,
  onBoardDeleted,
  isOwner = true,
}) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user);
  const currentUserId = currentUser?.userId;

  const [editingBoard, setEditingBoard] = useState<BoardCard | null>(null);
  const [deleteConfirmBoard, setDeleteConfirmBoard] = useState<BoardCard | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", isPrivate: false });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateBoard = () => {
    if (onCreateBoard) {
      onCreateBoard();
      return;
    }
    navigate("/create-board");
  };

  const handleBoardClick = (board: BoardCard) => {
    if (onSelectBoard) {
      onSelectBoard(board);
    }
    const ownerCheck = board.ownerId ? board.ownerId === currentUserId : true;
    navigate("/viewboard", {
      state: {
        board: {
          id: board.id,
          name: board.title,
          description: board.description,
          cover: board.coverImageUrl ?? placeholderCover,
          ownerId: board.ownerId
        },
        isOwner: ownerCheck,
        ownerId: board.ownerId
      },
    });
  };

  const handleEditClick = (e: React.MouseEvent, board: BoardCard) => {
    e.stopPropagation();
    setEditingBoard(board);
    setEditForm({
      title: board.title,
      description: board.description || "",
      isPrivate: board.isPrivate || false
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, board: BoardCard) => {
    e.stopPropagation();
    setDeleteConfirmBoard(board);
  };

  const handleEditSave = async () => {
    if (!editingBoard || !editForm.title.trim()) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/board/boards/${editingBoard.id}`, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        isPrivate: editForm.isPrivate
      });
      
      if (onBoardUpdated) {
        onBoardUpdated({
          ...editingBoard,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          isPrivate: editForm.isPrivate
        });
      }
      setEditingBoard(null);
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmBoard) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/board/boards/${deleteConfirmBoard.id}`);
      if (onBoardDeleted) {
        onBoardDeleted(deleteConfirmBoard.id);
      }
      setDeleteConfirmBoard(null);
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("Failed to delete board. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="boards-section">Loading boards...</div>;
  }

  return (
    <div className="boards-section">
      <div className="boards-grid">
        {boards.map((b) => (
          <div key={b.id} className="board-card" onClick={() => handleBoardClick(b)}>
            <div
              className="board-cover"
              style={{
                backgroundImage: `url(${b.coverImageUrl || placeholderCover})`,
              }}
            >
              <div className="board-cover-overlay"></div>
              {isOwner && (
                <div className="board-actions">
                  <button 
                    className="board-action-btn board-edit-btn"
                    onClick={(e) => handleEditClick(e, b)}
                    title="Edit Board"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button 
                    className="board-action-btn board-delete-btn"
                    onClick={(e) => handleDeleteClick(e, b)}
                    title="Delete Board"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              )}
              <h5 className="board-card-title">{b.title}</h5>
              {typeof b.pinCount === "number" && (
                <span className="board-pin-count">{b.pinCount} Pins</span>
              )}
              {b.isPrivate && (
                <span className="board-private-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </span>
              )}
            </div>
          </div>
        ))}

        {isOwner && (
          <div className="board-card create-board-card" onClick={handleCreateBoard}>
            <div className="board-cover create-cover">
              <div className="create-grid">
                <div className="create-grid-item"></div>
                <div className="create-grid-item"></div>
                <div className="create-grid-item"></div>
                <div className="create-grid-item"></div>
              </div>
              <button className="create-board-btn">Create</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Board Modal */}
      {editingBoard && (
        <div className="board-modal-overlay" onClick={() => setEditingBoard(null)}>
          <div className="board-modal" onClick={(e) => e.stopPropagation()}>
            <div className="board-modal-header">
              <h3>Edit Board</h3>
              <button className="board-modal-close" onClick={() => setEditingBoard(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="board-modal-content">
              <div className="board-modal-field">
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Board title"
                />
              </div>
              <div className="board-modal-field">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="What's your board about?"
                  rows={3}
                />
              </div>
              <div className="board-modal-field board-modal-toggle">
                <label>Private Board</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={editForm.isPrivate}
                    onChange={(e) => setEditForm({ ...editForm, isPrivate: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="board-modal-actions">
              <button 
                className="board-modal-cancel" 
                onClick={() => setEditingBoard(null)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                className="board-modal-save" 
                onClick={handleEditSave}
                disabled={isUpdating || !editForm.title.trim()}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmBoard && (
        <div className="board-modal-overlay" onClick={() => setDeleteConfirmBoard(null)}>
          <div className="board-modal board-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Board?</h3>
            <p>Are you sure you want to delete "{deleteConfirmBoard.title}"? Pins in this board will not be deleted but will be removed from this board.</p>
            <div className="board-modal-actions">
              <button 
                className="board-modal-cancel" 
                onClick={() => setDeleteConfirmBoard(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="board-modal-delete" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBoards;