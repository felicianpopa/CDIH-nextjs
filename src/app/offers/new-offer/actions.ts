"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mainConfigurations } from "@/configurations/mainConfigurations";

interface OfferFormData {
  client?: string;
  validUntill?: string;
  status: string;
  products: Array<{
    options: Record<string, any>;
  }>;
}

interface OfferResponse {
  id: string;
  products: any[];
  [key: string]: any;
}

/**
 * Add a new offer
 */
export async function createOffer(
  formData: OfferFormData
): Promise<OfferResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("bitUser")?.value;
  const tokenData = token ? JSON.parse(decodeURIComponent(token)) : null;

  if (!tokenData?.token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      `${mainConfigurations.server.apiUrl}${mainConfigurations.routes.offers}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create offer");
    }

    const data = await response.json();

    // Revalidate the offers page
    revalidatePath("/offers");

    return data;
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
}

/**
 * Update an existing offer
 */
export async function updateOffer(
  offerId: string,
  formData: OfferFormData
): Promise<OfferResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("bitUser")?.value;
  const tokenData = token ? JSON.parse(decodeURIComponent(token)) : null;

  if (!tokenData?.token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      `${mainConfigurations.server.apiUrl}${mainConfigurations.routes.offers}/${offerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update offer");
    }

    const data = await response.json();

    // Revalidate the offers page and the current offer page
    revalidatePath("/offers");
    revalidatePath(`/offers/new-offer?offer_id=${offerId}`);

    return data;
  } catch (error) {
    console.error("Error updating offer:", error);
    throw error;
  }
}

/**
 * Get offer details - this can be used for initial data loading
 */
export async function getOfferDetails(offerId: string): Promise<OfferResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("bitUser")?.value;
  const tokenData = token ? JSON.parse(decodeURIComponent(token)) : null;

  if (!tokenData?.token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      `${mainConfigurations.server.apiUrl}${mainConfigurations.routes.offers}/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        next: {
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch offer: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching offer:", error);
    throw error;
  }
}
