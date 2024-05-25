import ProductEntity from '../../domain/entities/ProductEntity';
import IProductRepositoryPort from '../ports/IProductRepositoryPort';

class ListProductsUseCase {
  constructor(private productRepository: IProductRepositoryPort) {}

  async execute(): Promise<ProductEntity[]> {
    return await this.productRepository.list();
  }
}

export default ListProductsUseCase;
