import {axiosInstance} from '../../../shared/infrastructure/api/apiConfig';
import IProductRepositoryPort from '../../application/ports/IProductRepositoryPort';
import ProductEntity from '../../domain/entities/ProductEntity';

class ProductRepositoryAdapter implements IProductRepositoryPort {
  async list(): Promise<ProductEntity[]> {
    const response = await axiosInstance.get('/products');

    const products = response.data.data;

    return products.map((product: any) => {
      return new ProductEntity(
        product.id,
        product.title,
        product.image_url,
        product.description,
        product.price,
        product.stock,
      );
    });
  }

  async getById(id: number): Promise<ProductEntity | null> {
    const response = await axiosInstance.get(`/products/${id}`);

    if (response.status === 404) {
      return null;
    }

    const product = response.data.data;

    return new ProductEntity(
      product.id,
      product.title,
      product.image_url,
      product.description,
      product.price,
      product.stock,
    );
  }
}

export default ProductRepositoryAdapter;
