"use client";

import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import { mainConfigurations } from "@/configurations/mainConfigurations";

const MyAccount = () => {
  return (
    <RequireAuth allowedRoles={[mainConfigurations.user.roles.user]}>
      <Layout>
        <h1>My account</h1>
      </Layout>
    </RequireAuth>
  );
};

export default MyAccount;
