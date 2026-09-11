import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProducts } from '../services/productService';
import { calculateWarrantyStatus } from '../utils/warrantyUtils';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

const Products = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getUserProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  useEffect(() => {
    let result = products;
    
    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.productName.toLowerCase().includes(lowerSearch) || 
        (p.brand && p.brand.toLowerCase().includes(lowerSearch)) ||
        (p.category && p.category.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(p => {
        const warranty = calculateWarrantyStatus(p.purchaseDate, p.warrantyMonths);
        return warranty.status === statusFilter;
      });
    }
    
    setFilteredProducts(result);
  }, [searchTerm, statusFilter, products]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 mt-1">Manage all your digital warranties</p>
        </div>
        <Link to="/add-product" className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2 w-full sm:w-auto justify-center">
          <FiPlus size={20} /> Add Product
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-gray-500 hidden md:block">
            <FiFilter />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">🟢 Active</option>
            <option value="Expiring Soon">🟡 Expiring Soon</option>
            <option value="Expired">🔴 Expired</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiSearch size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'All' 
              ? "Try adjusting your search or filters." 
              : "You haven't added any products yet."}
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <Link to="/add-product" className="mt-4 inline-block text-primary font-medium hover:underline">
              Add your first product
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
