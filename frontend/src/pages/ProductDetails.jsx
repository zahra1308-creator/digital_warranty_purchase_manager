import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../services/productService';
import { calculateWarrantyStatus, getStatusColor } from '../utils/warrantyUtils';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiDownload, FiArrowLeft, FiBox, FiCalendar, FiFileText, FiTag } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Product not found");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteProduct(id, product.billURL);
        toast.success("Product deleted successfully");
        navigate('/products');
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const warranty = calculateWarrantyStatus(product.purchaseDate, product.warrantyMonths);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6 text-sm font-medium">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
              <FiBox size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
              <p className="text-gray-500 text-lg flex items-center gap-2 mt-1">
                {product.brand && <span>{product.brand}</span>}
                {product.brand && product.category && <span>•</span>}
                {product.category && <span>{product.category}</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={`/edit-product/${product.id}`} className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
              <FiEdit2 /> Edit
            </Link>
            <button onClick={handleDelete} disabled={isDeleting} className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-danger font-medium rounded-xl hover:bg-red-100 transition-colors shadow-sm flex items-center justify-center gap-2">
              <FiTrash2 /> {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Warranty Status Card */}
            <div className={`col-span-1 md:col-span-2 p-6 rounded-2xl border ${getStatusColor(warranty.status)} flex flex-col sm:flex-row justify-between items-center gap-4`}>
              <div>
                <h3 className="text-lg font-bold mb-1">Warranty Status: {warranty.status}</h3>
                <p className="opacity-80">
                  {warranty.isExpired 
                    ? `Expired on ${warranty.expiryDate}` 
                    : `${warranty.daysLeft} days remaining (Expires on ${warranty.expiryDate})`}
                </p>
              </div>
              <div className="text-4xl">
                {warranty.status === 'Active' ? '🛡️' : warranty.status === 'Expiring Soon' ? '⚠️' : '❌'}
              </div>
            </div>

            {/* Purchase Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FiCalendar className="text-primary" /> Purchase Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="text-lg font-medium text-gray-900">{product.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Store Name</p>
                  <p className="text-lg font-medium text-gray-900">{product.storeName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Price</p>
                  <p className="text-lg font-medium text-gray-900">{product.purchasePrice ? `$${product.purchasePrice}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warranty Period</p>
                  <p className="text-lg font-medium text-gray-900">{product.warrantyMonths} Months</p>
                </div>
              </div>
            </div>

            {/* Product Identifiers */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FiTag className="text-primary" /> Identifiers & Notes
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Model Number</p>
                  <p className="text-lg font-medium text-gray-900">{product.modelNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="text-lg font-medium text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{product.serialNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-base text-gray-900 whitespace-pre-wrap">{product.notes || 'No notes added.'}</p>
                </div>
              </div>
            </div>

            {/* Bill Document */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                <FiFileText className="text-primary" /> Document
              </h3>
              
              {product.billURL ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm border border-gray-100">
                      <FiFileText size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Purchase Bill/Invoice</p>
                      <p className="text-sm text-gray-500">Uploaded with product</p>
                    </div>
                  </div>
                  <a 
                    href={product.billURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <FiDownload /> View Document
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <p className="text-gray-500">No bill or invoice uploaded for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
