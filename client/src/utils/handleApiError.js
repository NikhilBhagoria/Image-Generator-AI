/**
 * Converts an Axios error object into a user-friendly error message
 * @param {Error} error - The error object thrown by axios
 * @returns {string} - A readable error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status code outside 2xx
    return error.response.data?.message ||
           error.response.data?.error ||
           `Server error: ${error.response.status}`
  } else if (error.request) {
    // Request was made but no response received (network issue, timeout, etc.)
    return 'No response from server. Please check your internet connection.'
  } else {
    // Something unexpected happened (e.g. invalid URL, config error)
    return error.message || 'An unexpected error occurred.'
  }
}