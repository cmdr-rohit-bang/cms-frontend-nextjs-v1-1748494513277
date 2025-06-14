import apiClient, { getDebugInfo } from "@/lib/api-client";
import { ApiError } from "@/types/types";

// Enhanced error handler for CORS and other API issues
const handleApiError = (error: any, endpoint: string, operation: string): ApiError => {
  console.error(`❌ ${operation} failed for ${endpoint}:`, error);
  
  // Log debug info on error
  const debugInfo = getDebugInfo();
  console.log('🔍 Debug info:', debugInfo);

  const apiError: ApiError = {
    message: `Failed to ${operation.toLowerCase()}`,
    details: error.message
  };

  // Handle CORS specific errors
  if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
    apiError.message = "CORS Error: Unable to connect to API";
    apiError.details = {
      error: error.message,
      debugInfo,
      suggestion: "Check if the API server is running and CORS is properly configured"
    };
    return apiError;
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    apiError.message = "Network Error: Unable to reach API server";
    apiError.details = {
      error: error.message,
      debugInfo,
      suggestion: "Check your internet connection and API server status"
    };
    return apiError;
  }

  if (error.response) {
    // Server responded with non-2xx status
    apiError.status = error.response.status;
    apiError.details = error.response.data;
    
    // Handle specific status codes
    switch (error.response.status) {
      case 401:
        apiError.message = "Authentication required";
        break;
      case 403:
        apiError.message = "Access forbidden";
        break;
      case 404:
        apiError.message = "Resource not found";
        break;
      case 500:
        apiError.message = "Internal server error";
        break;
    }
  } else if (error.request) {
    // Request was made but no response received
    apiError.message = "No response from server";
    apiError.details = {
      error: "Request timeout or server unreachable",
      debugInfo,
      suggestion: "Check if the API server is running"
    };
  } else {
    // Something else went wrong
    apiError.message = "Unexpected error occurred";
    apiError.details = {
      error: error.message,
      debugInfo
    };
  }

  return apiError;
};

export const fetchData = async (endpoint: string) => {
  try {
    console.log(`📥 Fetching data from: ${endpoint}`);
    const response = await apiClient.get(endpoint);
    console.log(`✅ Data fetched successfully from: ${endpoint}`);
    return response.data || [];
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "fetch data");
    throw apiError;
  }
};

export const addData = async (endpoint: string, data: any) => {
  try {
    console.log(`📤 Adding data to: ${endpoint}`, data);
    const response = await apiClient.post(endpoint, data);
    console.log(`✅ Data added successfully to: ${endpoint}`);
    return response;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "add data");
    throw apiError;
  }
};

export const editData = async (endpoint: string, data: any) => {
  try {
    console.log(`📝 Editing data at: ${endpoint}`, data);
    const response = await apiClient.patch(endpoint, data);
    console.log(`✅ Data edited successfully at: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "edit data");
    throw apiError;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    console.log(`🗑️ Deleting data at: ${endpoint}`);
    const response = await apiClient.delete(endpoint);
    console.log(`✅ Data deleted successfully at: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "delete data");
    throw apiError;
  }
};

export const changeStatus = async (endpoint: string, data: any) => {
  try {
    console.log(`🔄 Changing status at: ${endpoint}`, data);
    const response = await apiClient.post(endpoint, data);
    console.log(`✅ Status changed successfully at: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "change status");
    throw apiError;
  }
};

export const exportData = async (endpoint: string) => {
  const format = 'csv';
  try {
    console.log(`📊 Exporting data from: ${endpoint}`);
    const response: any = await apiClient.get(`${endpoint}`, {
      responseType: 'blob', // Important for file downloads
    });
    
    const blob = new Blob([response.data], {
      type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Data exported successfully from: ${endpoint}`);
    return { success: true };
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "export data");
    throw apiError;
  }
};

export const importData = async (endpoint: string, data: any) => {
  try {
    console.log(`📤 Importing data to: ${endpoint}`, data);
    const response = await apiClient.post(endpoint, data);
    console.log(`✅ Data imported successfully to: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "import data");
    throw apiError;
  }
};

export const deleteBulkData = async (endpoint: string, data: any) => {
  try {
    console.log(`🗑️ Bulk deleting data at: ${endpoint}`, data);
    const response = await apiClient.post(endpoint, data);
    console.log(`✅ Bulk data deleted successfully at: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "bulk delete data");
    throw apiError;
  }
};

export const addTagsAndRemoveTags = async (endpoint: string, data: any) => {
  try {
    console.log(`🏷️ Managing tags at: ${endpoint}`, data);
    const response = await apiClient.post(endpoint, data);
    console.log(`✅ Tags managed successfully at: ${endpoint}`);
    return response.data;
  } catch (error: any) {
    const apiError = handleApiError(error, endpoint, "manage tags");
    throw apiError;
  }
};

export async function verifyOTP(otp: string) {
  if (otp === "111111") {
    return {
      status: "success",
      message: "OTP verified successfully",
    };
  }

  return {
    status: "error",
    message: "Invalid OTP",
  };
}

// Debug function to test API connectivity
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    
    // Test 1: Health check
    const healthResult = await apiClient.healthCheck();
    console.log('✅ Health check passed:', healthResult);
    
    // Test 2: CORS test
    const corsResult = await apiClient.corsTest();
    console.log('✅ CORS test passed:', corsResult);
    
    // Test 3: Try a simple API endpoint
    const testResult = await fetchData('/api/tickets?page=1&limit=1');
    console.log('✅ API endpoint test passed:', testResult);
    
    return {
      success: true,
      results: {
        health: healthResult,
        cors: corsResult,
        api: testResult,
      }
    };
  } catch (error: any) {
    console.error('❌ API connection test failed:', error);
    return {
      success: false,
      error: handleApiError(error, '/api/test', 'test connection'),
    };
  }
};