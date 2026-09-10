import apiCall from './api';

export const registerUser = async (email, password, name) => {
  return await apiCall('/register', {
    method: 'POST',
    body: { email, password, name },
  });
};

export const loginUser = async (email, password) => {
  return await apiCall('/login', {
    method: 'POST',
    body: { email, password },
  });
};

export const logoutUser = async () => {
  return await apiCall('/logout', {
    method: 'POST',
  });
};

export const getCurrentUser = async () => {
  return await apiCall('/me', {
    method: 'GET',
  });
};

// Stub for resetPassword since it's not implemented in the current backend
export const resetPassword = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Reset password request for ${email}`);
      resolve();
    }, 1000);
  });
};
