interface ProductResponse {
  id?: string;
  sku?: string;
  name?: string;
  description?: string;
  price?: string | number;
  unit?: string;
  status?: string;
}

export class ProductsMapper {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string | number;
  unit: string;
  status: string;

  constructor(response: ProductResponse) {
    this.id = response.id || "-";
    this.sku = response.sku || "-";
    this.name = response.name || "-";
    this.description = response.description || "-";
    this.price = response.price || "-";
    this.unit = response.unit || "-";
    this.status = response.status || "-";
  }

  static map(data: ProductResponse): ProductsMapper {
    return new ProductsMapper(data);
  }
}
