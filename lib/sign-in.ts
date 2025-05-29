import axios from "axios";
export const SignIn = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
      {
        email,
        password,
      }
    );
    const user = response.data;
    if (user) {
      return user;
    } else {
      throw new Error("Invalid credentials 1");
    }
  } catch (error) {
    throw new Error("Failed to authenticate 2");
  }
};
