
import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cache for session data
let cachedToken: string | null = null;
let cachedRole: string | null = null;

// Extract subdomain from the browser's window
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  console.log('🌐 Current hostname:', host);

  // Handle production domains (cms-v1-theta.vercel.app)
  if (host.includes('cms-v1-theta.vercel.app')) {
    const parts = host.split('.');
    if (parts.length > 3) {
      const subdomain = parts[0];
      console.log('🎯 Extracted subdomain (production):', subdomain);
      return subdomain;
    }
  }

  // Handle localhost development
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length >= 2 && parts[0] !== 'www') {
      const subdomain = parts[0];
      console.log('🎯 Extracted subdomain (localhost):', subdomain);
      return subdomain;
    }
  }

  console.log('⚠️ No subdomain found');
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

      // Add subdomain to headers if available
      const subdomain = getSubdomain();
      if (subdomain) {
        config.headers = config.headers || {};
        config.headers['X-Tenant-Subdomain'] = subdomain;
        console.log('🏢 Tenant subdomain header set:', subdomain);
      }

      // Ensure proper CORS headers
      config.headers = config.headers || {};
      config.headers['Accept'] = 'application/json';
      config.headers['Content-Type'] = 'application/json';
      
      if (typeof window !== 'undefined') {
        config.headers['Origin'] = window.location.origin;
        config.headers['Referer'] = window.location.href;
      }

      console.log('📋 Final request headers:', config.headers);
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
        headers: response.headers,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Response Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        headers: error.response?.headers,
        data: error.response?.data,
      });

      // Handle specific CORS errors
      if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
        console.error('🚫 CORS Error Detected:', {
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          requestUrl: error.config?.baseURL + error.config?.url,
          method: error.config?.method,
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
};

// Helper function to get current session info for debugging
export const getSessionInfo = async () => {
  try {
    const session = await getSession();
    return {
      hasSession: !!session,
      role: session?.user?.role,
      hasToken: !!session?.user?.accessToken,
      subdomain: getSubdomain(),
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
    subdomain: getSubdomain(),
    origin: typeof window !== 'undefined' ? window.location.origin : 'server',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    cachedToken: !!cachedToken,
    cachedRole,
  };
};

export default apiClient;