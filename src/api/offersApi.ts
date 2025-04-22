import { useAxiosPrivate } from "web-authentication";
import { useConfig } from "../configurations/ConfigProvider";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

interface OffersParams {
  page?: number;
  items_per_page?: number;
  search?: string;
  sort_by?: string;
}

interface OfferData {
  id?: string;
  client?: string;
  status?: string;
  products?: any[];
  validUntill?: string;
}

const useOffersApi = () => {
  const config = useConfig();
  const axiosInstance = useAxiosPrivate(
    config.server.apiUrl,
    config.routes.refresh
  );
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const router = useRouter();

  const getOffers = async (offersParams: OffersParams = {}) => {
    const {
      page = 1,
      items_per_page = 10,
      search = "",
      sort_by,
    } = offersParams;
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.get(
        `${config.routes.offers}?page=${page}&itemsPerPage=${items_per_page}&search=${search}&sort_by=${sort_by}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting the offers:", error);
      router.push("/login");
      throw error;
    }
  };

  const downloadOffer = async (offerId: string) => {
    const token = cookies.bitUser?.token;
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${config.routes.offers}/export`,
        { offer: `/api/offers/${offerId}` },
        {
          headers: {
            "Content-Type": "application/ld+json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          responseType: "blob",
        }
      );

      // Create a URL for the downloaded file
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  const addOffer = async (offerData: OfferData) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.post(
        config.routes.offers,
        offerData,
        {
          headers: {
            "Content-Type": "application/ld+json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        return;
      }
      console.error("Error creating offer:", error);
      throw error;
    }
  };

  const editOffer = async (offerData: OfferData) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.patch(
        `${config.routes.offers}/${offerData.id}`,
        offerData,
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        return;
      }
      console.error("Error editing offer:", error);
      throw error;
    }
  };

  const getOffer = async (offerId: string) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.get(
        `${config.routes.offers}/${offerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        return;
      }
      console.error("Error getting offer:", error);
      throw error;
    }
  };

  const deleteOffer = async (offer: { id: string }) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    return await axiosInstance.delete(`api/offers/${offer.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  };

  return {
    getOffers,
    getOffer,
    addOffer,
    editOffer,
    deleteOffer,
    downloadOffer,
  };
};

export default useOffersApi;
