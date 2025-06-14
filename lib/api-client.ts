// lib/api-client.ts - Updated subdomain detection

import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cache for session data
let cachedToken: string | null = null;
let cachedRole: string | null = null;

// Extract subdomain from the browser's window - FIXED VERSION
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  console.log('🌐 Current hostname:', host);

  // Handle different domain patterns
  
  // 1. Handle initcoders.in domains (bang-ent.initcoders.in)
  if (host.includes('.initcoders.in')) {
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      const subdomain = parts[0];
      console.log('🎯 Extracted subdomain (initcoders.in):', subdomain);
      return subdomain;
    }
  }

  // 2. Handle Vercel domains (bang-ent.cms-v1-theta.vercel.app)
  if (host.includes('.vercel.app')) {
    const parts = host.split('.');
    // Check if it's a subdomain of your main app
    if (parts.length > 4 && host.includes('cms-v1-theta.vercel.app')) {
      const subdomain = parts[0];
      console.log('🎯 Extracted subdomain (vercel.app):', subdomain);
      return subdomain;
    }
  }

  // 3. Handle localhost development
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length >= 2 && parts[0] !== 'www') {
      const subdomain = parts[0];
      console.log('🎯 Extracted subdomain (localhost):', subdomain);
      return subdomain;
    }
  }

  // 4. Handle custom domains - extract from path or headers if needed
  // If you're using custom domains, you might need to get subdomain differently
  
  console.log('⚠️ No subdomain found for hostname:', host);
  return null;
};

// Alternative method: Get subdomain from URL pathname or other sources
const getSubdomainFromContext = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Method 1: Try to get from hostname
  const subdomain = getSubdomain();
  if (subdomain) return subdomain;

  // Method 2: Try to get from URL path (if your routing includes it)
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/s\/([^\/]+)/);
  if (pathMatch) {
    console.log('🎯 Extracted subdomain from path:', pathMatch[1]);
    return pathMatch[1];
  }

  // Method 3: Try to get from localStorage (if you store it there)
  try {
    const storedSubdomain = localStorage.getItem('tenant-subdomain');
    if (storedSubdomain) {
      console.log('🎯 Retrieved subdomain from localStorage:', storedSubdomain);
      return storedSubdomain;
    }
  } catch (error) {
    console.warn('Could not access localStorage:', error);
  }

  // Method 4: Try to extract from referrer or other headers
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      const referrerHost = referrerUrl.hostname;
      
      if (referrerHost.includes('.initcoders.in')) {
        const parts = referrerHost.split('.');
        if (parts.length >= 3 && parts[0] !== 'www') {
          console.log('🎯 Extracted subdomain from referrer:', parts[0]);
          return parts[0];
        }
      }
    } catch (error) {
      console.warn('Could not parse referrer:', error);
    }
  }

  return null;
};

