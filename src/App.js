import React from "react";
import Cookies from 'universal-cookie';
import "./App.css";
import Login  from "./pages/Login.js";
import SignUp from "./pages/SignUp.js";
import { DashBoard } from "./pages/DashBoard.js"
import { BrowserRouter, Route, Routes,  Navigate, Outlet } from "react-router-dom";

function App() {
  const cookies = new Cookies(null, { path: '/' });

  const ProtectedRoute = ({ redirectPath = '/' }) => {
    if (cookies.get("jwt") == undefined) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes >
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/" element={<Login/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard/>} />
        </Route>

        <Route path="*" element={<h1> Page Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
