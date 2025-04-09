export const mainConfigurations = {
  server: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  user: {
    cookiesAge: 86400,
    roles: {
      user: "ROLE_USER",
      admin: "ROLE_USER",
      superAdmin: "ROLE_USER",
    },
  },
  routes: {
    customers: "/api/clients",
    refresh: "api/token/refresh",
    getUserData: "/api/me",
    login: "/api/auth",
    offers: "/api/offers",
    products: "/api/products",
  },
  orderStatuses: [
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Generated",
      value: "generated",
    },
    {
      label: "Sent to client",
      value: "sent_to_client",
    },
    {
      label: "Accepted by client",
      value: "accepter_by_client",
    },
    {
      label: "Rejected by client",
      value: "rejected_by_client",
    },
  ],
};
