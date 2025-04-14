"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("New offer page error:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="container mt-5">
      <div className="card p-5 text-center">
        <div className="mb-4 text-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
        </div>
        <h2>Something went wrong</h2>
        <p className="mb-4">We couldn't load the offer information.</p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/offers")}
          >
            Return to offers
          </button>
        </div>
      </div>
    </div>
  );
}
