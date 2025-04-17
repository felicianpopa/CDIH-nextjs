"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
  useTransition,
} from "react";
import dynamic from "next/dynamic";
import { useCookies } from "react-cookie";
import { useConfig } from "@/configurations/ConfigProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useOffersApi from "@/api/offersApi";
import useClientsApi from "@/api/clientsApi";
import { ClientsMapper } from "@/data/ClientsMapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  faBox,
  faEnvelope,
  faTrash,
  faFilePdf,
  faClock,
  faCircleInfo,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";
import { createOffer, updateOffer } from "./actions";
import LoadingFallback from "./loading";

// Types and interfaces
interface ConfiguratorProps {
  priceLoading: boolean;
  configuratorLoading: boolean;
  totalPrice: number;
  initialData: any;
  data: any;
  saveDataAction: (data: any) => void;
  calculatePriceAction: (data: any) => void;
  emitSelectedOptions: (data: any) => void;
  showSaveButton: boolean;
}

interface PriceValidationState {
  status: {
    label: string;
    value: string;
  };
  suggestedPriceRange?: string;
  data?: Array<{
    title: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    value: string;
  }>;
  historicalPerformance?: Array<{
    label: string;
    value: string;
  }>;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface Product {
  options?: Record<string, any>;
  image?: string;
  [key: string]: any;
}

// Import components dynamically with improved loading states
const DataCardSimple = dynamic(
  () => import("FE-utils").then((mod) => mod.DataCardSimple),
  {
    ssr: false,
    loading: () => (
      <div className="p-2 text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        <span className="ms-2">Loading data card...</span>
      </div>
    ),
  }
);

// Dynamically import Configurator with improved loading state
const ExternalConfigurator = dynamic(
  () => import("Configurator").then((mod) => ({ default: mod.Configurator })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="me-2" size="lg" />
        <p className="mt-2">Loading configurator...</p>
      </div>
    ),
  }
);

// Create a stable wrapper component for Configurator
class ConfiguratorWrapper extends React.PureComponent<ConfiguratorProps> {
  render() {
    return <ExternalConfigurator {...this.props} />;
  }
}

