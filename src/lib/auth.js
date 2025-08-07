/**
 * Authentication utility functions
 * Provides consistent authentication checks across the application
 */

/**
 * Check if user is authenticated
 * @returns {boolean} - true if user is fully authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isOtpVerified = localStorage.getItem("isOtpVerified");
  const userId = localStorage.getItem("userId");
  
  const authenticated = isLoggedIn === "true" && isOtpVerified === "true" && userId !== null;
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth check:', { isLoggedIn, isOtpVerified, userId, authenticated });
  }
  
  return authenticated;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isOtpVerified");
  localStorage.removeItem("userId");
  
  // Clear cookies as well
  document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "isOtpVerified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

/**
 * Set authentication data
 * @param {string} userId - User ID
 */
export const setAuthData = (userId) => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('isOtpVerified', 'true');
  localStorage.setItem('userId', userId);
  
  // Set cookies as well for server-side checks if needed
  document.cookie = `isLoggedIn=true; path=/`;
  document.cookie = `isOtpVerified=true; path=/`;
};

/**
 * Redirect to dashboard with delay to prevent race conditions
 */
export const redirectToDashboard = () => {
  setTimeout(() => {
    window.location.replace("/dashboard");
  }, 100);
};

/**
 * Redirect to login with delay to prevent race conditions
 */
export const redirectToLogin = () => {
  setTimeout(() => {
    window.location.replace("/login");
  }, 100);
};



// Flag to prevent multiple simultaneous redirects
let isRedirecting = false;

/**
 * Check authentication and redirect if already logged in (for login/register pages)
 */
export const redirectIfAuthenticated = () => {
  if (isRedirecting) {
    console.log('Already redirecting, skipping...');
    return true;
  }
  
  if (isAuthenticated()) {
    console.log('User authenticated, redirecting to dashboard...');
    isRedirecting = true;
    redirectToDashboard();
    return true;
  }
  console.log('User not authenticated, staying on current page...');
  return false;
};

/**
 * Check authentication and redirect if needed for protected pages
 * @param {function} router - Next.js router instance
 * @returns {boolean} - true if authenticated, false if redirecting
 */
export const requireAuth = (router) => {
  if (isRedirecting) {
    console.log('Already redirecting, skipping auth check...');
    return false;
  }
  
  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login...');
    isRedirecting = true;
    clearAuthData();
    setTimeout(() => {
      router.replace("/login");
    }, 100);
    return false;
  }
  console.log('User authenticated, allowing access...');
  return true;
};