import apiClient from "@/lib/api-client";
import { ApiError } from "@/types/types";

export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (error: any) {
    const apiError: ApiError = {
      message: "Failed to fetch data",
      details: error.message
    };
    
    if (error.response) {
      // Server responded with non-2xx status
      apiError.status = error.response.status;
      apiError.details = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = "No response from server";
    } else {
      // Something else went wrong
      apiError.message = "Network error occurred";
    }
    
    console.error("API Error:", apiError);
    throw apiError;
  }
};

export const addData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};

export const editData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
