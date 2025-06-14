import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cache for session data
let cachedToken: string | null = null;
let cachedRole: string | null = null;

// Enhanced subdomain detection for multiple domain patterns
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  console.log('🌐 Detecting subdomain for hostname:', host);

  // 1. Handle initcoders.in domains (bang-ent.initcoders.in)
  if (host.endsWith('.initcoders.in')) {
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      console.log('✅ Subdomain detected (initcoders.in):', parts[0]);
      return parts[0];
    }
  }

  // 2. Handle vercel domains (bang-ent.cms-v1-theta.vercel.app)
  if (host.includes('.vercel.app')) {
    const parts = host.split('.');
    if (parts.length > 4 && host.includes('cms-v1-theta.vercel.app')) {
      console.log('✅ Subdomain detected (vercel.app):', parts[0]);
      return parts[0];
    }
  }

  // 3. Handle localhost development (bang-ent.localhost:3001)
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      console.log('✅ Subdomain detected (localhost):', parts[0]);
      return parts[0];
    }
  }

  // 4. Fallback: try to get from localStorage
  try {
    const stored = localStorage.getItem('tenant-subdomain');
    if (stored) {
      console.log('✅ Subdomain from localStorage:', stored);
      return stored;
    }
  } catch (error) {
    console.warn('Could not access localStorage:', error);
  }

  console.log('⚠️ No subdomain detected for:', host);
  return null;
};

// Get the correct API base URL (keeping your original logic)
const getApiBaseUrl = async (): Promise<string> => {
  // Get session if not cached
  if (!cachedToken || !cachedRole) {
    const session = await getSession();
    if (session?.user) {
      cachedToken = session.user.accessToken || null;
      cachedRole = session.user.role || null;
    }
  }

  // For owner role, use subdomain-based URL (your original logic)
  if (cachedRole === "owner") {
    const subdomain = getSubdomain();
    if (subdomain && subdomain !== 'localhost') {
      const subdomainUrl = `http://${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
      console.log('🔗 Using subdomain-based API URL:', subdomainUrl);
      return subdomainUrl;
    }
  }

  // Default API URL
  const defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  console.log('🔗 Using default API URL:', defaultUrl);
  return defaultUrl;
};

// Create axios instance with proper CORS and headers
const createApiClient = async () => {
  const baseURL = await getApiBaseUrl();
  
  const client = axios.create({
    baseURL,
    withCredentials: true, // Important for CORS
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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

      // CRITICAL: Add subdomain header for tenant context
      const subdomain = getSubdomain();
      if (subdomain) {
        config.headers['X-Tenant-Subdomain'] = subdomain;
        console.log('🏢 Added X-Tenant-Subdomain header:', subdomain);
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem('tenant-subdomain', subdomain);
        } catch (error) {
          console.warn('Could not store subdomain:', error);
        }
      } else {
        console.warn('⚠️ No subdomain found - API may fail for tenant operations');
      }

      // Add CORS headers
      if (typeof window !== 'undefined') {
        config.headers['Origin'] = window.location.origin;
        config.headers['Referer'] = window.location.href;
      }

      console.log('📋 Request headers:', {
        Authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
        'X-Tenant-Subdomain': config.headers['X-Tenant-Subdomain'],
        Origin: config.headers.Origin,
      });

      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data,
      });

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
  try {
    localStorage.removeItem('tenant-subdomain');
  } catch (error) {
    console.warn('Could not clear localStorage:', error);
  }
};

// Helper function to manually set subdomain (for debugging)
export const setSubdomain = (subdomain: string) => {
  try {
    localStorage.setItem('tenant-subdomain', subdomain);
    console.log('🔧 Manually set subdomain:', subdomain);
  } catch (error) {
    console.warn('Could not set subdomain:', error);
  }
};

// Debug helper
export const getDebugInfo = () => {
  return {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    subdomain: getSubdomain(),
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    domainUrlHost: process.env.NEXT_PUBLIC_DOMIAN_URL_HOST,
    cachedRole,
    hasToken: !!cachedToken,
  };
};

export default apiClient;