import React from "react";
import Home from "../Home/Home";
import Login from "../Login/Login";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({children}) {
  if (localStorage.getItem("userToken")) {
    return  <Navigate to={"/"}/>
  }
  else{
   return <>{children}</>
 }
}
