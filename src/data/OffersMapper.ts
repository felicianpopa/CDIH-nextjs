interface OfferClient {
  firstName?: string;
  lastName?: string;
}

interface OfferResponse {
  "@id": string;
  status: string;
  client?: OfferClient;
  products: any[];
}

export class OffersMapper {
  id: string;
  status: string;
  client: string;
  products: any[];

  constructor(response: OfferResponse) {
    this.id = response["@id"].split("/").pop() || "";
    this.status = response.status;
    this.client = response.client
      ? (response.client.firstName || "") +
        " " +
        (response.client.lastName || "")
      : "-";
    this.products = response.products;
  }

  static map(data: OfferResponse): OffersMapper {
    return new OffersMapper(data);
  }
}
