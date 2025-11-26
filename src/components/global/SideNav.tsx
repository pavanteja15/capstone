
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

            <div className="sidebar d-flex flex-column align-items-center py-3">

                <img onClick={()=>navigate("/home")} src="/assets/pinterest.webp" className="nav-icon mb-4" alt="Pinterest" />


 

                <img onClick={()=>navigate("/home")} src="/assets/icons/home.webp" className="nav-icon my-3" alt="Home" />

                <img onClick={()=>navigate("/explore")} src="/assets/icons/explore.webp" className="nav-icon my-3" alt="Discover" />

                <img onClick={()=>navigate("/board-view")} src="/assets/icons/layout.webp" className="nav-icon my-3" alt="Dashboard" />

                <img onClick={()=>openCreateMenu()} src="/assets/icons/addpin.webp" className="nav-icon my-3" alt="create" />

            </div>

            {showMenu && <CreateMenu closeMenu={()=> setShowMenu(false)}/>}

           

        </>

    )

}


 

export default SideNav;