
import React, { FC, useState } from "react";

import './sidenav.css';

import { useNavigate } from "react-router-dom";

import CreateMenu from "./CreateMenu";


 

interface SideNavProps{openCreateMenu:()=>void;}


 

const SideNav :FC<SideNavProps> = ({openCreateMenu})=>{


 

    const [showMenu, setShowMenu] = useState(false);


 

    const navigate = useNavigate();


 

    return(

        <>

            <div className="sidenav-container d-flex flex-column align-items-center py-3">

                <img onClick={()=>navigate("/home")} src="/assets/images/Pinterest-Logo.jpg" className="sidenav-logo mb-4" alt="Pinterest" />


 

                <img onClick={()=>navigate("/home")} src="/icons/home.png" className="sidenav-icon my-3" alt="Home" />

                <img onClick={()=>navigate("/explore")} src="/icons/explore.jpg" className="sidenav-icon my-3" alt="Discover" />

                <img onClick={()=>navigate("/board-view")} src="/icons/layout.png" className="sidenav-icon my-3" alt="Dashboard" />

                <img onClick={()=>openCreateMenu()} src="/icons/addpin.jpeg" className="sidenav-icon my-3" alt="create" />

            </div>

            {showMenu && <CreateMenu closeMenu={()=> setShowMenu(false)}/>}

           

        </>

    )

}


 

export default SideNav;