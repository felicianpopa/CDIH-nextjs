"use client";

import React, { useState } from "react";
import { DataTable, DataModal } from "FE-utils";
import useClientsApi from "@/api/clientsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientsMapper } from "@/data/ClientsMapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { mainConfigurations } from "@/configurations/mainConfigurations";
import RequireAuth from "@/components/RequireAuth";
import Layout from "@/components/Layout";

// Define interfaces for hydra collection responses
interface HydraCollection<T> {
  "hydra:member": T[];
  "hydra:totalItems": number;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders: any[];
  billingAddresses: any[];
  [key: string]: any;
}

const Clients = () => {
  const { getClients, createClient, saveEditClient, deleteClient } =
    useClientsApi();
  const queryClient = useQueryClient();
  const [dataUrl, setDataUrl] = useState({});

  const {
    data: clientsData = {
      "hydra:member": [],
      "hydra:totalItems": 0,
    } as HydraCollection<any>,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clientsData", dataUrl],
    queryFn: () => getClients(dataUrl),
    refetchOnWindowFocus: false,
  });

  // Log errors when they occur
  React.useEffect(() => {
    if (isError && error) {
      console.error("Error fetching clientsData: ", error);
    }
  }, [isError, error]);

  const mappedClients = clientsData["hydra:member"]
    ? clientsData["hydra:member"].map((client: any) =>
        ClientsMapper.map(client)
      )
    : [];

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsData"] });
    },
    onError: (error: Error) => {
      console.error("Error creating client: ", error);
    },
  });

  const handleCreateClient = async (newClientData: any) => {
    createClientMutation.mutate(newClientData);
  };

  const editClientMutation = useMutation({
    mutationFn: saveEditClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsData"] });
    },
    onError: (error: Error) => {
      console.error("Error creating client: ", error);
    },
  });

  const handleEditClient = async (newClientData: any) => {
    editClientMutation.mutate(newClientData);
  };

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientsData"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting client: ", error);
    },
  });

  const handleDeleteClient = async (client: any) => {
    deleteClientMutation.mutate(client);
  };

  const handleDataChange = (value: any) => {
    console.warn("data change ", value);
    setDataUrl((prevDataUrl) => ({
      ...prevDataUrl,
      ...value,
    }));
  };

  const tableHead = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Orders",
    "Actions",
  ];

  const tableActions = (row: any) => (
    <div>
      <button
        className="btn btn-outline-primary me-2"
        onClick={() => openEditModal(row)}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        className="btn btn-outline-danger"
        onClick={() => handleDeleteClient(row)}
        disabled={deleteClientMutation.isPending}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalData, setModalData] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [ModalAction, setModalAction] = useState<React.ReactNode>(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const hideDataModal = () => {
    setShowDataModal(false);
  };

  // Add new client modal
  const handleAddClient = () => {
    setModalAction(
      <button type="submit" className="btn btn-primary">
        Add Client
      </button>
    );
    setModalTitle(`Add new client`);
    setModalType("newClient");
    const modalData = {
      formTitle: "",
      formSections: [
        {
          sectionName: "User data",
          formFields: [
            {
              name: "firstName",
              label: "First name",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "lastName",
              label: "Last name",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "please insert your email",
              validations: {
                required: "This input is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please inert a valid email",
                },
              },
              initialValue: "",
            },
            {
              name: "phone",
              label: "Telephone",
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
          sectionName: "Billing address",
          formFields: [
            {
              name: "billingAddress.county",
              label: "County",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "billingAddress.city",
              label: "City",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "billingAddress.address",
              label: "Address",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "billingAddress.clientType",
              label: "Client type",
              type: "select",
              placeholder: "",
              initialValue: "person",
              options: [
                {
                  value: "company",
                  label: "company",
                },
                {
                  value: "person",
                  label: "Person",
                },
                {
                  value: "",
                  label: "Client type",
                },
              ],
              validations: {
                required: "This input is required.",
              },
            },
            {
              dependsOn: "billingAddress.clientType",
              conditionToShow: "company",
              name: "billingAddress.companyName",
              label: "company name",
              type: "input",
              placeholder: "",
              initialValue: "",
              validations: {
                required: "This input is required.",
              },
            },
            {
              dependsOn: "billingAddress.clientType",
              conditionToShow: "company",
              name: "billingAddress.vatNumber",
              label: "VAT Number",
              type: "input",
              placeholder: "",
              initialValue: "",
              validations: {
                required: "This input is required.",
              },
            },
            {
              dependsOn: "billingAddress.clientType",
              conditionToShow: "company",
              name: "billingAddress.registrationNumber",
              label: "Registration Number",
              type: "input",
              placeholder: "",
              initialValue: "",
              validations: {
                required: "This input is required.",
              },
            },
            {
              dependsOn: "billingAddress.clientType",
              conditionToShow: "company",
              name: "billingAddress.bank",
              label: "Bank",
              type: "input",
              placeholder: "",
              initialValue: "",
              validations: {
                required: "This input is required.",
              },
            },
            {
              dependsOn: "billingAddress.clientType",
              conditionToShow: "company",
              name: "billingAddress.iban",
              label: "IBAN",
              type: "input",
              placeholder: "",
              initialValue: "",
              validations: {
                required: "This input is required.",
              },
            },
            {
              name: "billingAddress.sameAsShipping",
              label: "Shipping address same as biling address",
              type: "checkbox",
              placeholder: "",
              initialValue: "true",
            },
          ],
        },
        {
          sectionName: "Shipping address",
          dependsOn: "billingAddress.sameAsShipping",
          conditionToShow: "false",
          formFields: [
            {
              name: "shippingAddress.county",
              label: "County",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "shippingAddress.city",
              label: "City",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: "",
            },
            {
              name: "shippingAddress.address",
              label: "Address",
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
    setModalData(modalData);
    setShowDataModal(true);
  };

  const ExtraComponent = () => (
    <button className="btn btn-primary" onClick={() => handleAddClient()}>
      + Add New Client
    </button>
  );

  const openEditModal = (row: any) => {
    console.warn("row ", row.firstName);
    setCurrentRow(row);
    setModalAction(
      <button type="submit" className="btn btn-primary">
        Update Data
      </button>
    );
    setModalTitle(`You are editing ${row.firstName} ${row.lastName}`);
    setModalType("editClient");
    const editModalData = {
      formTitle: "",
      formSections: [
        {
          sectionName: "",
          formFields: [
            {
              name: "firstName",
              label: "First Name",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: row.firstName,
            },
            {
              name: "lastName",
              label: "Last Name",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: row.lastName,
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "please insert your email",
              validations: {
                required: "This input is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please inert a valid email",
                },
              },
              initialValue: row.email,
            },
          ],
        },
        {
          sectionName: "Billing address",
          formFields: [
            {
              name: "billingAddresses[0].county",
              label: "County",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: row.billingAddresses[0].county,
            },
            {
              name: "billingAddresses[0].companyName",
              label: "companyName",
              type: "text",
              placeholder: "",
              validations: {
                required: "This input is required.",
              },
              initialValue: row.billingAddresses[0].companyName,
            },
          ],
        },
      ],
    };
    setModalData(editModalData);
    setShowDataModal(true);
  };

  const handleModalSubmitData = (formData: any) => {
    hideDataModal();

    const updatedBillingAddresses = currentRow?.billingAddresses?.map(
      (address: any, index: number) => ({
        ...address,
        ...(formData.billingAddresses?.[index] || {}),
      })
    );

    const updatedRow = {
      ...currentRow,
      ...formData,
      billingAddresses: updatedBillingAddresses,
    };

    if (modalType === "newClient") {
      handleCreateClient(updatedRow);
    }
    if (modalType === "editClient") {
      handleEditClient(updatedRow);
    }
  };

  if (isError) {
    return <div>Error loading clients. Please try again later.</div>;
  }

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <h1 className="page-title">Clients Management</h1>

          <DataTable
            tableHeaderExtraActions={<ExtraComponent />}
            tableHead={tableHead}
            tableBody={mappedClients}
            shownElements={[
              "firstName",
              "lastName",
              "email",
              "phone",
              "orders",
            ]}
            tableActions={tableActions}
            onDataChange={handleDataChange}
            itemsPerPage={[10, 20, 50]}
            dataLoading={isLoading}
            totalItems={clientsData["hydra:totalItems"]}
          />
          <DataModal
            showDataModal={showDataModal}
            hideDataModal={hideDataModal}
            modalData={modalData}
            modalTitle={modalTitle}
            ModalAction={ModalAction}
            onModalSubmitData={handleModalSubmitData}
          />
        </>
      </Layout>
    </RequireAuth>
  );
};

export default Clients;
