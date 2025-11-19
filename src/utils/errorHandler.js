/**
 * Shared Error Handler Utility
 * Extracts error messages from various API response formats
 */

/**
 * Extract error message from API response
 * @param {Error} error - The error object from catch block
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} - Formatted error message
 */
export const getErrorMessage = (error, defaultMessage = 'Đã xảy ra lỗi') => {
    // Check if error has response from server
    if (error?.response?.data) {
        const data = error.response.data;
        
        // Backend error format: {success: false, errors: [{code, message}], meta: {...}}
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            const firstError = data.errors[0];
            if (typeof firstError === 'object' && firstError.message) {
                return firstError.message;
            }
            return typeof firstError === 'string' ? firstError : defaultMessage;
        }
        
        // Fallback formats
        if (data.message) {
            return data.message;
        }
        
        if (data.error) {
            return data.error;
        }
        
        if (data.detail) {
            return data.detail;
        }
    }
    
    // Direct error object: {success: false, errors: [...]}
    if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        const firstError = error.errors[0];
        if (typeof firstError === 'object' && firstError.message) {
            return firstError.message;
        }
        return typeof firstError === 'string' ? firstError : defaultMessage;
    }
    
    // Check if error has direct message
    if (error?.message) {
        return error.message;
    }
    
    // Check if error is string
    if (typeof error === 'string') {
        return error;
    }
    
    // Return default message
    return defaultMessage;
};

/**
 * Extract success message from API response
 * @param {Object} response - The response object from API
 * @param {string} defaultMessage - Default success message
 * @returns {string} - Formatted success message
 */
export const getSuccessMessage = (response, defaultMessage = 'Thành công!') => {
    if (response?.data?.message) {
        return response.data.message;
    }
    
    if (response?.message) {
        return response.message;
    }
    
    return defaultMessage;
};
