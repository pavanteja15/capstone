
import React from "react";

import './createmenu.css'

import { useNavigate } from "react-router-dom";


 

interface Props{

    closeMenu: ()=> void;

}


 

const CreateMenu: React.FC<Props> = ({closeMenu}) =>{

    const navigate = useNavigate();

    return (

        <div className="create-menu-overlay" onClick={closeMenu}>

            <div className="create-menu" onClick={(e)=>e.stopPropagation()}>

                <div className="create-header">

                    <h4 className="create">Create</h4>

                    <button className="close-btn" onClick={closeMenu}>x</button>

                </div>

                <div className="menu-item" onClick={()=>{

                    navigate("/create-pin");

                    closeMenu();

                    }}>

                    <img src="/assets/icons/pin.webp" alt="" />

                    <div>

                        <p className="title">Pin</p>

                        <p className="desc">Post your photos or videos and add links, stickers, effects</p>

                    </div>

                </div>  


 

                <div className="menu-item" onClick={()=>{navigate("/create-board"); closeMenu();}}>

                    <img src="/assets/icons/layout.webp" alt="" />

                    <div>

                        <p className="title">Board</p>

                        <p className="desc">Organize your collection by creating a board</p>

                    </div>

                </div>

            </div>

        </div>

    )

}



 

export default CreateMenu;