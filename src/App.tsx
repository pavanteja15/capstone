
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import CreatePin from "./CreatePin"; 
import CreateBoardForm from "./CreateBoardForm";
import Home from "./screens/home";
import UserProfile from "./screens/UserProfile";

import SideNav from "./components/global/SideNav";

import { useState, useEffect } from "react";

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

import { useAppDispatch } from "./store/hooks";
import { setUser } from "./store/userSlice";
import { isAuthenticated, getStoredUser } from "./utils/authUtils";
import ProtectedRoute from "./components/auth/ProtectedRoute";



 

const AppRoutes = () => {
  const [showMenu,setShowMenu] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const hideSideNavRoutes = ["/"];
  const shouldShowSideNav = !hideSideNavRoutes.includes(location.pathname);

  // Restore user session from localStorage on app load
  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        dispatch(setUser({
          userId: storedUser.userId,
          name: storedUser.name,
          email: storedUser.email,
          username: storedUser.username,
          mobile: storedUser.mobile,
          bio: storedUser.bio,
          profilePath: storedUser.profilePath,
          accountType: storedUser.accountType,
          businessName: storedUser.businessName || '',
          websiteUrl: storedUser.websiteUrl || '',
          description: storedUser.description || ''
        }));
      }
    }
  }, [dispatch]);

  return (
    <>
      {shouldShowSideNav && (
        <SideNav openCreateMenu={()=>setShowMenu(true)}/>
      )}

      {showMenu && <CreateMenu closeMenu={()=> setShowMenu(false)}/>}

      <Routes>

            <Route path="/" element={<PinterestHero/>} />

            <Route path="/create-board" element={<ProtectedRoute><CreateBoardForm/></ProtectedRoute>} />  

            <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />  

            <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />  

            <Route path="/create-pin" element={<ProtectedRoute><CreatePin/></ProtectedRoute>}/>

            <Route path="/explore" element={<ProtectedRoute><Explore/></ProtectedRoute>}/>

            <Route path="/viewpin" element={<ProtectedRoute><ViewPin/></ProtectedRoute>}/>

            <Route path="/board-view" element={<ProtectedRoute><ShowBoards/></ProtectedRoute>}/>

            <Route path="/Register" element={<RegisterUser/>}/>

            <Route path="/board-viewpage" element={<ProtectedRoute><BoardViewPage/></ProtectedRoute>}/>

            <Route path="/viewboard" element={<ProtectedRoute><ViewBoard/></ProtectedRoute>}/>

            <Route path="/collabs" element={<ProtectedRoute><Collabs/></ProtectedRoute>}/>

            <Route path="/viewprofile" element={<ProtectedRoute><ViewProfile/></ProtectedRoute>}/>

            <Route path="/viewprofile/:userId" element={<ProtectedRoute><ViewProfile/></ProtectedRoute>}/>

            <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>

            <Route path="/business-profiles" element={<ProtectedRoute><BusinessProfiles/></ProtectedRoute>}/>

            <Route path="/sponsored" element={<ProtectedRoute><Sponsored/></ProtectedRoute>}/>

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
