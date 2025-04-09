import { useAxiosPrivate } from "web-authentication";
import { useConfig } from "../configurations/ConfigProvider";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

interface ProductsParams {
  page?: number;
  items_per_page?: number;
  search?: string;
}

const useProductsApi = () => {
  const config = useConfig();
  const axiosInstance = useAxiosPrivate(
    config.server.apiUrl,
    config.routes.refresh
  );
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const router = useRouter();

  const getProducts = async (productsParams: ProductsParams = {}) => {
    const { page = 1, items_per_page = 10, search = "" } = productsParams;
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.get(
        `${config.routes.products}?page=${page}&itemsPerPage=${items_per_page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting the products:", error);
      router.push("/login");
      throw error;
    }
  };

  const createProduct = async (productData: any) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    try {
      const response = await axiosInstance.post(
        config.routes.products,
        productData,
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
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (product: { id: string }) => {
    const token = cookies.bitUser?.token;

    if (!token) {
      router.push("/login");
      throw new Error("No authentication token found");
    }

    return await axiosInstance.delete(
      `${config.routes.products}/${product.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  };

  return { getProducts, createProduct, deleteProduct };
};

export default useProductsApi;
