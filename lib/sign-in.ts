// import axios from "axios";

// export const SignIn = async (email: string, password: string, tenant: boolean, subdomain?: string) => {
//   try {
//     const endpoint = tenant && subdomain 
//       ? `${process.env.NEXT_PUBLIC_API_URL}/auth/tenant/login`
//       : `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`;

//     const headers: { [key: string]: string } = {
//       "Content-Type": "application/json",
//     };

//     if (tenant && subdomain) {

//       headers["X-Tenant-Subdomain"] = subdomain;
//     }

//     const config = { headers };

//     const response = await axios.post(
//       endpoint,
//       {
//         email,
//         password,
//       },
//       config
//     );
    
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error("Invalid credentials");
//     }
//   } catch (error) {
//     console.error("Authentication error:", error);
//     throw new Error("Failed to authenticate");
//   }
// };


import axios from "axios";

interface SignInConfig {
  headers: {
    "Content-Type": string;
    host?: string;
    "X-Tenant-Subdomain"?: string;
  };
}

export const SignIn = async (email: string, password: string, tenant: boolean, subdomain?: string) => {
  try {
    const endpoint = tenant && subdomain
      ? `${process.env.NEXT_PUBLIC_API_URL}/auth/tenant/login`
      : `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`;

    const config: SignInConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (tenant && subdomain) {
      // config.headers.host = `${subdomain}.${process.env.NEXT_PUBLIC_DOMIAN_URL_HOST}`;
      config.headers["X-Tenant-Subdomain"] = subdomain;
    }

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