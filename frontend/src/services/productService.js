import apiCall from './api';

export const addProduct = async (productData, file, userId) => {
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

const transformToCamelCase = (dbObj) => {
  let billURL = dbObj.bill_path;
  if (billURL && billURL.startsWith('/api')) {
    billURL = `http://localhost:5000${billURL}`;
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

export const getUserProducts = async (userId) => {
  // We don't need to pass userId as the backend infers it from the session.
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

export const deleteProduct = async (productId, billURL) => {
  // Bill deletion is out of scope for Week 3/4.
  return await apiCall(`/products/${productId}`, {
    method: 'DELETE',
  });
};
