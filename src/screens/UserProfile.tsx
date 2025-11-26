import React, { useState } from "react";


 

import "./UserProfile.css";

import pp from "../assets/profilepic1.jpg";


 

// Import your new components


 

import BoardsList from "../components/profile/ShowBoards";

import PinsList from "../components/profile/ShowPins";

import SavedList from "../components/profile/ShowSaved";

import TopNav from "../components/global/TopNav";


 

type User = {

  name: string;

  bio: string;

  profilePic: string;

};


 

const followers: User[] = [

  { name: "Amit", bio: "Bio of Amit is not so long to see but have to see this for a while", profilePic: "/path/to/amit.jpg" },

  { name: "Sneha", bio: "Bio of Sneha is not so long to see but have to see this for a while", profilePic: "/path/to/sneha.jpg" },

  { name: "John", bio: "Bio of John", profilePic: "/path/to/john.jpg" }

];


 

const following: User[] = [

  { name: "David", bio: "Bio of David", profilePic: "/path/to/david.jpg" },

  { name: "Rahul", bio: "Bio of Rahul", profilePic: "/path/to/rahul.jpg" }

];


 

const UserProfile: React.FC = () => {

  const [openPopup, setOpenPopup] = useState(false);

  const [popupTitle, setPopupTitle] = useState("");

  const [popupList, setPopupList] = useState<User[]>([]);

  const [popupType, setPopupType] = useState<"followers" | "following" | "">("");

  const [openPicPopup, setOpenPicPopup] = useState(false);




 

  const [selectedTab, setSelectedTab] =

    useState<"saved" | "pins" | "boards">("boards");

  const openList = (title: string, list: User[], type: "followers" | "following") => {

    setPopupTitle(title);

    setPopupList(list);

    setPopupType(type);

    setOpenPopup(true);

  };


 

  return (

    <>

      <TopNav/>


 

      <div className="profile-wrapper">

      {/* Top Buttons */}

      {/* <div className="top-buttons">

        <button className="top-btn">Edit</button>

        <button className="top-btn">Share</button>

      </div> */}

      <div className="center-content">


 

  <img


 

    src={pp}


 

    alt="Profile"


 

    className="profile-pic"


 

    onClick={() => setOpenPicPopup(true)}


 

  />


 

  <h2 className="profile-name">velu sonali</h2>


 

  <p className="username">@velusonali</p>


 

  <div className="follow-row">


 

    <span onClick={() => openList("Followers", followers, "followers")}>


 

      {followers.length} followers


 

    </span>


 

    <span>·</span>


 

    <span onClick={() => openList("Following", following, "following")}>


 

      {following.length} following


 

    </span>


 

  </div>


 

  {/* EDIT + SHARE BUTTONS (NEW POSITION + NEW UI) */}


 

  <div className="profile-buttons">


 

    <button className="profile-btn">Edit profile</button>


 

    <button className="profile-btn">Share</button>


 

  </div>


 

  {/* NEW TABS LIKE PINTEREST */}


 

  <div className="tabs">


 

    <button

      className={`tab-text ${selectedTab === "boards" ? "active-tab" : ""}`}

      onClick={() => setSelectedTab("boards")}>

      Boards

    </button>


 

    <button

      className={`tab-text ${selectedTab === "pins" ? "active-tab" : ""}`}

      onClick={() => setSelectedTab("pins")}>

      Pins

    </button>


 

    <button

      className={`tab-text ${selectedTab === "saved" ? "active-tab" : ""}`}

      onClick={() => setSelectedTab("saved")}>

      Saved

    </button>


 

  </div>



 

  <div className="tab-content">

    {selectedTab === "saved" && <SavedList />}

    {selectedTab === "pins" && <PinsList />}

    {selectedTab === "boards" && <BoardsList />}

  </div>


 

</div>

      {/* Followers / Following Popup */}

      {openPopup && (

        <div className="popup-overlay">

          <div className="popup-box">

            <div className="popup-close-star" onClick={() => setOpenPopup(false)}>

              X

            </div>

            <h2>{popupTitle}</h2>

            <div className="popup-list-scroll">

              <ul>

                {popupList.map((u, idx) => (

                  <li key={idx}>

                    <div className="popup-user-info">

                      <img src={u.profilePic} alt={u.name} className="popup-user-pic" />

                      <div className="popup-user-details">

                        <div className="popup-user-name">{u.name}</div>

                        <div className="popup-user-bio">{u.bio}</div>

                      </div>

                    </div>

                    <button className="remove-btn">Remove</button>

                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>

      )}


 

      {/* Profile Image Popup */}


 

      {openPicPopup && (

        <div className="popup-overlay">

          <div className="popup-image-box">

            <img src={pp} alt="Enlarged" />

            <button className="close-btn" onClick={() => setOpenPicPopup(false)}>

              X

            </button>

          </div>

        </div>

      )}

    </div>

    </>

   

  );

};


export default UserProfile;