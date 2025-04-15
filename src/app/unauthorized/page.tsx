"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faHome } from "@fortawesome/free-solid-svg-icons";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <FontAwesomeIcon
                  icon={faLock}
                  size="4x"
                  className="text-danger mb-4"
                />
                <h1 className="mb-4">Access Denied</h1>
                <p className="lead mb-4">
                  You don't have permission to access this page. Please contact
                  your administrator if you believe this is a mistake.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="btn btn-primary mt-3"
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
