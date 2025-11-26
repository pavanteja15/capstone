
import React from "react";

import PinView from "./PinView";

import ExploreGrid from "./ExploreGrid";

import "./PinPage.css";


 

import a1 from "../../assets/one.jpg";

import a2 from "../../assets/two.jpg";

import p3 from "../../assets/three.jpg";


 

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





 