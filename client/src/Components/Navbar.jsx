import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null); // Store user info after fetching
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
    
      await axios.post("http://localhost:8000/api/auth/user/logout", {}, { withCredentials: true });
      setUser(null); 
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Clear the token cookie
      navigate("/");
    } catch (error) {
      console.error("Logout failed!", error);
    }
  };

  useEffect(() => {
    const getUserFromToken = async () => {
      const token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="));
      if (token) {
        const tokenValue = decodeURIComponent(token.split("=")[1]);
        try {
          const response = await axios.get("http://localhost:8000/api/auth/user/profile", {
            headers: { Authorization: `Bearer ${tokenValue}` },
            withCredentials: true,
          });
  
          console.log('Backend response:', response);
          
          if (response?.data?.user) {
            setUser(response.data.user);
          } else {
            console.error('No user data returned from the server.');
          }
        } catch (error) {
          console.error("Error fetching user data:", error.response || error.message);
        }
      }
    };
  
    getUserFromToken();
  }, []);
  

  console.log('user', user);

  return (
    <nav className="max-w-7xl mx-auto bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-600 cursor-pointer">FireFly</h1>

      {user ? (
        <div className="flex items-center space-x-4">
          <img
            src={user.image} 
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-green-600"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            <Link to='/signup'>Sign Up</Link>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            <Link to='/login'>Login</Link>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
