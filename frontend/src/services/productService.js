import apiCall from './api';

export const addProduct = async (productData, file) => {
  const formData = new FormData();
  for (const key in productData) {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }
  if (file) {
    formData.append('billImage', file);
  }

  return await apiCall('/products', {
    method: 'POST',
    body: formData,
  });
};

const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
  }
  return import.meta.env.PROD
    ? 'https://digital-warranty-purchase-manager.onrender.com'
    : 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

const transformToCamelCase = (dbObj) => {
  let billURL = dbObj.bill_path;
  if (billURL && billURL.startsWith('/api')) {
    billURL = `${BACKEND_URL}${billURL}`;
  }

  return {
    id: dbObj.id,
    productName: dbObj.product_name,
    brand: dbObj.brand,
    category: dbObj.category,
    purchaseDate: dbObj.purchase_date,
    purchasePrice: dbObj.purchase_price,
    warrantyMonths: dbObj.warranty_months,
    serialNumber: dbObj.serial_number,
    modelNumber: dbObj.model_number,
    storeName: dbObj.store_name,
    billURL: billURL,
    notes: dbObj.notes,
    createdAt: dbObj.created_at,
  };
};

export const getUserProducts = async () => {
  // The backend infers the user from the session.
  const data = await apiCall('/products', {
    method: 'GET',
  });
  return data.map(transformToCamelCase);
};

export const getProductById = async (productId) => {
  const data = await apiCall(`/products/${productId}`, {
    method: 'GET',
  });
  return transformToCamelCase(data);
};

export const updateProduct = async (productId, updateData, newFile) => {
  const formData = new FormData();
  for (const key in updateData) {
    if (updateData[key] !== null && updateData[key] !== undefined) {
      formData.append(key, updateData[key]);
    }
  }
  if (newFile) {
    formData.append('billImage', newFile);
  }

  return await apiCall(`/products/${productId}`, {
    method: 'PUT',
    body: formData,
  });
};

export const deleteProduct = async (productId) => {
  return await apiCall(`/products/${productId}`, {
    method: 'DELETE',
  });
};
