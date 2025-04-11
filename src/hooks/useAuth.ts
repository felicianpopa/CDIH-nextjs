import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useAxiosPrivate } from "web-authentication";
import { useConfig } from "@/configurations/ConfigProvider";

export const useAuth = () => {
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const config = useConfig();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Create the axios instance with the authentication handling
  const axiosInstance = useAxiosPrivate(
    config.server.apiUrl,
    config.routes.refresh
  );

  // Check if the user is authenticated
  useEffect(() => {
    const userToken = cookies.bitUser?.token;
    const userData = cookies.bitUserData;

    if (userToken && userData) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [cookies.bitUser, cookies.bitUserData]);

  // Function to handle API requests with authentication
  const apiRequest = async (endpoint: string, options: any = {}) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      withCredentials: true,
    };

    // Merge the default options with the provided options
    const requestOptions = {
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      withCredentials: defaultOptions.withCredentials,
    };

    try {
      const response = await axiosInstance(endpoint, requestOptions);
      return response.data;
    } catch (error: any) {
      // If the error is a 401, redirect to login
      if (error.response?.status === 401) {
        router.push("/login");
      }
      throw error;
    }
  };

  // Add a function to get the user ID
  apiRequest.getUserId = () => {
    return cookies.bitUserData?.user_id || "";
  };

  return {
    isAuthenticated,
    apiRequest,
    axiosInstance,
    config, // Export the config to avoid duplicate imports
  };
};
