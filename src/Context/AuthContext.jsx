import { useEffect, useState, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthContextprovider({ children }) {
  const [userLogin, setUserLogin] = useState(null);
  const [userId, setuserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserLogin(token);
    }
  }, []);

  useEffect(() => {
    if (userLogin) {
      const { user } = jwtDecode(userLogin);
      setuserId(user);
    } else {
      setuserId(null);
    }
  }, [userLogin]);

  useEffect(() => {
    async function getUserData() {
      if (userLogin) {
        try {
          const { data } = await axios.get(
            "https://route-posts.routemisr.com/users/profile-data",
            {
              headers: {
                Authorization: `Bearer ${userLogin}`,
              },
            },
          );

          setUserData(data.data.user);
        } catch (error) {
          console.log(error);
        }
      }
    }

    getUserData();
  }, [userLogin]);

  function logout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    setuserId(null);
    setUserData(null);
  }

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        setUserLogin,
        userId,
        userData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
