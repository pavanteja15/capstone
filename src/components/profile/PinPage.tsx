
import React from "react";

import PinView from "./PinView";

import ExploreGrid from "./ExploreGrid";

import "./PinPage.css";

const a1 = "/assets/images/one.jpg";
const a2 = "/assets/images/two.jpg";
const p3 = "/assets/images/three.jpg";


 

export default function PinPage() {

 const pin = {

   image: a1,

   title: "Japanese Samurai Art",

   description: "A dramatic samurai scene with atmospheric lighting.",

   likes: 931,

   userName: "Tushar Dey",

   userProfile: p3,

 };


 

 const boards = [

   { name: "Samurai Board", cover: a1},

   { name: "Aesthetic Art", cover: a2 },

 ];


 

 return (

   <div className="center-wrapper">

     <PinView pin={pin} boards={boards} />

     <h2 className="explore-title">More to explore</h2>

     <ExploreGrid />

   </div>

 );

}





 