import dayjs from 'dayjs';

export const calculateWarrantyStatus = (purchaseDate, warrantyMonths) => {
  if (!purchaseDate || !warrantyMonths) return { status: 'Unknown', daysLeft: 0, expiryDate: '' };
  
  const purchase = dayjs(purchaseDate);
  const expiry = purchase.add(Number(warrantyMonths), 'month');
  const today = dayjs();
  
  const daysLeft = expiry.diff(today, 'day');
  
  let status = 'Active';
  if (daysLeft < 0) {
    status = 'Expired';
  } else if (daysLeft <= 30) {
    status = 'Expiring Soon';
  }
  
  return {
    expiryDate: expiry.format('YYYY-MM-DD'),
    daysLeft,
    status,
    isExpired: daysLeft < 0
  };
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'Active': return 'bg-green-50 text-success border-green-200';
    case 'Expiring Soon': return 'bg-orange-50 text-warning border-orange-200';
    case 'Expired': return 'bg-red-50 text-danger border-red-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};
