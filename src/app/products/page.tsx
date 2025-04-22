"use client";

import React, { useState } from "react";
import { DataTable } from "Frontend-utils";
import useProductsApi from "@/api/productsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsMapper } from "@/data/ProductsMapper";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

// Define interfaces for hydra collection responses
interface HydraCollection<T> {
  "hydra:member": T[];
  "hydra:totalItems": number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  unit: string;
  status: string;
  [key: string]: any;
}

// Define filter interfaces
interface FilterOption {
  value: string | number;
  label: string;
}

interface Filter {
  type: "select" | "text";
  urlValue: string;
  label?: string;
  placeholder?: string;
  values?: FilterOption[];
}

const Products = () => {
  const { getProducts, deleteProduct } = useProductsApi();
  const queryClient = useQueryClient();
  const [dataUrl, setDataUrl] = useState({
    items_per_page: 10,
    status: "all",
    sortBy: "name",
    name: "",
    sku: "",
  });

  const {
    data: productsData = {
      "hydra:member": [],
      "hydra:totalItems": 0,
    } as HydraCollection<any>,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["productsData", dataUrl],
    queryFn: () => getProducts(dataUrl),
    refetchOnWindowFocus: false,
    // Only enable the query when dataUrl has some properties (not empty)
    enabled: Object.keys(dataUrl).length > 0,
  });

  // Log errors when they occur
  React.useEffect(() => {
    if (isError && error) {
      console.error("Error fetching productsData: ", error);
    }
  }, [isError, error]);

  const mappedProducts = productsData["hydra:member"]
    ? productsData["hydra:member"].map((product: any) =>
        ProductsMapper.map(product)
      )
    : [];

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsData"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting product: ", error);
    },
  });

  const handleDeleteProduct = async (product: any) => {
    deleteProductMutation.mutate(product);
  };

  const handleDataChange = (value: any) => {
    setDataUrl((prevDataUrl) => ({
      ...prevDataUrl,
      ...value,
    }));
  };

  const tableHead = ["Sku", "Name", "Price", "Unit", "Status", "Actions"];

  const ExtraComponent = () => (
    <Link className="btn btn-success" href="/products/new-product">
      Add Product
    </Link>
  );

  const tableActions = (row: any) => (
    <div>
      <button className="btn btn-outline-primary me-2">
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        className="btn btn-outline-danger"
        onClick={() => handleDeleteProduct(row)}
        disabled={deleteProductMutation.isPending}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  // Configure filters for the DataTable
  const filters: Filter[] = [
    {
      type: "select",
      urlValue: "items_per_page",
      label: "Items per page",
      values: [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
      ],
    },
    {
      type: "select",
      urlValue: "status",
      label: "Status",
      values: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      type: "select",
      urlValue: "sortBy",
      label: "Sort By",
      values: [
        { value: "name", label: "Name" },
        { value: "price", label: "Price" },
        { value: "sku", label: "SKU" },
      ],
    },
    {
      type: "text",
      urlValue: "name",
      placeholder: "Search by name",
    },
    {
      type: "text",
      urlValue: "sku",
      placeholder: "Search by SKU",
    },
  ];

  if (isError) {
    return <div>Error loading products. Please try again later.</div>;
  }

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <h1 className="page-title">Products</h1>

          <DataTable
            tableHeaderExtraActions={<ExtraComponent />}
            tableHead={tableHead}
            tableBody={mappedProducts}
            shownElements={["sku", "name", "price", "unit", "status"]}
            dataLoading={isLoading}
            onDataChange={handleDataChange}
            totalItems={productsData["hydra:totalItems"]}
            tableActions={tableActions}
            filters={filters}
          />
        </>
      </Layout>
    </RequireAuth>
  );
};

export default Products;