export default function NewOfferClient({
  offerId,
  initialData,
}: {
  offerId?: string;
  initialData?: any;
}) {
  const router = useRouter();
  const { downloadOffer } = useOffersApi();
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const config = useConfig();
  const [configData, setConfigData] = useState<any[]>([]);
  const [initialConfigData, setInitialConfigData] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [configuratorLoading, setConfiguratorLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>(
    initialData?.products || []
  );
  const [validUntill, setValidUntill] = useState(
    initialData?.validUntill || ""
  );
  const [selectedClient, setSelectedClient] = useState("");
  const [orderStatus, setOrderStatus] = useState(
    initialData?.status || "draft"
  );
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Set initial values from server data on component mount
  useEffect(() => {
    if (initialData) {
      setProducts(initialData.products || []);
      setValidUntill(initialData.validUntill || "");
      setOrderStatus(initialData.status || "draft");

      // Set client ID from API response
      if (initialData.client && initialData.client["@id"]) {
        const clientId = initialData.client["@id"].split("/").pop();
        if (clientId) {
          setSelectedClient(clientId);
        }
      }
    }
  }, [initialData]);

  const [offerSummary, setOfferSummary] = useState({
    subtotal: {
      label: "Subtotal",
      value: "$0.00",
    },
    vat: {
      label: "VAT (20%)",
      value: "$0.00",
    },
    total: {
      label: "Total",
      value: "$0.00",
    },
  });

  // Update offer summary whenever products change
  useEffect(() => {
    if (products && products.length > 0) {
      // Calculate total based on products - this is simplified
      // In a real implementation, we would calculate based on actual product prices
      const subtotal = products.reduce((sum, product) => {
        // Example calculation - adjust based on your actual price structure
        return sum + (product.price || 0);
      }, 0);

      const vat = subtotal * 0.2;
      const total = subtotal + vat;

      setOfferSummary({
        subtotal: {
          label: "Subtotal",
          value: `$${subtotal.toFixed(2)}`,
        },
        vat: {
          label: "VAT (20%)",
          value: `$${vat.toFixed(2)}`,
        },
        total: {
          label: "Total",
          value: `$${total.toFixed(2)}`,
        },
      });
    }
  }, [products]);

  const [priceValidation, setPriceValidation] = useState<PriceValidationState>({
    status: {
      label: "In progress",
      value: "in_progress",
    },
  });

  // Price validation simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceValidation({
        status: {
          label: "Optimal Price",
          value: "optimal_price",
        },
        suggestedPriceRange: "$520 - $560",
        data: [
          {
            title: "Conversion Rate",
            icon: "moneyBillTransfer",
            iconBg: "transparent",
            iconColor: "#16A34A",
            value: "85%",
          },
          {
            title: "Similar Offers",
            icon: "server",
            iconBg: "transparent",
            iconColor: "#2563EB",
            value: "127",
          },
        ],
        historicalPerformance: [
          {
            label: "Converted Offers",
            value: "94",
          },
          {
            label: "Non-converted Offers",
            value: "33",
          },
          {
            label: "Average Price",
            value: "$545.00",
          },
        ],
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const showAddOffer = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      // Import Bootstrap dynamically and ensure it's available
      import("bootstrap")
        .then((bootstrap) => {
          if (bootstrap && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalRef.current);
            modal.show();
            setIsModalVisible(true);

            // Add null check before adding event listener
            modalRef.current?.addEventListener("hidden.bs.modal", () => {
              setIsModalVisible(false);
            });
          } else {
            console.error("Bootstrap Modal is not available");
          }
        })
        .catch((err) => {
          console.error("Failed to load Bootstrap:", err);
        });
    }
  };

  // Fetch configurator data with improved error handling
  const getConfigurator = async () => {
    const token = cookies.bitUser?.token;
    setConfiguratorLoading(true);
    try {
      const response = await fetch(
        `${config.server.apiUrl}/api/templates/hardcoded`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store", // Don't cache for this example
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setConfigData(data);
      setInitialConfigData(data);
    } catch (error) {
      console.error("Error fetching configurator:", error);
    } finally {
      setConfiguratorLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      getConfigurator();
    }
  }, [isModalVisible]);

  // Calculate price with improved error handling
  const getPrice = async (calculatorData: any) => {
    const token = cookies.bitUser?.token;
    setPriceLoading(true);
    try {
      const response = await fetch(
        `${config.server.apiUrl}/api/templates/hardcoded/calculate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(calculatorData),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTotalPrice(data?.price);

      // Update offer summary with real calculated data
      if (data?.price) {
        const price = parseFloat(data.price);
        const vat = price * 0.2; // 20% VAT

        setOfferSummary({
          subtotal: {
            label: "Subtotal",
            value: `$${price.toFixed(2)}`,
          },
          vat: {
            label: "VAT (20%)",
            value: `$${vat.toFixed(2)}`,
          },
          total: {
            label: "Total",
            value: `$${(price + vat).toFixed(2)}`,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setPriceLoading(false);
    }
  };

  // Use memoized callbacks for Configurator props
  const handleCalculatePriceAction = useCallback((data: any) => {
    const selectedOptions: { selectedOptions: Record<string, any> } = {
      selectedOptions: {},
    };
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      selectedOptions.selectedOptions[key] = value.selectedValue;
    });
    getPrice(selectedOptions);
  }, []);

  const handleAddProductAction = (data: any) => {
    // First update the products state
    const updatedProducts = [...products, data];
    setProducts(updatedProducts);

    // Close the modal
    if (typeof window !== "undefined" && modalRef.current) {
      import("bootstrap")
        .then((bootstrap) => {
          if (bootstrap && bootstrap.Modal) {
            const modal = bootstrap.Modal.getInstance(modalRef.current);
            if (modal) modal.hide();
          }
        })
        .catch(console.error);
    }
  };

  // Handle offer deletion
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // Add a better notification system
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // Submit handler using server actions
  const handleSaveOffer = async () => {
    setFormError("");
    setIsSaving(true);

    try {
      // Validate form
      if (!selectedClient) {
        setFormError("Please select a client");
        setIsSaving(false);
        return;
      }

      if (products.length === 0) {
        setFormError("Please add at least one product");
        setIsSaving(false);
        return;
      }

      // Prepare form data
      const offerData = {
        client: `/api/clients/${selectedClient}`,
        validUntill: validUntill,
        status: orderStatus,
        products: products.map((product) => {
          const options: Record<string, any> = {};

          if (product.options) {
            Object.keys(product.options).forEach((key) => {
              const option = product.options?.[key];
              if (option?.value) {
                const numericValue = /^[0-9]+$/.test(option.value)
                  ? Number(option.value)
                  : option.value;
                options[key] = numericValue;
              }
            });
          } else {
            Object.keys(product).forEach((key) => {
              const prop = product[key];
              if (prop?.selectedValue) {
                const numericValue = /^[0-9]+$/.test(prop.selectedValue)
                  ? Number(prop.selectedValue)
                  : prop.selectedValue;
                options[key] = numericValue;
              }
            });
          }
          return { options };
        }),
      };

      startTransition(async () => {
        try {
          let result;

          if (offerId) {
            result = await updateOffer(offerId, offerData);
            showNotification("success", "Offer updated successfully!");
          } else {
            result = await createOffer(offerData);
            // Redirect to edit page with new ID
            router.push(`/offers/new-offer?offer_id=${result.id}`);
            showNotification("success", "Offer created successfully!");
          }

          // Update local state with fresh data
          if (result?.products) {
            setProducts(result.products);
          }

          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["offersData"] });
        } catch (error: any) {
          console.error("Error saving offer:", error);
          showNotification("error", error.message || "Failed to save offer");
        } finally {
          setIsSaving(false);
        }
      });
    } catch (error) {
      console.error("Error preparing offer data:", error);
      showNotification("error", "An unexpected error occurred");
      setIsSaving(false);
    }
  };

  // Handle PDF download
  const handleDownloadPdf = () => {
    if (offerId) {
      downloadOffer(offerId);
      showNotification("success", "Downloading PDF...");
    } else {
      showNotification("error", "Please save the offer first to download PDF");
    }
  };

  // Get clients with React Query
  const { getClients } = useClientsApi();
  const {
    data: clientsData = {
      "hydra:member": [],
      "hydra:totalItems": 0,
    } as HydraCollection<any>,
    isLoading: clientsLoading,
    isError: clientsError,
    error: clientsErrorDetails,
  } = useQuery({
    queryKey: ["clientsData"],
    queryFn: () => getClients(),
    refetchOnWindowFocus: false,
    staleTime: 60000, // Consider clients data fresh for 1 minute
  });

  // Handle errors from clients query
  React.useEffect(() => {
    if (clientsError && clientsErrorDetails) {
      console.error("Error fetching clientsData: ", clientsErrorDetails);
      showNotification("error", "Failed to load clients data");
    }
  }, [clientsError, clientsErrorDetails]);

  const mappedClients = clientsData["hydra:member"]
    ? clientsData["hydra:member"].map((client: any) =>
        ClientsMapper.map(client)
      )
    : [];

  // Form field handlers
  const handleSelectClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value);
  };

  const handleSelectOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidUntill(e.target.value);
  };

  // Create stable configurator props object with proper memoization
  const configuratorProps: ConfiguratorProps = {
    priceLoading,
    configuratorLoading,
    totalPrice: totalPrice || 0,
    initialData: initialConfigData,
    data: configData,
    saveDataAction: handleAddProductAction,
    calculatePriceAction: handleCalculatePriceAction,
    emitSelectedOptions: handleCalculatePriceAction,
    showSaveButton: true,
  };

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          {/* Notification Toast */}
          {notification.show && (
            <div
              className={`position-fixed top-0 end-0 p-3 toast show ${
                notification.type === "success" ? "bg-success" : "bg-danger"
              } text-white`}
              style={{ zIndex: 1050 }}
            >
              <div className="toast-header">
                <strong className="me-auto">
                  {notification.type === "success" ? "Success" : "Error"}
                </strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setNotification((prev) => ({ ...prev, show: false }))
                  }
                ></button>
              </div>
              <div className="toast-body">{notification.message}</div>
            </div>
          )}

          <div className="row gy-2 my-4">
            <div className="col-12 col-md-6">
              <h1>{offerId ? "Edit Offer" : "New Offer"}</h1>
              {formError && (
                <div className="alert alert-danger mt-2">{formError}</div>
              )}
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-md-center">
              <button
                className="btn btn-primary"
                disabled={isPending || isSaving || clientsLoading}
                onClick={handleSaveOffer}
              >
                {isPending || isSaving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    {offerId ? "Updating..." : "Saving..."}
                  </>
                ) : offerId ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Update offer
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Save offer
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="row gy-2">
            <div className="col-12 col-lg-7 col-xxl-8">
              <div className="row gy-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h3>Client Information</h3>
                      <div className="row gy-4">
                        <div className="col-12 col-md-6">
                          <label htmlFor="client" className="form-label">
                            Select Client
                          </label>
                          {clientsLoading ? (
                            <div className="form-control placeholder-wave">
                              <span className="placeholder col-12"></span>
                            </div>
                          ) : (
                            <select
                              id="client"
                              value={selectedClient}
                              className="form-select"
                              onChange={handleSelectClient}
                            >
                              <option value="">Please select a client</option>
                              {mappedClients.map((item: Client) => (
                                <option key={item.id} value={item.id}>
                                  {item.firstName} {item.lastName}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="validUntill">
                            Offer Valid Until
                          </label>
                          <input
                            className="form-control"
                            value={validUntill}
                            type="date"
                            id="validUntill"
                            onChange={handleDateChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col col-md-6">
                          <h3>Products</h3>
                        </div>
                        <div className="col col-md-6 d-flex justify-content-md-end">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={showAddOffer}
                          >
                            + Add Product
                          </button>
                        </div>
                      </div>

                      <ul className="products-list mt-3">
                        {products.length === 0 ? (
                          <li className="no-products text-center py-5">
                            <FontAwesomeIcon
                              size="2x"
                              icon={faBox}
                              className="mb-3 text-muted"
                            />
                            <p className="mb-3">You have no products added</p>
                            <button
                              className="btn btn-outline-primary"
                              onClick={showAddOffer}
                            >
                              Configure here
                            </button>
                          </li>
                        ) : (
                          products.map((product, productIndex) => (
                            <li
                              key={productIndex}
                              className="row border-bottom py-3"
                            >
                              <div className="col-2 d-none d-md-block">
                                <div className="product-image">
                                  {product?.image ? (
                                    <img
                                      src={product.image}
                                      alt="Product"
                                      className="img-fluid"
                                    />
                                  ) : (
                                    <div className="bg-light p-3 text-center rounded">
                                      <FontAwesomeIcon
                                        size="2x"
                                        icon={faBox}
                                        className="text-muted"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="product-data col-9 col-md-7">
                                <ul className="row gy-2 list-unstyled">
                                  {Object.entries(product?.options || {}).map(
                                    ([key, entry]: [string, any], index) => (
                                      <li
                                        className="col-12 col-md-6"
                                        key={index}
                                      >
                                        <strong>{key}: </strong>
                                        <span>
                                          {entry.type === "option"
                                            ? entry?.rendererData?.label
                                            : entry?.value}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div className="product-actions gap-2 col-3 d-flex flex-column flex-md-row justify-content-md-end align-items-md-start">
                                <button
                                  className="btn btn-link p-0 text-danger"
                                  onClick={() =>
                                    handleRemoveProduct(productIndex)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-5 col-xxl-4">
              <div className="row gy-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h3>Offer Status</h3>
                      <select
                        value={orderStatus}
                        className="form-select"
                        onChange={handleSelectOrderStatus}
                      >
                        <option value="">Please select a status</option>
                        {config.orderStatuses.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card price-validation">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <h3>AI Price Validation</h3>
                        </div>
                        <div className="col col-md-6 d-flex align-items-start justify-content-md-end">
                          <div
                            className={`badge ${
                              priceValidation.status.value === "optimal_price"
                                ? "bg-success"
                                : "bg-warning"
                            } rounded-pill px-3 py-2`}
                          >
                            {priceValidation.status.label}
                          </div>
                        </div>
                      </div>
                      {priceValidation.status.value === "in_progress" ? (
                        <div className="price-validation__body">
                          <div className="price-validation__in-progress-message text-center py-4">
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              size="2x"
                              className="mb-3"
                            />
                            <h4>AI Price Validation in Progress </h4>
                            <p>Analyzing market data and similar offers...</p>
                          </div>
                          <div className="alert alert-secondary alert-with-icon">
                            <div className="alert-body">
                              <h4>Estimated Time</h4>
                              <p>1-2 minutes</p>
                            </div>
                            <FontAwesomeIcon
                              color="#818181"
                              size="2x"
                              icon={faClock}
                            />
                          </div>
                          <div className="price-validation__footer">
                            <p className="info">
                              <FontAwesomeIcon
                                className="text-info me-2"
                                icon={faCircleInfo}
                              />
                              Our AI is analyzing multiple data points to
                              suggest the optimal price range
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="price-validation__body">
                          <div className="row gy-3">
                            {priceValidation.data?.map((card, index) => (
                              <div key={index} className="col-12 col-xl-6">
                                <Suspense fallback={<LoadingFallback />}>
                                  <DataCardSimple cardData={card} />
                                </Suspense>
                              </div>
                            ))}
                          </div>
                          <div className="price-validation__footer mt-3">
                            <h4>Historical Performance</h4>
                            <ul className="mt-3 list-group list-group-flush">
                              {priceValidation.historicalPerformance?.map(
                                (item, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    <span>{item.label}</span>
                                    <span className="badge bg-primary rounded-pill">
                                      {item.value}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h3>Offer Summary</h3>
                      <ul className="list-group list-group-flush my-3">
                        {Object.entries(offerSummary).map(
                          ([key, value], index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>{value.label}</span>
                              <span
                                className={key === "total" ? "fw-bold" : ""}
                              >
                                {value.value}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={handleDownloadPdf}
                        disabled={!offerId}
                      >
                        <FontAwesomeIcon className="me-2" icon={faFilePdf} />
                        Download PDF
                      </button>
                      <button className="btn btn-outline-secondary w-100 mt-3">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Send via Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for product configuration */}
          <div
            ref={modalRef}
            className="modal fade"
            tabIndex={-1}
            aria-hidden="true"
            data-bs-backdrop="static"
          >
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid text-center">
                    {isModalVisible && configData && (
                      <Suspense fallback={<LoadingFallback />}>
                        <ConfiguratorWrapper {...configuratorProps} />
                      </Suspense>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Layout>
    </RequireAuth>
  );
}
