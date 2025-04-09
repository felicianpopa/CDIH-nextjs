import { useAxiosPrivate } from "web-authentication";
import { useConfig } from "../configurations/ConfigProvider";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

interface ClientsParams {
  page?: number;
  items_per_page?: number;
  search?: string;
}

const useClientsApi = () => {
  const config = useConfig();
  const axiosInstance = useAxiosPrivate(
    config.server.apiUrl,
    config.routes.refresh
  );
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const router = useRouter();

  const getClients = async (clientsParams: ClientsParams = {}) => {
    const { page = 1, items_per_page = 10, search = "" } = clientsParams;
    const token = cookies.bitUser?.token;
    const userId = cookies.bitUserData?.user_id;

    if (!token || !userId) {
      router.push("/login");
      throw new Error("No authentication token or user ID found");
    }

    try {
      const response = await axiosInstance.get(
        `/api/users/${userId}/clients?page=${page}&itemsPerPage=${items_per_page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting the clients:", error);
      router.push("/login");
      throw error;
    }
  };

  const createClient = async (clientData: any) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.post("/api/clients", clientData, {
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        return;
      }
      console.error("Error creating client:", error);
      throw error;
    }
  };

  const saveEditClient = async (clientsParams: any) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    return await axiosInstance.patch(`${clientsParams.id}`, clientsParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/merge-patch+json",
      },
      withCredentials: true,
    });
  };

  const deleteClient = async (client: { id: string }) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    return await axiosInstance.delete(`${client.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  };

  return { getClients, saveEditClient, createClient, deleteClient };
};

export default useClientsApi;
