import { Metadata } from "next";
import { Suspense } from "react";
import NewOfferClient from "./NewOfferClient";
import LoadingFallback from "./loading";

export const metadata: Metadata = {
  title: "New Offer - App Ofertare",
  description: "Create or edit offers for your clients",
};

// Use any type to bypass the type checking temporarily
export default function NewOfferPage({ searchParams }: any) {
  // The middleware already checks authentication and authorization
  // We just need to render the component with proper data
  const offerId = searchParams?.offer_id;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewOfferClient offerId={offerId} />
    </Suspense>
  );
}
