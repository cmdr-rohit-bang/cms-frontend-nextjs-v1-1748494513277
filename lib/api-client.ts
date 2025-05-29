import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Variable to store the session token after the first request
let token: string | null = null;

// Add a request interceptor to include the token in every request
apiClient.interceptors.request.use(
  async (config:any) => {
    // Fetch session token only if it's not already cached
    if (!token) {
      const session = await getSession();
      if (session && session.user && session.user.token) {
        token = session.user.token;
      }
    }

    // Add the token to the headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (
      error.response &&
      [400, 401, 403, 404, 500].includes(error.response.status)
    ) {
      if (error.response.status === 401 && error.response.data?.jwt) {
        // clearLocalStorage();
      }
      return error.response;
    }
  }
);

export default apiClient;
