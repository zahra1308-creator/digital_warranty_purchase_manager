import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';

const Profile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.info("Profile updating is not supported in this week's implementation.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="flex items-center gap-6 border-b border-gray-100 pb-8 mb-8">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
          ) : (
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl border-4 border-gray-50">
              <FiUser />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name || 'User'}</h2>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FiMail /> {currentUser?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
