import React from 'react';
import { Link } from 'react-router-dom';
import { calculateWarrantyStatus, getStatusColor } from '../utils/warrantyUtils';
import { FiBox, FiCalendar, FiChevronRight } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const warranty = calculateWarrantyStatus(product.purchaseDate, product.warrantyMonths);
  
  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
        
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 flex-shrink-0">
              <FiBox size={24} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-900 truncate" title={product.productName}>{product.productName}</h3>
              <p className="text-sm text-gray-500 truncate">{product.brand || product.category || 'Uncategorized'}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${getStatusColor(warranty.status)}`}>
            {warranty.status}
          </div>
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1"><FiCalendar /> Purchase</span>
            <span className="font-medium text-gray-900">{product.purchaseDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1"><FiCalendar /> Expiry</span>
            <span className="font-medium text-gray-900">{warranty.expiryDate || 'N/A'}</span>
          </div>
          
          <div className="pt-3 mt-3 border-t border-gray-50 flex justify-between items-center text-sm">
            <span className={`font-semibold ${warranty.isExpired ? 'text-danger' : 'text-primary'}`}>
              {warranty.isExpired ? 'Expired' : `${warranty.daysLeft} days left`}
            </span>
            <span className="text-gray-400 group-hover:text-primary transition-colors flex items-center text-xs">
              View Details <FiChevronRight />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
