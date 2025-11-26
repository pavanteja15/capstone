
import React from "react";

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


 

  return (


 

    <div className="tab-section">


 

      <h3 className="section-title">Your Boards</h3>


 

      <div className="grid-container">


 

        {boards.map((b) => (


 

          <div key={b.id} className="grid-card">


 

            <div className="img-wrapper">


 

              <img src={b.coverImg} alt={b.title} className="grid-img" />

              <div className="img-overlay">

                <p>{b.description}</p>


 

              </div>

             


 

            </div>


 

            <p className="grid-title">{b.title}</p>


 

          </div>


 

        ))}


 

      </div>


 

    </div>


 

  );


 

};


 

export default ShowBoards;