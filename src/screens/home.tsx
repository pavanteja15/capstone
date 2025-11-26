
import React, { FC, useState } from "react";


 

import './home.css';

import TopNav from "../components/global/TopNav";


 

const   Home: FC = ()=> {


 

    const [selectedBoard,setSelectedBoard] = useState("All");


 

    const imagesTest = [

        "/assets/images/one.webp",

        "/assets/images/eight.webp",

        "/assets/images/two.webp",

        "/assets/images/three.webp",

         "/assets/images/eight.webp",

        "/assets/images/four.webp",

        "/assets/images/five.webp",

        "/assets/images/six.webp",

    ]


 

    const images = [...imagesTest,...imagesTest,...imagesTest];


 

    const leftColImages = images.filter((_,index)=> index%2 === 0);

    const rightColImages = images.filter((_,index)=> index%2 !== 0);


 

    const boardslist = ["Nature", "Space", "Anime"];


 

    const boards = ["All", ...boardslist]



 

        return(

        <>

            <TopNav/>

            <div className="masonry-container" style={{marginLeft:"70px", marginTop: "70px"}}>

                {images.map((imgSrc,index)=>(

                        <div key={index} className="pin-card">

                            <div className="pin-wrapper card boarder-0 rounded-4 shadow-sm">

                                <img className="card-img-top rounded-4 pin-image"

                                src={imgSrc} alt= {`Pin${index}`} style={{width:"100%",display:"block"}}/>


 

                                <div className="pin-overlay">

                                    <button className="btn-save">Save</button>

                                    <div className="right-buttons">

                                        <button className="btn-icon"><img src="/assets/icons/share.webp" alt="" /></button>

                                        <button className="btn-icon"><img src="/assets/icons/dots.webp" alt="" /></button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}  

            </div>

        </>

    )

}


 

export default Home;