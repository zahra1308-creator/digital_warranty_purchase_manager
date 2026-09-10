import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiFileText, FiBell, FiSearch } from 'react-icons/fi';

const features = [
  {
    icon: <FiShield className="w-6 h-6 text-primary" />,
    title: 'Secure Storage',
    description: 'Keep your warranty cards and bills safely stored in the cloud.',
  },
  {
    icon: <FiBell className="w-6 h-6 text-warning" />,
    title: 'Smart Reminders',
    description: 'Get notified before your warranty expires to never miss a claim.',
  },
  {
    icon: <FiFileText className="w-6 h-6 text-success" />,
    title: 'Digital Bills',
    description: 'Upload and access your purchase bills from anywhere, anytime.',
  },
  {
    icon: <FiSearch className="w-6 h-6 text-blue-500" />,
    title: 'Quick Search',
    description: 'Find any product details instantly with advanced search.',
  }
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Never Lose a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Warranty Again
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
              The smartest way to digitally organize your electronic purchases, store bills securely, and track warranty expiries in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-200">
                Get Started for Free
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-all transform hover:-translate-y-1">
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why choose WarrantyVault?</h2>
              <p className="mt-4 text-lg text-gray-500">Everything you need to manage your purchases digitally.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
