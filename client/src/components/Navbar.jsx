// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/" className="text-white hover:text-gray-300">Dashboard</Link>
        </div>
        <div className='text-2xl text-white'>
          Chat With PDF
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/createProject" className="text-white text-lg hover:text-gray-300">Create Project</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
