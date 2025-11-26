
import React from "react";

import './createmenu.css'

import { useNavigate } from "react-router-dom";


 

interface Props{

    closeMenu: ()=> void;

}


 

const CreateMenu: React.FC<Props> = ({closeMenu}) =>{

    const navigate = useNavigate();

    return (

        <div className="createmenu-overlay" onClick={closeMenu}>

            <div className="createmenu-box" onClick={(e)=>e.stopPropagation()}>

                <div className="createmenu-header">

                    <h4 className="createmenu-heading createmenu-create">Create</h4>

                    <button className="createmenu-close-btn" onClick={closeMenu}>x</button>

                </div>

                <div className="createmenu-item" onClick={()=>{

                    navigate("/create-pin");

                    closeMenu();

                    }}>

                    <img src="/assets/icons/pin.webp" alt="" />

                    <div>

                        <p className="createmenu-item-title">Pin</p>

                        <p className="createmenu-item-desc">Post your photos or videos and add links, stickers, effects</p>

                    </div>

                </div>  


 

                <div className="createmenu-item" onClick={()=>{navigate("/create-board"); closeMenu();}}>

                    <img src="/assets/icons/layout.webp" alt="" />

                    <div>

                        <p className="createmenu-item-title">Board</p>

                        <p className="createmenu-item-desc">Organize your collection by creating a board</p>

                    </div>

                </div>

            </div>

        </div>

    )

}



 

export default CreateMenu;