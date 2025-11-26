

 

import React, { useState } from "react";

import "./PinPage.css";


 

interface PinData {

 image: string;

 title: string;

 description: string;

 likes: number;

 userName: string;

 userProfile: string;

}


 

interface Board {

 name: string;

 cover: string;

}


 

interface PinViewProps {

 pin: PinData;

 boards: Board[];

}


 

/* =======================

  SVG ICONS (NO IMPORTS)

======================= */


 

const HeartIcon = (color: string) => (

 <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>

   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5

            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09

            C13.09 3.81 14.76 3 16.5 3

            19.58 3 22 5.42 22 8.5

            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />

 </svg>

);


 

const ShareIcon = (

 <svg width="22" height="22" viewBox="0 0 24 24" fill="#444">

   <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7

            s-.03-.47-.09-.7L15.91 7.1c.53.5 1.23.8 2 .8

            1.66 0 3-1.34 3-3s-1.34-3-3-3

            s-3 1.34-3 3c0 .24.03.47.09.7L8.09 9.9

            C7.56 9.4 6.86 9.1 6.1 9.1c-1.66 0-3 1.34-3 3

            s1.34 3 3 3c.76 0 1.46-.3 1.99-.8l6.02 3.47

            c-.05.21-.08.43-.08.66 0 1.66 1.34 3 3 3

            s3-1.34 3-3s-1.34-3-3-3z" />

 </svg>

);


 

const SaveIcon = (

 <svg width="20" height="20" viewBox="0 0 24 24" fill="white">

   <path d="M17 3H5a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2z" />

 </svg>

);


 

const DownloadIcon = (

 <svg width="20" height="20" viewBox="0 0 24 24" fill="#e60023">

   <path d="M5 20h14v-2H5m7-14l-5 5h3v4h4v-4h3l-5-5z" />

 </svg>

);



 

/* =======================

     MAIN COMPONENT

======================= */


 

export default function PinView({ pin, boards }: PinViewProps) {

 const [liked, setLiked] = useState(false);

 const [likeCount, setLikeCount] = useState(pin.likes);


 

 const toggleLike = () => {

   if (!liked) {

     setLikeCount(likeCount + 1);

     setLiked(true);

   } else {

     setLikeCount(likeCount - 1);

     setLiked(false);

   }

 };


 

 return (

   <div className="pin-card">


 

     {/* LEFT IMAGE */}

     <div className="left-image">

       <img src={pin.image} alt={pin.title} />

     </div>


 

     {/* RIGHT SIDE PANEL */}

     <div className="right-panel">


 

       {/* TOP BUTTONS */}

       <div className="top-buttons">

         <button

           className={`circle-btn like ${liked ? "liked" : ""}`}

           onClick={toggleLike}

         >

           {HeartIcon(liked ? "red" : "gray")}

         </button>


 

         <button className="circle-btn share">

           {ShareIcon}

         </button>


 

         <button className="save-btn">

           {SaveIcon}

           <span>Save</span>

         </button>


 

         <button className="download-btn">

           {DownloadIcon}

           <span>Download</span>

         </button>

       </div>


 

       {/* META */}

       <div className="meta">

         <div className="likes">{likeCount} likes</div>


 

         <h1 className="pin-title">{pin.title}</h1>


 

         {/* USER INFO */}

         <div className="user-info">

           <img src={pin.userProfile} className="user-avatar" alt="user" />

           <span className="username">{pin.userName}</span>

         </div>


 

         <p className="pin-desc">{pin.description}</p>

       </div>

       </div>


 

     </div>


 

 );

}




















 