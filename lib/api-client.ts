// import axios from 'axios';
// import { getSession } from 'next-auth/react';

// // Cache for session data
// let cachedToken: string | null = null;
// let cachedRole: string | null = null;

// // Extract subdomain from the browser's window
// const getSubdomain = (): string | null => {
//   if (typeof window === 'undefined') return null;

//   const host = window.location.hostname; // e.g. acme.localhost or acme.example.com
//   const parts = host.split('.');

//   if (parts.length >= 2 && parts[0] !== 'www') {
//     return parts[0]; // 'acme'
//   }

//   return null;
// };

// // Get the correct API base URL based on role and subdomain
// const getApiBaseUrl = async (): Promise<string> => {
//   // Get session if not cached
//   if (!cachedToken || !cachedRole) {
//     const session = await getSession();
//     if (session?.user) {
//       cachedToken = session.user.accessToken || null;
//       cachedRole = session.user.role || null;
//     }
//   }

//   // If user is owner, use subdomain-based URL
//   if (cachedRole === "owner") {
//     const subdomain = getSubdomain();
//     if (subdomain && subdomain !== 'localhost') {
//       // This will automatically set the correct host header
//       return `http://${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
//     }
//   }

//   // Default API URL
//   return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// };

// // Create axios instance with dynamic configuration
// const createApiClient = async () => {
//   const baseURL = await getApiBaseUrl();
  
//   const client = axios.create({
//     baseURL,
//   });

//   // Request interceptor for auth
//   client.interceptors.request.use(
//     async (config:any) => {
//       // Ensure we have fresh session data
//       if (!cachedToken || !cachedRole) {
//         const session = await getSession();
//         if (session?.user) {
//           cachedToken = session.user.accessToken || null;
//           cachedRole = session.user.role || null;
//         }
//       }

//       // Set authorization header
//       if (cachedToken) {
//         config.headers.Authorization = `Bearer ${cachedToken}`;
//       }

//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   // Response interceptor for error handling
//   client.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         // Clear cached session on unauthorized
//         cachedToken = null;
//         cachedRole = null;
//       }
//       return Promise.reject(error);
//     }
//   );

//   return client;
// };

// // Wrapper functions that match your current usage
// const apiClient = {
//   // GET request
//   get: async (url: string, config?: any) => {
//     const client = await createApiClient();
//     return client.get(url, config);
//   },

//   // POST request
//   post: async (url: string, data?: any, config?: any) => {
//     const client = await createApiClient();
//     return client.post(url, data, config);
//   },

//   // PUT request
//   put: async (url: string, data?: any, config?: any) => {
//     const client = await createApiClient();
//     return client.put(url, data, config);
//   },

//   // DELETE request
//   delete: async (url: string, config?: any) => {
//     const client = await createApiClient();
//     return client.delete(url, config);
//   },

//   // PATCH request
//   patch: async (url: string, data?: any, config?: any) => {
//     const client = await createApiClient();
//     return client.patch(url, data, config);
//   },

//   // Direct axios instance for more complex usage
//   create: createApiClient
// };

// // Helper function to clear cache (useful for logout)
// export const clearApiClientCache = () => {
//   cachedToken = null;
//   cachedRole = null;
// };

// export default apiClient;



import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cache for session data
let cachedToken: string | null = null;
let cachedRole: string | null = null;

// Extract subdomain from the browser's window
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  const parts = host.split('.');

  if (parts.length >= 2 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
};

// Create axios instance with dynamic configuration
const createApiClient = async () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const client = axios.create({
    baseURL,
  });

  // Request interceptor for auth
  client.interceptors.request.use(
    async (config:any) => {
      // Ensure we have fresh session data
      if (!cachedToken || !cachedRole) {
        const session = await getSession();
        if (session?.user) {
          cachedToken = session.user.accessToken || null;
          cachedRole = session.user.role || null;
        }
      }

      // Set authorization header
      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      }

      // Add subdomain to headers if available
      const subdomain = getSubdomain();
      if (subdomain) {
        config.headers['X-Tenant-Subdomain'] = subdomain;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Rest of the code remains the same...
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        cachedToken = null;
        cachedRole = null;
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Rest of the code remains the same...
// Wrapper functions that match your current usage
const apiClient = {
  // GET request
  get: async (url: string, config?: any) => {
    const client = await createApiClient();
    return client.get(url, config);
  },

  // POST request
  post: async (url: string, data?: any, config?: any) => {
    const client = await createApiClient();
    return client.post(url, data, config);
  },

  // PUT request
  put: async (url: string, data?: any, config?: any) => {
    const client = await createApiClient();
    return client.put(url, data, config);
  },

  // DELETE request
  delete: async (url: string, config?: any) => {
    const client = await createApiClient();
    return client.delete(url, config);
  },

  // PATCH request
  patch: async (url: string, data?: any, config?: any) => {
    const client = await createApiClient();
    return client.patch(url, data, config);
  },

  // Direct axios instance for more complex usage
  create: createApiClient
};

// Helper function to clear cache (useful for logout)
export const clearApiClientCache = () => {
  cachedToken = null;
  cachedRole = null;
};

export default apiClient;