import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";

export interface BoardCard {
  id: number;
  title: string;
  coverImageUrl?: string;
  description?: string;
  pinCount?: number;
}

interface ShowBoardsProps {
  boards?: BoardCard[];
  isLoading?: boolean;
  onCreateBoard?: () => void;
  onSelectBoard?: (board: BoardCard) => void;
}

const placeholderCover = "/assets/images/nine.jpg";

const ShowBoards: React.FC<ShowBoardsProps> = ({
  boards = [],
  isLoading = false,
  onCreateBoard,
  onSelectBoard,
}) => {
  const navigate = useNavigate();

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
    navigate("/viewboard", {
      state: {
        board: {
          id: board.id,
          name: board.title,
          description: board.description,
          cover: board.coverImageUrl ?? placeholderCover,
        },
      },
    });
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
              <h5 className="board-card-title">{b.title}</h5>
              {typeof b.pinCount === "number" && (
                <span className="board-pin-count">{b.pinCount} Pins</span>
              )}
            </div>
          </div>
        ))}

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
      </div>
    </div>
  );
};

export default ShowBoards;