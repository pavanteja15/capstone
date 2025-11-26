
import React from "react";


 

import b1 from "../../../src/assets/one.jpg";

import "./BoardViewPage.css";


 

import b4 from "../../../src/assets/two.jpg";

import b2 from "../../../src/assets/three.jpg";

import b3 from "../../../src/assets/four.jpg";


 

const BoardViewPage: React.FC = () => {


 

  const board = {


 

    id: 1,


 

    name: "My Travel Inspirations",


 

    description: "A collection of all the places I want to visit",


 

    coverImage:


 

      b1,


 

    totalPins: 12,


 

  };


 

  const pins = [


 

    {


 

      id: 1,


 

      image: b4,


 

      title: "Sunset Beach",


 

    },


 

    {


 

      id: 2,


 

      image: b2,


 

      title: "Mountain Peaks",


 

    },


 

    {


 

      id: 3,


 

      image: b3,


 

      title: "City Lights",


 

    }


 

  ];


 

  return (


 

    <div className="board-wrapper container mt-4">


 

      {/* ---------- Board Header Section ---------- */}


 

      <div className="board-header">


 

        <img src={board.coverImage} alt="cover" className="board-cover-img" />


 

        <div className="board-info">


 

          <h1 className="board-name">{board.name}</h1>


 

          <p className="board-desc">{board.description}</p>


 

          <div className="board-actions">


 

            <button className="btn btn-light action-btn">Share</button>


 

            <button className="btn btn-dark action-btn">Edit</button>


 

          </div>


 

        </div>


 

      </div>


 

      {/* ------------ Pins Section ------------ */}


 

      <h3 className="pins-title">Pins</h3>


 

      <div className="pins-grid">


 

        {pins.map((pin) => (


 

          <div className="pin-card" key={pin.id}>


 

            <img src={pin.image} className="pin-img" alt={pin.title} />


 

            <p className="pin-title">{pin.title}</p>


 

          </div>


 

        ))}


 

      </div>


 

    </div>


 

  );


 

};


 

export default BoardViewPage;