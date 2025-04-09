interface BillingAddress {
  county: string;
  companyName: string;
  vatNumber: number;
  registrationNumber: number;
  bank: number;
  iban: number;
  city: number | string;
  address: number | string;
}

interface ClientResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders?: number;
  billingAddresses?: BillingAddress[];
}

export class ClientsMapper {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders: number;
  billingAddresses: BillingAddress[];

  constructor(response: ClientResponse) {
    this.id = response.id;
    this.firstName = response.firstName;
    this.lastName = response.lastName;
    this.email = response.email;
    this.phone = response.phone;
    this.orders = response.orders || 0;

    // Ensure billingAddresses is an array and initialize the first element properly
    const billing = response.billingAddresses?.[0] || {};

    this.billingAddresses = [
      {
        county: billing.county || "",
        companyName: billing.companyName || "",
        vatNumber: billing.vatNumber || 123,
        registrationNumber: billing.registrationNumber || 123,
        bank: billing.bank || 123,
        iban: billing.iban || 123,
        city: billing.city || 123,
        address: billing.address || 123,
      },
    ];
  }

  static map(data: ClientResponse): ClientsMapper {
    return new ClientsMapper(data);
  }
}
