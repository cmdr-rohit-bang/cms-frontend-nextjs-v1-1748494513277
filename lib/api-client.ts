// // // import axios from 'axios';
// // // import { getSession } from 'next-auth/react';

// // // const apiClient = axios.create({
// // //   baseURL: process.env.NEXT_PUBLIC_API_URL
// // // });

// // // // Variable to store the session token after the first request
// // // let token: string | null = null;

// // // // Add a request interceptor to include the token in every request
// // // apiClient.interceptors.request.use(
// // //   async (config:any) => {
// // //     // Fetch session token only if it's not already cached
// // //     if (!token) {
// // //       const session = await getSession();
// // //       if (session && session.user && session.user.accessToken) {
// // //         token = session.user.accessToken;
// // //       }
// // //     }

// // //     // Add the token to the headers if available
// // //     if (token) {
// // //       config.headers.Authorization = `Bearer ${token}`;
// // //     }

// // //     return config;
// // //   },
// // //   (error) => {
// // //     if (
// // //       error.response &&
// // //       [400, 401, 403, 404, 500].includes(error.response.status)
// // //     ) {
// // //       if (error.response.status === 401 && error.response.data?.jwt) {
// // //         // clearLocalStorage();
// // //       }
// // //       return error.response;
// // //     }
// // //   }
// // // );

// // // export default apiClient;


// // import axios from 'axios';
// // import { getSession } from 'next-auth/react';

// // const apiClient = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL,
// // });

// // let token: string | null = null;
// // let role: string | null = null;

// // // Extract subdomain from the browser's window
// // const getSubdomain = (): string | null => {
// //   if (typeof window === 'undefined') return null;

// //   const host = window.location.hostname; // e.g. acme.localhost or acme.example.com
// //   const parts = host.split('.');

// //   if (parts.length >= 2) {
// //     return parts[0]; // 'acme'
// //   }

// //   return null;
// // };

// // // Request interceptor
// // apiClient.interceptors.request.use(
// //   async (config: any) => {
// //     if (!token || !role) {
// //       const session = await getSession();
// //       if (session?.user) {
// //         token = session.user.accessToken || null;
// //         role = session.user.role || null;
// //         console.log("role", role);
// //       }
// //     }

// //     // Always set the token if available
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     console.log("role", role);
// //     // Set host only if role is owner
// //     if (role === "owner") {
// //       const subdomain = getSubdomain();
// //       console.log("subdomain -1", subdomain);
// //       if (subdomain) {
// //         console.log("subdomain -2", subdomain);
// //         config.headers.host = `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
// //       } else {
// //         console.warn("Subdomain could not be extracted.");
// //       }
// //     }

// //     // Log the config to debug
// //     console.log("Request Config:", config);

// //     return config;
// //   },
// //   (error) => {
// //     if (
// //       error.response &&
// //       [400, 401, 403, 404, 500].includes(error.response.status)
// //     ) {
// //       if (error.response.status === 401 && error.response.data?.jwt) {
// //         // Optionally clear cached token/session
// //       }
// //       return error.response;
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // export default apiClient;


// import axios from 'axios';
// import { getSession } from 'next-auth/react';

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// let token: string | null = null;
// let role: string | null = null;

// // Extract subdomain from the browser's window
// const getSubdomain = (): string | null => {
//   if (typeof window === 'undefined') return null;

//   const host = window.location.hostname; // e.g. acme.localhost or acme.example.com
//   const parts = host.split('.');

//   if (parts.length >= 2) {
//     return parts[0]; // 'acme'
//   }

//   return null;
// };

// // Request interceptor
// apiClient.interceptors.request.use(
//   async (config: any) => {
//     // Get session and token if not already cached
//     if (!token || !role) {
//       const session = await getSession();
//       if (session?.user) {
//         token = session.user.accessToken || null;
//         role = session.user.role || null;
//         console.log("role", role);
//       }
//     }

//     // Always set the token if available
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     console.log("role", role);
    
//     // Set custom tenant header only if role is owner
//     if (role === "owner") {
//       const subdomain = getSubdomain();
//       console.log("subdomain -1", subdomain);
      
//       if (subdomain) {
//         console.log("subdomain -2", subdomain);
//         // Use custom header instead of 'host' (which browsers don't allow to be overridden)
//         config.headers['X-Tenant-Host'] = `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
//         // Alternative custom headers you can use:
//         // config.headers['X-Original-Host'] = `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
//         // config.headers['X-Tenant-Domain'] = subdomain;
//         // config.headers['X-Subdomain'] = subdomain;
        
//         console.log("Custom tenant header set:", config.headers['X-Tenant-Host']);
//       } else {
//         console.warn("Subdomain could not be extracted.");
//       }
//     }

//     // Log the config to debug
//     console.log("Request Config:", config);

//     return config;
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for better error handling
// apiClient.interceptors.response.use(
//   (response) => {
//     // Return successful responses as-is
//     return response;
//   },
//   (error) => {
//     // Handle specific error cases
//     if (error.response) {
//       const status = error.response.status;
      
//       // Handle common HTTP error codes
//       if ([400, 401, 403, 404, 500].includes(status)) {
//         console.error(`HTTP ${status} Error:`, error.response.data);
        
//         // Handle unauthorized access
//         if (status === 401) {
//           // Clear cached token and role
//           token = null;
//           role = null;
          
//           // Optionally redirect to login or refresh token
//           if (error.response.data?.jwt) {
//             console.log("JWT error detected, clearing session");
//             // You might want to clear the session here
//             // signOut(); // if using next-auth
//           }
//         }
        
//         // Return the error response for handling in components
//         return Promise.reject(error);
//       }
//     } else if (error.request) {
//       // Network error
//       console.error("Network Error:", error.request);
//     } else {
//       // Other errors
//       console.error("Error:", error.message);
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Helper function to clear cached tokens (useful for logout)
// export const clearApiClientCache = () => {
//   token = null;
//   role = null;
// };

// // Helper function to manually set tokens (useful for testing or special cases)
// export const setApiClientTokens = (newToken: string, newRole: string) => {
//   token = newToken;
//   role = newRole;
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

  const host = window.location.hostname; // e.g. acme.localhost or acme.example.com
  const parts = host.split('.');

  if (parts.length >= 2 && parts[0] !== 'www') {
    return parts[0]; // 'acme'
  }

  return null;
};

// Get the correct API base URL based on role and subdomain
const getApiBaseUrl = async (): Promise<string> => {
  // Get session if not cached
  if (!cachedToken || !cachedRole) {
    const session = await getSession();
    if (session?.user) {
      cachedToken = session.user.accessToken || null;
      cachedRole = session.user.role || null;
    }
  }

  // If user is owner, use subdomain-based URL
  if (cachedRole === "owner") {
    const subdomain = getSubdomain();
    if (subdomain && subdomain !== 'localhost') {
      // This will automatically set the correct host header
      return `http://${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
    }
  }

  // Default API URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

// Create axios instance with dynamic configuration
const createApiClient = async () => {
  const baseURL = await getApiBaseUrl();
  
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

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear cached session on unauthorized
        cachedToken = null;
        cachedRole = null;
      }
      return Promise.reject(error);
    }
  );

  return client;
};

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