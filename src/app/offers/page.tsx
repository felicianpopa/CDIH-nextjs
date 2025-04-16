"use client";

import React, { useState } from "react";
import { DataTable } from "FE-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useOffersApi from "@/api/offersApi";
import { OffersMapper } from "@/data/OffersMapper";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

const Offers = () => {
  const { getOffers, deleteOffer, downloadOffer } = useOffersApi();
  const queryClient = useQueryClient();

  const [dataUrl, setDataUrl] = useState({});

  const {
    data: offersData = [],
    isLoading: offersLoading,
    isError,
    error,
  } = useQuery(["offersData", dataUrl], () => getOffers(dataUrl), {
    onError: (error) => {
      console.error("Error fetching offersData: ", error);
    },
    refetchOnWindowFocus: false,
  });

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
        disabled={deleteOfferMutation.isLoading}
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
    console.warn("data change ", value);
    setDataUrl((prevDataUrl) => ({
      ...prevDataUrl,
      ...value,
    }));
  };

  const deleteOfferMutation = useMutation(deleteOffer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["offersData"]);
    },
    onError: (error) => {
      console.error("Error deleting offer: ", error);
    },
  });

  const handleDeleteOffer = async (client: any) => {
    deleteOfferMutation.mutate(client);
  };

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <h1 className="page-title">Offers</h1>

          {isError && (
            <div>Error fetching offers: {(error as any)?.message}</div>
          )}

          <DataTable
            tableHeaderExtraActions={<ExtraComponent />}
            tableHead={["Id", "Status", "Client", "Actions"]}
            tableBody={mappedOffers}
            shownElements={["id", "status", "client"]}
            itemsPerPage={[5, 10, 20, 50]}
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
