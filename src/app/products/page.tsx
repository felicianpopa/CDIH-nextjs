"use client";

import React, { useState } from "react";
import { DataTable } from "FE-utils";
import useProductsApi from "@/api/productsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsMapper } from "@/data/ProductsMapper";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

const Products = () => {
  const { getProducts, deleteProduct } = useProductsApi();
  const queryClient = useQueryClient();
  const [dataUrl, setDataUrl] = useState({});

  const {
    data: productsData = [],
    isLoading,
    isError,
  } = useQuery(["productsData", dataUrl], () => getProducts(dataUrl), {
    onError: (error) => {
      console.error("Error fetching productsData: ", error);
    },
    refetchOnWindowFocus: false,
  });

  const mappedProducts = productsData["hydra:member"]
    ? productsData["hydra:member"].map((product: any) =>
        ProductsMapper.map(product)
      )
    : [];

  const deleteProductMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["productsData"]);
    },
    onError: (error) => {
      console.error("Error deleting product: ", error);
    },
  });

  const handleDeleteProduct = async (product: any) => {
    deleteProductMutation.mutate(product);
  };

  const handleDataChange = (value: any) => {
    console.warn("data change ", value);
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
        disabled={deleteProductMutation.isLoading}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

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
            tableActions={tableActions}
            onDataChange={handleDataChange}
            itemsPerPage={[10, 20, 50]}
            dataLoading={isLoading}
            totalItems={productsData["hydra:totalItems"]}
          />
        </>
      </Layout>
    </RequireAuth>
  );
};

export default Products;
