import { ProductModel } from './models/product.model';

export abstract class ProductPort {
  abstract getProducts(type?: string): Promise<ProductModel[]>;
}
