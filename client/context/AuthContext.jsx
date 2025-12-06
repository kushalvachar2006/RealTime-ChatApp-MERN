import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [authUser, setauthUser] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [socket, setsocket] = useState(null);

  //check if user is authenticated and if so,set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setauthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(`CheckAuth error:${error.message}`);
    }
  };

  //Login function to handle user authentication and socket connection

  const login = async (state, credintials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credintials);
      if (data.success) {
        setauthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // <-- FIXED
        settoken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(`Login error:${error.message}`);
    }
  };

  //Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthUser(null);
    setonlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
    if (socket) {
      socket.disconnect();
      setsocket(null);
    }
  };

  //Update profile function to handle user profile updates

  const updateProfile = async (profileData) => {
    try {
      console.log(token);
      const { data } = await axios.put("/api/auth/updateprofile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setauthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(`Error in updating:${data.message}`);
      }
      return data; // <-- return the response
    } catch (error) {
      toast.error(
        `Catch Error in updating: ${
          error.response?.data?.message || error.message
        }`
      );
      return { success: false };
    }
  };

  //Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData) return;
    if (socket) socket.disconnect();

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });
    setsocket(newSocket);

    newSocket.on("getonlineusers", (usersids) => {
      setonlineUsers(usersids);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      checkAuth();
    }
    // eslint-disable-next-line
  }, [token]);
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
