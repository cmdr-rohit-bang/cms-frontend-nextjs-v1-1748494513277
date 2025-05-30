import axios from "axios";

export const SignIn = async (email: string, password: string, tenant: boolean , subdomain?: string) => {
  try {
    const endpoint = tenant &&subdomain 
      ? `${process.env.NEXT_PUBLIC_API_URL}/auth/tenant/login`
      : `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`;

    const config = tenant && subdomain 
      ? {
          headers: {
            "Content-Type": "application/json",
            host: `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`,
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
          },
        };

    const response = await axios.post(
      endpoint,
      {
        email,
        password,
      },
      config
    );
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Failed to authenticate");
  }
};