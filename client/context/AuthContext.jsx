import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

const login = async (type, credentials) => {
  try {
    console.log("AuthContext: login called with state:", type);
    console.log("AuthContext: credentials:", credentials);

    const endpoint =
      type === "signUp"
        ? "http://localhost:5000/api/auth/signUp"
        : "http://localhost:5000/api/auth/login";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    console.log("AuthContext: API response:", data);

    if (data.success) {
      setAuthUser(data.data.user || data.data.newUser);
      localStorage.setItem("authUser", JSON.stringify(data.data.user || data.data.newUser));
      localStorage.setItem("token", data.data.token);

      console.log("AuthContext: Login successful, user set:", data.data.user || data.data.newUser);
      return { success: true, user: data.data.user || data.data.newUser };
    } else {
      console.error("AuthContext: Login failed:", data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("AuthContext: Error during login:", error);
    return { success: false, message: "Something went wrong" };
  }
};


  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;

    toast.success("Logged out successfully");
    socket?.disconnect();
  };

  // Update profile function to handle user profile updates
  const updateProfile = async (body) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put("/api/auth/update-profile", body, {
      headers: { token },
    });

    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  // Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
