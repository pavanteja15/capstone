
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./SelectBoard.css";


 

export default function SelectBoard() {

 const navigate = useNavigate();


 

 const [search, setSearch] = useState("");


 

 const boards = [

   { name: "Travel Ideas", img: "https://picsum.photos/200?1" },

   { name: "Recipes", img: "https://picsum.photos/200?2" },

   { name: "Photography", img: "https://picsum.photos/200?3" },

   { name: "Fashion Inspo", img: "https://picsum.photos/200?4" }

 ];


 

 const filtered = boards.filter(b =>

   b.name.toLowerCase().includes(search.toLowerCase())

 );


 

 return (

   <div className="board-page">

     <header className="board-header">

       <span className="back-btn" onClick={() => navigate("/")}>{"<"}</span>

       <h3>Select Board</h3>

     </header>


 

     <input

       className="board-search"

       type="text"

       placeholder="Search boards"

       value={search}

       onChange={e => setSearch(e.target.value)}

     />


 

     <div className="board-list">

       {filtered.map((b, i) => (

         <div

           key={i}

           className="board-card"

           onClick={() => navigate("/", { state: { boardName: b.name } })}

         >

           <img src={b.img} />

           <span className="board-name">{b.name}</span>

         </div>

       ))}

     </div>


 

     <button

       className="create-board-btn"

       onClick={() => navigate("/create-board", { state: { boardName: "New Board" } })}

     >

       + Create New Board

     </button>

   </div>

 );

}





 