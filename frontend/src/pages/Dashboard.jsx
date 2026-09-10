import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProducts } from '../services/productService';
import { calculateWarrantyStatus } from '../utils/warrantyUtils';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiArrowRight, FiBox, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, expiringSoon: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getUserProducts(currentUser.uid);
        setProducts(data);
        
        let active = 0, expired = 0, expiringSoon = 0;
        
        data.forEach(p => {
          const warranty = calculateWarrantyStatus(p.purchaseDate, p.warrantyMonths);
          if (warranty.status === 'Active') active++;
          else if (warranty.status === 'Expired') expired++;
          else if (warranty.status === 'Expiring Soon') expiringSoon++;
        });
        
        setStats({ total: data.length, active, expired, expiringSoon });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  if (loading) return <Loader />;

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-gray-900">{currentUser?.displayName || currentUser?.email}</span>!</p>
        </div>
        <Link to="/products" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
          View All Products <FiArrowRight />
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
            <FiBox size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Warranty</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.active}</h3>
          </div>
          <div className="w-14 h-14 bg-green-50 text-success rounded-2xl flex items-center justify-center">
            <FiCheckCircle size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Expiring Soon</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.expiringSoon}</h3>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-warning rounded-2xl flex items-center justify-center">
            <FiAlertCircle size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Expired Warranty</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.expired}</h3>
          </div>
          <div className="w-14 h-14 bg-red-50 text-danger rounded-2xl flex items-center justify-center">
            <FiXCircle size={28} />
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Recently Added</h2>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiBox size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Add your first electronic product to start tracking its warranty.</p>
          <Link to="/add-product" className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
            Add New Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
