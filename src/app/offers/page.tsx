"use client";

import React, { useState } from "react";
import { DataTable, BitFilters } from "Frontend-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useOffersApi from "@/api/offersApi";
import { OffersMapper } from "@/data/OffersMapper";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

// Define interfaces for hydra collection responses
interface HydraCollection<T> {
  "hydra:member": T[];
  "hydra:totalItems": number;
}

interface Offer {
  id: string;
  status: string;
  client: any;
  [key: string]: any;
}

// Define filter interfaces and data URL types
interface DataUrlType {
  items_per_page?: number;
  status?: string;
  sortBy?: string;
  sort_by?: string;
  search?: string;
  client?: string;
  offerNumber?: string;
  [key: string]: string | number | undefined;
}

interface FilterOption {
  value: string | number;
  label: string;
}

interface Filter {
  type: "select" | "text";
  urlValue: string; // Changed to strictly string
  label?: string;
  placeholder?: string;
  values?: FilterOption[];
}

const Offers = () => {
  const { getOffers, deleteOffer, downloadOffer } = useOffersApi();
  const queryClient = useQueryClient();

  const [dataUrl, setDataUrl] = useState<DataUrlType>({});

  const {
    data: offersData = {
      "hydra:member": [],
      "hydra:totalItems": 0,
    } as HydraCollection<any>,
    isLoading: offersLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["offersData", dataUrl],
    queryFn: () => getOffers(dataUrl),
    refetchOnWindowFocus: false,
    // Only enable the query when dataUrl has some properties (not empty)
    enabled: Object.keys(dataUrl).length > 0,
  });

  // Log errors when they occur
  React.useEffect(() => {
    if (isError && error) {
      console.error("Error fetching offersData: ", error);
    }
  }, [isError, error]);

  const mappedOffers = offersData["hydra:member"]
    ? offersData["hydra:member"].map((offer: any) => OffersMapper.map(offer))
    : [];

  const ExtraComponent = () => (
    <Link className="btn btn-success" href="/offers/new-offer">
      Add Offer
    </Link>
  );

  const tableActions = (row: any) => (
    <div>
      <button
        onClick={() => handleDownloadPdf(row)}
        className="btn btn-outline-info me-2"
      >
        <FontAwesomeIcon icon={faFilePdf} />
      </button>
      <Link
        className="btn btn-outline-warning me-2"
        href={`/offers/new-offer?offer_id=${row.id}`}
      >
        <FontAwesomeIcon icon={faPen} />
      </Link>
      <button
        onClick={() => handleDeleteOffer(row)}
        disabled={deleteOfferMutation.isPending}
        className="btn btn-outline-danger"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  const handleDownloadPdf = (row: any) => {
    downloadOffer(row.id);
  };

  const handleDataChange = (value: any) => {
    setDataUrl((prevDataUrl) => ({
      ...prevDataUrl,
      ...value,
    }));
  };

  const deleteOfferMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offersData"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting offer: ", error);
    },
  });

  const handleDeleteOffer = async (client: any) => {
    deleteOfferMutation.mutate(client);
  };

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
      urlValue: "sort_by",
      label: "Sort By",
      values: [
        { value: "createdAt", label: "Created Date" },
        { value: "updatedAt", label: "Updated Date" },
        { value: "total", label: "Total Amount" },
      ],
    },
    {
      type: "text",
      urlValue: "search",
      placeholder: "Search",
    },
  ];

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <h1 className="page-title">Offers</h1>

          {isError && (
            <div className="alert alert-danger">
              Error fetching offers: {(error as any)?.message}
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header">
              <h5>Filters</h5>
            </div>
            <div className="card-body">
              <BitFilters filters={filters} onDataChange={handleDataChange} />
            </div>
          </div>

          <DataTable
            tableHeaderExtraActions={<ExtraComponent />}
            tableHead={["Id", "Status", "Client", "Actions"]}
            tableBody={mappedOffers}
            shownElements={["id", "status", "client"]}
            dataLoading={offersLoading}
            onDataChange={handleDataChange}
            totalItems={offersData["hydra:totalItems"]}
            tableActions={tableActions}
          />
        </>
      </Layout>
    </RequireAuth>
  );
};

export default Offers;
