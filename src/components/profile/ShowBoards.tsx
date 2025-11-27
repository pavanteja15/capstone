
import React from "react";
import { useNavigate } from "react-router-dom";
import "./TabSection.css";

const b1 = "/assets/images/nine.jpg";
const b2 = "/assets/images/eleven.jpg";
const b3 = "/assets/images/twelve.jpg";



 

type Board = {

  id: number;

  title: string;

  coverImg: string;

  description: string;

};


 

const boards: Board[] = [

  {

    id: 1,

    title: "Travel Ideas",

    coverImg: b1,

    description: "Places I want to visit this year",

  },


 

  {

    id: 2,

    title: "Recipes",

    coverImg: b2,

    description: "Dishes I wanted to learn to cook this year. Workout goals for this year",

  },


 

  {

    id: 3,

    title: "Workout",

    coverImg: b3,

    description: "Workout goals for this year",

  },

];




 

const ShowBoards: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    navigate("/create-board");
  };

  const handleBoardClick = (board: Board) => {
    navigate("/viewboard", { 
      state: { 
        board: {
          id: board.id,
          name: board.title,
          description: board.description,
          cover: board.coverImg
        }
      } 
    });
  };


 

  return (


 

    <div className="boards-section">


 

      <div className="boards-grid">


 

        {boards.map((b) => (


 

          <div 
            key={b.id} 
            className="board-card"
            onClick={() => handleBoardClick(b)}
          >
            <div 
              className="board-cover" 
              style={{ backgroundImage: `url(${b.coverImg})` }}
            >
              <div className="board-cover-overlay"></div>
              <h5 className="board-card-title">{b.title}</h5>
            </div>
          </div>


 

        ))}

        {/* Create Board Card */}
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