"use client";

import React, { useState, useRef, useEffect } from "react";
import { Configurator } from "Configurator";
import { useCookies } from "react-cookie";
import { useConfig } from "@/configurations/ConfigProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useOffersApi from "@/api/offersApi";
import useClientsApi from "@/api/clientsApi";
import { ClientsMapper } from "@/data/ClientsMapper";
import { DataCardSimple } from "FE-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import {
  faBox,
  faEnvelope,
  faPen,
  faTrash,
  faFilePdf,
  faClock,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

const NewOffer = () => {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offer_id");
  const { getOffer, addOffer, editOffer } = useOffersApi();
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["bitUser", "bitUserData"]);
  const config = useConfig();
  const [configData, setConfigData] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [configuratorLoading, setConfiguratorLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [validUntill, setValidUntill] = useState("");
  const [offerSummary, setOfferSummary] = useState({
    subtotal: {
      label: "Subtotal",
      value: "$100.00",
    },
    vat: {
      label: "VAT (20%)",
      value: "$20.00",
    },
    total: {
      label: "Total",
      value: "$120.00",
    },
  });

  const [priceValidation, setPriceValidation] = useState({
    status: {
      label: "In progress",
      value: "in_progress",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Smart chat integration would go here
      // Since we're in Next.js, we need to check if we're in the browser
    }
  }, []);

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
            title: "Converstion Rate",
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
      // @ts-ignore - Bootstrap types are not available but this code would work in browser
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
      setIsModalVisible(true);

      modalRef.current.addEventListener("hidden.bs.modal", () => {
        setIsModalVisible(false);
      });
    }
  };

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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setConfigData(data);
      setInitialData(data);
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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTotalPrice(data?.price);
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCalculatePriceAction = (data: any) => {
    const selectedOptions = { selectedOptions: {} };
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      selectedOptions.selectedOptions[key] = value.selectedValue;
    });
    getPrice(selectedOptions);
  };

  const addOfferMutation = useMutation(addOffer, {
    onSuccess: (data) => {
      const offerId = data?.id;

      if (offerId && typeof window !== "undefined") {
        // Update the URL with the offer_id parameter
        const url = new URL(window.location.href);
        url.searchParams.set("offer_id", offerId);
        window.history.pushState({}, "", url);
      }
      queryClient.invalidateQueries(["offersData"]);
      setProducts(data.products);
    },
    onError: (error) => {
      console.error("Error adding offer: ", error);
    },
  });

  const editOfferMutation = useMutation(editOffer, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["offersData"]);
      setProducts(data.products);
    },
    onError: (error) => {
      console.error("Error adding offer: ", error);
    },
  });

  const handleSaveDataAction = (customProducts?: any[]) => {
    setProducts((prevProducts) => {
      const finalProducts = customProducts || prevProducts;

      const offerData: any = {
        ...(selectedClient && { client: `/api/clients/${selectedClient}` }),
        validUntill: validUntill,
        status: orderStatus,
        products: finalProducts.map((product) => {
          const options: Record<string, any> = {};

          if (product.options) {
            Object.keys(product.options).forEach((key) => {
              const option = product.options[key];
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
        ...(offerId && { id: offerId }),
      };

      if (offerId) {
        editOfferMutation.mutate(offerData);
      } else {
        addOfferMutation.mutate(offerData);
      }

      return prevProducts;
    });
  };

  const handleAddProductAction = (data: any) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, data];
      handleSaveDataAction(updatedProducts);
      return updatedProducts;
    });

    if (typeof window !== "undefined" && modalRef.current) {
      // @ts-ignore - Bootstrap types are not available
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    }
  };

  const {
    data: offerData = {},
    isLoading: offerLoading,
    isError: offerError,
  } = useQuery(
    offerId ? ["offerData", offerId] : [],
    () => (offerId ? getOffer(offerId) : Promise.resolve({})),
    {
      enabled: !!offerId,
      onError: (error) => {
        console.error("Error fetching offerData: ", error);
      },
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (offerData?.products) {
      setProducts(offerData.products);
    }
  }, [offerData]);

  // Get clients
  const [selectedClient, setSelectedClient] = useState("");
  const handleSelectClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value);
  };

  const { getClients } = useClientsApi();
  const dataUrl = {};
  const {
    data: clientsData = [],
    isLoading,
    isError,
  } = useQuery(["clientsData", dataUrl], () => getClients(dataUrl), {
    onError: (error) => {
      console.error("Error fetching clientsData: ", error);
    },
    refetchOnWindowFocus: false,
  });

  const mappedClients = clientsData["hydra:member"]
    ? clientsData["hydra:member"].map((client: any) =>
        ClientsMapper.map(client)
      )
    : [];

  const [orderStatus, setOrderStatus] = useState("draft");
  const handleSelectOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value);
  };

  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <>
          <div className="row gy-2 my-4">
            <div className="col-12 col-md-6">
              <h1>New Offer: </h1>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-md-center">
              <button
                className="btn btn-primary"
                onClick={() => handleSaveDataAction()}
              >
                Save offer
              </button>
            </div>
          </div>
          <div className="row gy-2">
            <div className="col-12 col-lg-7 col-xxl-8">
              <div className="row gy-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h3>Client information</h3>
                      <div className="row gy-4">
                        <div className="col-12 col-md-6">
                          <label htmlFor="client" className="form-label">
                            Select client
                          </label>
                          <select
                            value={selectedClient}
                            className="form-select"
                            onChange={handleSelectClient}
                          >
                            <option value="">Please select a client</option>
                            {mappedClients.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.firstName} {item.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="validUntill">
                            Offer Valid Untill
                          </label>
                          <input
                            className="form-control"
                            value={validUntill}
                            type="text"
                            id="validUntill"
                            onChange={(e) => setValidUntill(e.target.value)}
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
                            className="btn btn-link text-decoration-none"
                            onClick={showAddOffer}
                          >
                            + Add Product
                          </button>
                        </div>
                      </div>

                      <ul className="products-list">
                        {products.length === 0 ? (
                          <li className="no-products">
                            <FontAwesomeIcon size="2x" icon={faBox} />
                            You have no products added
                            <button
                              className="btn btn-link text-decoration-none"
                              onClick={showAddOffer}
                            >
                              Configure here
                            </button>
                          </li>
                        ) : (
                          products.map((product, productIndex) => (
                            <li key={productIndex} className="row">
                              <div className="col-2 d-none d-md-block">
                                <div className="product-image">
                                  {product?.image ? (
                                    <img src={product.image} alt="Product" />
                                  ) : (
                                    <FontAwesomeIcon size="2x" icon={faBox} />
                                  )}
                                </div>
                              </div>
                              <div className="product-data col-9 col-md-7">
                                <ul className="row gy-2">
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
                                <button className="btn btn-link p-0 text-primary">
                                  <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button className="btn btn-link p-0 text-danger">
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
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h3>Comments</h3>
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
                  <div className="card">
                    <div className="card-body">
                      <h3>AI Configurator</h3>
                      <div id="aiChatConfigurator"></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card price-validation">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <h3>Ai Price Validation</h3>
                        </div>
                        <div className="col col-md-6 d-flex align-items-start justify-content-md-end">
                          <div
                            className={
                              "price-validation__validation-status " +
                              priceValidation.status.value
                            }
                          >
                            {priceValidation.status.label}
                          </div>
                        </div>
                      </div>
                      {priceValidation.status.value === "in_progress" ? (
                        <div className="price-validation__body">
                          <div className="price-validation__in-progress-message">
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
                            {(priceValidation as any).data?.map(
                              (card: any, index: number) => (
                                <div key={index} className="col-12 col-xl-6">
                                  <DataCardSimple cardData={card} />
                                </div>
                              )
                            )}
                          </div>
                          <div className="price-validation__footer">
                            <h4>Historical Performance</h4>
                            <ul className="mt-0">
                              {(
                                priceValidation as any
                              ).historicalPerformance?.map(
                                (item: any, index: number) => (
                                  <li key={index} className="row gy-2">
                                    <div className="col-6">
                                      <span>{item.label}: </span>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">
                                      <span className="normal">
                                        {item.value}
                                      </span>
                                    </div>
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
                      <ul className="offer-summary">
                        {Object.entries(offerSummary).map(
                          ([key, value], index) => (
                            <li key={index} className="row gy-2">
                              <div className="col-6">
                                <span>{value.label}: </span>
                              </div>
                              <div className="col-6 d-flex justify-content-end">
                                <span className="normal">{value.value}</span>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                      <button className="btn btn-outline-primary w-100">
                        <FontAwesomeIcon className="me-3" icon={faFilePdf} />
                        Download PDF
                      </button>
                      <button className="btn btn-outline-primary w-100 mt-3">
                        <FontAwesomeIcon icon={faEnvelope} className="me-3" />
                        Send via Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  <h5 className="modal-title">Add product:</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid text-center">
                    {isModalVisible && (
                      <Configurator
                        priceLoading={priceLoading}
                        configuratorLoading={configuratorLoading}
                        totalPrice={totalPrice}
                        initialData={initialData}
                        data={configData}
                        saveDataAction={handleAddProductAction}
                        calculatePriceAction={handleCalculatePriceAction}
                      />
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
};

export default NewOffer;
