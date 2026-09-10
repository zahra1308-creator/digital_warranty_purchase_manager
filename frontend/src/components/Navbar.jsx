import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { FiBox, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FiBox size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">
                Warranty<span className="text-primary">Vault</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUser />
                    </div>
                  )}
                  <span className="hidden sm:block font-medium">{currentUser.name || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
