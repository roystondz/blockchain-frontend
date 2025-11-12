export const validateUserId = (userId) => {
  if (!userId || userId.trim() === '') {
    return { valid: false, message: 'User ID is required' };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
};

export const validateDate = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, message: 'Invalid date' };
  }
  return { valid: true };
};
