import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cache for session data
let cachedToken: string | null = null;
let cachedRole: string | null = null;

// Reuse the same subdomain detection logic
const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  
  // Handle initcoders.in domains
  if (host.endsWith('.initcoders.in')) {
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }
  }

  // Handle vercel domains
  if (host.includes('.vercel.app')) {
    const parts = host.split('.');
    if (parts.length > 4 && host.includes('cms-v1-theta.vercel.app')) {
      return parts[0];
    }
  }

  // Handle localhost
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      return parts[0];
    }
  }

  // Fallback to localStorage
  try {
    return localStorage.getItem('tenant-subdomain');
  } catch (error) {
    console.warn('Could not access localStorage:', error);
    return null;
  }
};

const getApiBaseUrl = async (): Promise<string> => {
  if (!cachedToken || !cachedRole) {
    const session = await getSession();
    if (session?.user) {
      cachedToken = session.user.accessToken || null;
      cachedRole = session.user.role || null;
    }
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const createFormDataClient = async () => {
  const baseURL = await getApiBaseUrl();
  
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    async (config: any) => {
      console.log('📤 Form Data Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });

      if (!cachedToken || !cachedRole) {
        const session = await getSession();
        if (session?.user) {
          cachedToken = session.user.accessToken || null;
          cachedRole = session.user.role || null;
        }
      }

      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      }

      const subdomain = getSubdomain();
      if (subdomain) {
        config.headers['X-Tenant-Subdomain'] = subdomain;
      }

      if (typeof window !== 'undefined') {
        config.headers['Origin'] = window.location.origin;
        config.headers['Referer'] = window.location.href;
      }

      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      console.log('📥 Form Data Response:', {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    (error) => {
      console.error('❌ Form Data Error:', {
        status: error.response?.status,
        message: error.message,
      });

      if (error.response?.status === 401) {
        cachedToken = null;
        cachedRole = null;
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// FormData specific wrapper functions
const formDataClient = {
  // Upload single file with optional extra fields
  uploadFile: async (url: string, file: File, extraFields?: Record<string, any>) => {
    const client = await createFormDataClient();
    const formData = new FormData();
    formData.append('file', file);
    
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return client.post(url, formData);
  },

  // Upload multiple files with optional extra fields
  uploadFiles: async (url: string, files: File[], extraFields?: Record<string, any>) => {
    const client = await createFormDataClient();
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return client.post(url, formData);
  },

  // Generic form data submit
  submit: async (url: string, formData: FormData, method: 'POST' | 'PUT' | 'PATCH' = 'POST') => {
    const client = await createFormDataClient();
    switch (method) {
      case 'POST':
        return client.post(url, formData);
      case 'PUT':
        return client.put(url, formData);
      case 'PATCH':
        return client.patch(url, formData);
      default:
        return client.post(url, formData);
    }
  },

  // Direct client access
  create: createFormDataClient
};

// Helper to clear cache
export const clearFormDataClientCache = () => {
  cachedToken = null;
  cachedRole = null;
};

export default formDataClient;