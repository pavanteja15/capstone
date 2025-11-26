// import React from 'react';

// import logo from './logo.svg';

// import './App.css';


 

// function App() {

//   return (

//     <div className="App">

//       <header className="App-header">

//         <img src={logo} className="App-logo" alt="logo" />

//         <p>

//           Edit <code>src/App.tsx</code> and save to reload.

//         </p>

//         <a

//           className="App-link"

//           href="https://reactjs.org"

//           target="_blank"

//           rel="noopener noreferrer"

//         >

//           Learn React  

//         </a>

//       </header>

//     </div>

//   );

// }


 

// export default App;


 

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



 

export default function App() {

  const [showMenu,setShowMenu] = useState(false);

 return (


 

  <>


 

   

    <BrowserRouter>

      <SideNav openCreateMenu={()=>setShowMenu(true)}/>

      {showMenu && <CreateMenu closeMenu={()=> setShowMenu(false)}/>}

      <Routes>

            <Route path="/" element={<CreatePin/>} />

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