

 

import React from "react";

import "./TabSection.css";


 

type SavedItem = {

  id: number;

  img: string;

  title: string;

};


 

const savedItems: SavedItem[] = [

  { id: 1, img: "/assets/images/four.webp", title: "Makeup Look" },

  { id: 2, img: "/assets/images/five.webp", title: "Bedroom Setup" },

  { id: 2, img: "/assets/images/six.webp", title: "Bedroom Setup" }

];


 

const ShowSaved: React.FC = () => {

  return (

    <div className="tab-section">

      <h3 className="section-title">Saved Items</h3>

      <div className="grid-container">

        {savedItems.map(s => (

          <div key={s.id} className="grid-card">

            <img src={s.img} alt={s.title} className="grid-img" />

            <p className="grid-title">{s.title}</p>

          </div>

        ))}

      </div>

    </div>

  );

};


 

export default ShowSaved;