import React from "react";
import Footer from "./../Footer/Footer";
import Navbar from "./../Navbar/Navbar";
import { Outlet, RouterProvider } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="container w-[98%] min-h-screen mx-auto  p-4 ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
