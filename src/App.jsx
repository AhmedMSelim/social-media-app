import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Register from "./Components/Register/Register";
import NotFound from "./Components/NotFound/NotFound";
import Profile from "./Components/Profile/Profile";
import { HeroUIProvider } from "@heroui/react";
import AuthContextprovider from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./Components/ProtectedRoute/AuthProtectedRoute";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import { useNetworkState } from "react-use";
import DetectOffline from "./Components/DetectOffline/DetectOffline";
import AuthLayout from "./Components/AuthLayout/AuthLayout";
import Notifications from "./Components/Notifications/Notifications";
import Settings from "./Components/Settings/Settings";
import ChangePassword from "./Components/ChangePassword/ChangePassword";

const router = createBrowserRouter([
  {
    element: (
      <AuthProtectedRoute>
        <AuthLayout />
      </AuthProtectedRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true, 
            element: <ChangePassword />,
          },
          {
            path: "password",
            element: <ChangePassword />,
          },
        ],
      },{
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
const query = new QueryClient();

function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online && <DetectOffline />}
      <QueryClientProvider client={query}>
        <AuthContextprovider>
          <HeroUIProvider>
            <RouterProvider router={router}></RouterProvider>
            <ToastContainer />
          </HeroUIProvider>
        </AuthContextprovider>
      </QueryClientProvider>
    </>
  );
}

export default App;
