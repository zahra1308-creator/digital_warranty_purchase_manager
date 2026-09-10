import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productService';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FiUpload, FiPackage, FiCalendar, FiDollarSign, FiInfo, FiArrowLeft } from 'react-icons/fi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyMonths: '',
    serialNumber: '',
    modelNumber: '',
    storeName: '',
    notes: '',
    billURL: ''
  });
  
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Product not found");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProduct(id, formData, file);
      toast.success('Product updated successfully!');
      navigate(`/product/${id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Link to={`/product/${id}`} className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6 text-sm font-medium">
        <FiArrowLeft className="mr-2" /> Cancel Edit
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-2">Update details for {formData.productName}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Details */}
            <div className="md:col-span-2 border-b border-gray-100 pb-4 mb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiPackage className="text-primary" /> Basic Details
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input type="text" name="productName" required value={formData.productName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input type="text" name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-700">
                <option value="">Select Category</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="TV">TV & Home Theater</option>
                <option value="Home Appliance">Home Appliance</option>
                <option value="Audio">Audio & Headphones</option>
                <option value="Other">Other Electronics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input type="text" name="storeName" value={formData.storeName || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            {/* Purchase & Warranty */}
            <div className="md:col-span-2 border-b border-gray-100 pb-4 mt-4 mb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiCalendar className="text-primary" /> Purchase & Warranty
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
              <input type="date" name="purchaseDate" required value={formData.purchaseDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiDollarSign />
                </div>
                <input type="number" name="purchasePrice" value={formData.purchasePrice || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Period (Months) *</label>
              <input type="number" name="warrantyMonths" required value={formData.warrantyMonths} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>
            
            {/* Additional Info */}
            <div className="md:col-span-2 border-b border-gray-100 pb-4 mt-4 mb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiInfo className="text-primary" /> Additional Info
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
              <input type="text" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model Number</label>
              <input type="text" name="modelNumber" value={formData.modelNumber || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea name="notes" rows="3" value={formData.notes || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"></textarea>
            </div>

            {/* Bill Upload */}
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Replace Bill/Invoice (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary hover:bg-blue-50/50 transition-colors cursor-pointer relative">
                <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                      {file ? file.name : (formData.billURL ? 'Upload a new file to replace existing' : 'Upload a file')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/product/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
