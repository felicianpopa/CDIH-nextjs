import { Metadata } from "next";
import { Suspense } from "react";
import NewOfferClient from "./NewOfferClient";
import LoadingFallback from "./loading";

export const metadata: Metadata = {
  title: "New Offer - App Ofertare",
  description: "Create or edit offers for your clients",
};

interface PageProps {
  searchParams: {
    offer_id?: string;
  };
}

export default function NewOfferPage({ searchParams }: PageProps) {
  // The middleware already checks authentication and authorization
  // We just need to render the component with proper data
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewOfferClient offerId={searchParams.offer_id} />
    </Suspense>
  );
}
