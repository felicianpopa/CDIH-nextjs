import { Metadata } from "next";
import { Suspense } from "react";
import NewOfferClient from "./NewOfferClient";
import { getOfferDetails } from "./actions";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "New Offer - App Ofertare",
  description: "Create or edit offers for your clients",
};

export default async function NewOfferPage({
  searchParams,
}: {
  searchParams: { offer_id?: string };
}) {
  // If there's an offer_id, pre-fetch the offer data on the server
  let initialOfferData = null;
  if (searchParams.offer_id) {
    try {
      initialOfferData = await getOfferDetails(searchParams.offer_id);
    } catch (error) {
      console.error("Error pre-fetching offer data:", error);
      // Let the error boundary handle it
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <NewOfferClient
        offerId={searchParams.offer_id}
        initialData={initialOfferData}
      />
    </Suspense>
  );
}
