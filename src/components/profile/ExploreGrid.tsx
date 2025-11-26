
import React from "react";

const g1 = "/assets/images/five.jpg";
const g2 = "/assets/images/seven.jpg";
const g3 = "/assets/images/eight.jpg";
const g4 = "/assets/images/nine.jpg";




 

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





 