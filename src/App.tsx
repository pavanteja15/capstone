
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import CreatePin from "./CreatePin"; 
import SelectBoard from "./SelectBoard";
import CreateBoardForm from "./CreateBoardForm";
import Home from "./screens/home";
import UserProfile from "./screens/UserProfile";

import SideNav from "./components/global/SideNav";

import { useState } from "react";

import CreateMenu from "./components/global/CreateMenu";

import Explore from "./screens/explore";

import PinView from "./components/profile/PinView";

import PinPage from "./components/profile/PinPage";

import BoardViewPage from "./components/profile/BoardViewPage";

import ShowBoards from "./components/profile/ShowBoards";

import RegisterUser from "./RegisterUser";
import PinterestHero from "./screens/pintrest";



 

export default function App() {

  const [showMenu,setShowMenu] = useState(false);

 return (


 

  <>


 

   

    <BrowserRouter>

      <SideNav openCreateMenu={()=>setShowMenu(true)}/>

      {showMenu && <CreateMenu closeMenu={()=> setShowMenu(false)}/>}

      <Routes>

            <Route path="/" element={<PinterestHero/>} />

            <Route path="/select-board" element={<SelectBoard/>} />

            <Route path="/create-board" element={<CreateBoardForm/>} />  

            <Route path="/home" element={<Home/>} />  

            <Route path="/profile" element={<UserProfile/>} />  

            <Route path="/create-board" element={<CreateBoardForm/>}/>

            <Route path="/create-pin" element={<CreatePin/>}/>

            <Route path="/explore" element={<Explore/>}/>

            <Route path="/viewpin" element={<PinPage/>}/>

            <Route path="/board-view" element={<ShowBoards/>}/>

            <Route path="/Register" element={<RegisterUser/>}/>

            <Route path="/board-viewpage" element={<BoardViewPage/>}/>

      </Routes>

    </BrowserRouter>



 

  </>



 );

}