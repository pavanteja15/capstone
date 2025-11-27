
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
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
import ViewPin from "./screens/ViewPin";
import ViewBoard from "./screens/ViewBoard";
import Collabs from "./screens/Collabs";
import ViewProfile from "./screens/ViewProfile";
import Search from "./screens/Search";
import BusinessProfiles from "./screens/BusinessProfiles";
import Sponsored from "./screens/Sponsored";



 

const AppRoutes = () => {
  const [showMenu,setShowMenu] = useState(false);
  const location = useLocation();
  const hideSideNavRoutes = ["/"];
  const shouldShowSideNav = !hideSideNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowSideNav && (
        <SideNav openCreateMenu={()=>setShowMenu(true)}/>
      )}

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

            <Route path="/viewpin" element={<ViewPin/>}/>

            <Route path="/board-view" element={<ShowBoards/>}/>

            <Route path="/Register" element={<RegisterUser/>}/>

            <Route path="/board-viewpage" element={<BoardViewPage/>}/>

            <Route path="/viewboard" element={<ViewBoard/>}/>

            <Route path="/collabs" element={<Collabs/>}/>

            <Route path="/viewprofile" element={<ViewProfile/>}/>

            <Route path="/search" element={<Search/>}/>

            <Route path="/business-profiles" element={<BusinessProfiles/>}/>

            <Route path="/sponsored" element={<Sponsored/>}/>

      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
