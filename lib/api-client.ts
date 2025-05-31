// import axios from 'axios';
// import { getSession } from 'next-auth/react';

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL
// });

// // Variable to store the session token after the first request
// let token: string | null = null;

// // Add a request interceptor to include the token in every request
// apiClient.interceptors.request.use(
//   async (config:any) => {
//     // Fetch session token only if it's not already cached
//     if (!token) {
//       const session = await getSession();
//       if (session && session.user && session.user.accessToken) {
//         token = session.user.accessToken;
//       }
//     }

//     // Add the token to the headers if available
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     if (
//       error.response &&
//       [400, 401, 403, 404, 500].includes(error.response.status)
//     ) {
//       if (error.response.status === 401 && error.response.data?.jwt) {
//         // clearLocalStorage();
//       }
//       return error.response;
//     }
//   }
// );

// export default apiClient;


import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let token: string | null = null;
let role: string | null = null;

// Extract subdomain from the browser's window
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname; // e.g. acme.localhost or acme.example.com
  const parts = host.split('.');

  if (parts.length >= 2) {
    return parts[0]; // 'acme'
  }

  return null;
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config: any) => {
    if (!token || !role) {
      const session = await getSession();
      if (session?.user) {
        token = session.user.accessToken || null;
        role = session.user.role || null;
        console.log("role", role);
      }
    }

    // Always set the token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set host only if role is owner
    if (role === "owner") {
      const subdomain = getSubdomain();
      console.log("subdomain -1", subdomain);
      if (subdomain) {
        console.log("subdomain -2", subdomain);
        config.headers.host = `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
      } else {
        console.warn("Subdomain could not be extracted.");
      }
    }

    // Log the config to debug
    console.log("Request Config:", config);

    return config;
  },
  (error) => {
    if (
      error.response &&
      [400, 401, 403, 404, 500].includes(error.response.status)
    ) {
      if (error.response.status === 401 && error.response.data?.jwt) {
        // Optionally clear cached token/session
      }
      return error.response;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
