
 

import React from "react";

import "./TabSection.css";



 

type Pin = {

  id: number;

  img: string;

  title: string;

};


 

const pins: Pin[] = [

  { id: 1, img: "/assets/images/one.webp", title: "Cute Outfit" },

  { id: 2, img: "/assets/images/two.webp", title: "Living Room Decor" },

  { id: 3, img: "/assets/images/three.webp", title: "Car Design" }

];


 

const ShowPins: React.FC = () => {

  return (

    <div className="tab-section">

      <h3 className="section-title">Your Pins</h3>

      <div className="grid-container">

        {pins.map(p => (

          <div key={p.id} className="grid-card">

            <img src={p.img} alt={p.title} className="grid-img" />

            <p className="grid-title">{p.title}</p>

          </div>

        ))}

      </div>

    </div>

  );

};


 

export default ShowPins;