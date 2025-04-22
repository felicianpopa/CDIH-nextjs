import { useAuth } from "@/hooks/useAuth";
// Remove the direct import of useConfig since it's already available through useAuth

interface ClientsParams {
  page?: number;
  items_per_page?: number;
  status?: string;
  sortBy?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const useClientsApi = () => {
  // Use the config from the useAuth hook instead
  const { apiRequest, axiosInstance, config } = useAuth();

  const getClients = async (clientsParams: ClientsParams = {}) => {
    const {
      page = 1,
      items_per_page = 10,
      status = "all",
      sortBy = "",
      firstName = "",
      lastName = "",
      email = "",
    } = clientsParams;

    let queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("itemsPerPage", items_per_page.toString());

    if (status && status !== "all") {
      queryParams.append("status", status);
    }

    if (sortBy) {
      queryParams.append("sort", sortBy);
    }

    if (firstName) {
      queryParams.append("firstName", firstName);
    }

    if (lastName) {
      queryParams.append("lastName", lastName);
    }

    if (email) {
      queryParams.append("email", email);
    }

    try {
      // Get the user ID from cookies instead of config
      return await apiRequest(
        `/api/users/${apiRequest.getUserId()}/clients?${queryParams.toString()}`,
        { method: "GET" }
      );
    } catch (error) {
      console.error("Error getting the clients:", error);
      throw error;
    }
  };

  const createClient = async (clientData: any) => {
    try {
      return await apiRequest("/api/clients", {
        method: "POST",
        data: clientData,
        headers: {
          "Content-Type": "application/ld+json",
        },
      });
    } catch (error: any) {
      if (error.response?.status === 500) {
        return;
      }
      console.error("Error creating client:", error);
      throw error;
    }
  };

  const saveEditClient = async (clientsParams: any) => {
    try {
      return await apiRequest(`${clientsParams.id}`, {
        method: "PATCH",
        data: clientsParams,
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      });
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  };

  const deleteClient = async (client: { id: string }) => {
    try {
      return await apiRequest(`${client.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  };

  return { getClients, saveEditClient, createClient, deleteClient };
};

export default useClientsApi;
