
import React from "react";

import g1 from "../../assets/five.jpg";

import g2 from "../../assets/seven.jpg";

import g3 from "../../assets/eight.jpg";

import g4 from "../../assets/nine.jpg";




 

const samplePins:string[]=[g1,g2,g3,g4];

export default function ExploreGrid() {

 return (

   <div className="explore-grid">

     {samplePins.map((img, i) => (

       <div className="explore-item" key={i}>

         <img src={img} alt="explore" />

       </div>

     ))}

   </div>

 );

}





 