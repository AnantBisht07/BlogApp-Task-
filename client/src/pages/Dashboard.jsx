import React from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";


const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto flex justify-center items-center mt-12 gap-12">
  <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 h-14 w-32 text-xl ">
    <Link to='/all-blogs'>Blogs</Link>
  </button>
  <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 h-14 w-32 text-xl">
    <Link to='/create-blog'>Create</Link>
  </button>
</div>

    </div>
  );
};

export default Dashboard;