// Create axios instance with proper CORS configuration
const createApiClient = async (): Promise<any> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  console.log('🔗 API Base URL:', baseURL);
  
  const client = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    withCredentials: true, // Important for CORS with credentials
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Add origin header explicitly
      'Origin': typeof window !== 'undefined' ? window.location.origin : '',
    },
  });

  // Request interceptor for auth and tenant context
  client.interceptors.request.use(
    async (config: any) => {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        origin: typeof window !== 'undefined' ? window.location.origin : 'server',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      });

      // Ensure we have fresh session data
      if (!cachedToken || !cachedRole) {
        try {
          const session = await getSession();
          if (session?.user) {
            cachedToken = session.user.accessToken || null;
            cachedRole = session.user.role || null;
            console.log('🔐 Session refreshed:', { role: cachedRole, hasToken: !!cachedToken });
          }
        } catch (error) {
          console.error('❌ Session fetch error:', error);
        }
      }

      // Set authorization header
      if (cachedToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${cachedToken}`;
        console.log('🔑 Authorization header set');
      }

      // CRITICAL: Add subdomain to headers if available
      const subdomain = getSubdomainFromContext();
      if (subdomain) {
        config.headers = config.headers || {};
        config.headers['X-Tenant-Subdomain'] = subdomain;
        console.log('🏢 Tenant subdomain header set:', subdomain);
        
        // Also store in localStorage for future use
        try {
          localStorage.setItem('tenant-subdomain', subdomain);
        } catch (error) {
          console.warn('Could not store subdomain in localStorage:', error);
        }
      } else {
        console.warn('⚠️ No subdomain detected! This may cause API requests to fail.');
        console.log('🔍 Debug info:', {
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
          pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
          origin: typeof window !== 'undefined' ? window.location.origin : 'server',
        });
      }

      // Ensure proper CORS headers
      config.headers = config.headers || {};
      config.headers['Accept'] = 'application/json';
      config.headers['Content-Type'] = 'application/json';
      
      if (typeof window !== 'undefined') {
        config.headers['Origin'] = window.location.origin;
        config.headers['Referer'] = window.location.href;
      }

      console.log('📋 Final request headers:', {
        Authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
        'X-Tenant-Subdomain': config.headers['X-Tenant-Subdomain'],
        Origin: config.headers.Origin,
        'Content-Type': config.headers['Content-Type'],
      });
      
      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and debugging
  client.interceptors.response.use(
    (response) => {
      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        hasData: !!response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Response Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });

      // Handle specific CORS errors
      if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
        console.error('🚫 CORS Error Detected:', {
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          requestUrl: error.config?.baseURL + error.config?.url,
          method: error.config?.method,
          subdomain: getSubdomainFromContext(),
        });
      }

      // Clear cached session on unauthorized
      if (error.response?.status === 401) {
        console.log('🔓 Clearing cached session due to 401');
        cachedToken = null;
        cachedRole = null;
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Enhanced wrapper functions with better error handling
const apiClient = {
  // GET request
  get: async (url: string, config?: any) => {
    try {
      const client = await createApiClient();
      return await client.get(url, config);
    } catch (error) {
      console.error(`❌ GET ${url} failed:`, error);
      throw error;
    }
  },

  // POST request
  post: async (url: string, data?: any, config?: any) => {
    try {
      const client = await createApiClient();
      return await client.post(url, data, config);
    } catch (error) {
      console.error(`❌ POST ${url} failed:`, error);
      throw error;
    }
  },

  // PUT request
  put: async (url: string, data?: any, config?: any) => {
    try {
      const client = await createApiClient();
      return await client.put(url, data, config);
    } catch (error) {
      console.error(`❌ PUT ${url} failed:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (url: string, config?: any) => {
    try {
      const client = await createApiClient();
      return await client.delete(url, config);
    } catch (error) {
      console.error(`❌ DELETE ${url} failed:`, error);
      throw error;
    }
  },

  // PATCH request
  patch: async (url: string, data?: any, config?: any) => {
    try {
      const client = await createApiClient();
      return await client.patch(url, data, config);
    } catch (error) {
      console.error(`❌ PATCH ${url} failed:`, error);
      throw error;
    }
  },

  // Direct axios instance for more complex usage
  create: createApiClient,

  // Health check method for debugging
  healthCheck: async () => {
    try {
      const client = await createApiClient();
      const response = await client.get('/health');
      console.log('✅ Health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  // CORS test method for debugging
  corsTest: async () => {
    try {
      const client = await createApiClient();
      const response = await client.get('/debug/cors');
      console.log('✅ CORS test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ CORS test failed:', error);
      throw error;
    }
  },
};

// Helper function to clear cache (useful for logout)
export const clearApiClientCache = () => {
  console.log('🧹 Clearing API client cache');
  cachedToken = null;
  cachedRole = null;
  try {
    localStorage.removeItem('tenant-subdomain');
  } catch (error) {
    console.warn('Could not clear subdomain from localStorage:', error);
  }
};

// Helper function to manually set subdomain (useful for debugging)
export const setSubdomain = (subdomain: string) => {
  console.log('🔧 Manually setting subdomain:', subdomain);
  try {
    localStorage.setItem('tenant-subdomain', subdomain);
  } catch (error) {
    console.warn('Could not store subdomain in localStorage:', error);
  }
};

// Helper function to get current session info for debugging
export const getSessionInfo = async () => {
  try {
    const session = await getSession();
    return {
      hasSession: !!session,
      role: session?.user?.role,
      hasToken: !!session?.user?.accessToken,
      subdomain: getSubdomainFromContext(),
      origin: typeof window !== 'undefined' ? window.location.origin : 'server',
    };
  } catch (error) {
    console.error('Error getting session info:', error);
    return null;
  }
};

// Export debug information
export const getDebugInfo = () => {
  return {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    subdomain: getSubdomainFromContext(),
    origin: typeof window !== 'undefined' ? window.location.origin : 'server',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
    cachedToken: !!cachedToken,
    cachedRole,
  };
};

export default apiClient;