
import React, { FC, useState, useRef } from "react";


 

import './home.css';

import TopNav from "../components/global/TopNav";


 

interface MenuPosition {
    top: number;
    left: number;
}

const   Home: FC = ()=> {


 

    const [selectedBoard,setSelectedBoard] = useState("All");

    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });


 

    const imagesTest = [

        "/assets/images/one.jpg",

        "/assets/images/eight.jpg",

        "/assets/images/two.jpg",

        "/assets/images/three.jpg",

        "/assets/images/eight.jpg",

        "/assets/images/four.jpg",

        "/assets/images/five.jpg",

        "/assets/images/seven.jpg",

    ]


 

    const images = [...imagesTest,...imagesTest,...imagesTest];


 

    const leftColImages = images.filter((_,index)=> index%2 === 0);

    const rightColImages = images.filter((_,index)=> index%2 !== 0);


 

    const boardslist = ["Nature", "Space", "Anime"];


 

    const boards = ["All", ...boardslist]

    
    const handleMenuToggle = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            // Get button position
            const button = e.currentTarget as HTMLButtonElement;
            const rect = button.getBoundingClientRect();
            
            // Calculate position - show above the button if near bottom of screen
            const menuHeight = 250; // approximate menu height
            const spaceBelow = window.innerHeight - rect.bottom;
            
            let top: number;
            if (spaceBelow < menuHeight) {
                // Not enough space below, show above
                top = rect.top - menuHeight;
            } else {
                // Show below the button
                top = rect.bottom + 8;
            }
            
            // Position to the left of the button
            let left = rect.right - 280; // 280 is menu width
            if (left < 10) left = 10;
            
            setMenuPosition({ top, left });
            setActiveMenuIndex(index);
        }
    };

    const handleMenuClose = () => {
        setActiveMenuIndex(null);
    };


 

        return(

        <>

            <TopNav/>

            {/* Overlay to close menu when clicking outside */}
            {activeMenuIndex !== null && (
                <div className="home-menu-backdrop" onClick={handleMenuClose}></div>
            )}

            {/* Pin Menu Popup - Rendered outside the masonry grid */}
            {activeMenuIndex !== null && (
                <div 
                    className="home-pin-menu"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <div className="home-pin-menu-header">
                        This Pin was inspired by your recent activity
                    </div>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>See more like this</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            <line x1="4" y1="4" x2="20" y2="20"/>
                        </svg>
                        <span>See less like this</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span>Download image</span>
                    </button>
                    <button className="home-pin-menu-item" onClick={handleMenuClose}>
                        <svg className="home-pin-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                        <span>Report Pin</span>
                    </button>
                </div>
            )}

            <div className="home-masonry-container">

                {images.map((imgSrc,index)=>(

                        <div key={index} className="home-pin-card">

                            <div className="home-pin-wrapper">

                                <img className="home-pin-image"

                                src={imgSrc} alt={`Pin ${index + 1}`} />


 

                                <div className="home-pin-overlay">

                                    <button className="home-btn-save">Save</button>

                                    <div className="home-right-buttons">

                                        <button className="home-btn-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M21 5V3h-2v2H5V3H3v2H1v2h2v12h8v2h-2v2h2v-2h4v2h2v-2h-2v-2h8V7h2V5h-2zM5 17V7h14v10H5z"/>
                                            </svg>
                                        </button>

                                        <button 
                                            className="home-btn-icon"
                                            onClick={(e) => handleMenuToggle(index, e)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm18 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                            </svg>
                                        </button>

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