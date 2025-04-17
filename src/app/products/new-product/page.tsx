"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProductsApi from "@/api/productsApi";
import { DynamicForm } from "Frontend-utils";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

const NewProduct = () => {
  const { createProduct } = useProductsApi();
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsData"] });
    },
    onError: (error) => {
      console.error("Error adding product: ", error);
    },
  });

  const handleSubmitData = (formData: any) => {
    console.warn("form data ", formData);
    createProductMutation.mutate(formData);
  };

  const formData = {
    formTitle: "",
    formSections: [
      {
        sectionName: "General information",
        formFields: [
          {
            name: "name",
            label: "Product Name",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
          {
            name: "description",
            label: "Description",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
          {
            name: "sku",
            label: "Sku",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
          {
            name: "category",
            label: "category",
            type: "select",
            placeholder: "",
            initialValue: "",
            options: [
              {
                value: "cat1",
                label: "cat1",
              },
              {
                value: "cat2",
                label: "cat2",
              },
              {
                value: "",
                label: "Category",
              },
            ],
            validations: {
              required: "This input is required.",
            },
          },
          {
            name: "status",
            label: "status",
            type: "select",
            placeholder: "",
            initialValue: "",
            options: [
              {
                value: "draft",
                label: "draft",
              },
              {
                value: "published",
                label: "published",
              },
              {
                value: "",
                label: "Select status",
              },
            ],
            validations: {
              required: "This input is required.",
            },
          },
        ],
      },
      {
        sectionName: "Inventory",
        formFields: [
          {
            name: "quantity",
            label: "Quantity",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
          {
            name: "unitMeasure",
            label: "Unit Measure",
            type: "select",
            placeholder: "",
            initialValue: "",
            options: [
              {
                value: "pc",
                label: "pc",
              },
              {
                value: "m2",
                label: "m2",
              },
              {
                value: "",
                label: "Unit Measure",
              },
            ],
            validations: {
              required: "This input is required.",
            },
          },
          {
            name: "increment",
            label: "Increment",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
        ],
      },
      {
        sectionName: "Pricing",
        formFields: [
          {
            name: "price",
            label: "Price",
            type: "text",
            placeholder: "",
            validations: {
              required: "This input is required.",
            },
            initialValue: "",
          },
        ],
      },
    ],
  };

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <div className="row gy-2 my-4">
            <div className="col-12 col-md-6">
              <h1>New Product: </h1>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <DynamicForm formData={formData} submitData={handleSubmitData}>
                <button
                  disabled={createProductMutation.isPending}
                  type="submit"
                  className="btn btn-primary"
                >
                  {createProductMutation.isPending
                    ? "Saving..."
                    : "Save product"}
                </button>
              </DynamicForm>
            </div>
          </div>
        </>
      </Layout>
    </RequireAuth>
  );
};

export default NewProduct;
