import ProductEntity from '../../domain/entities/ProductEntity';
import IProductRepositoryPort from '../ports/IProductRepositoryPort';

class GetByIdProductUseCase {
  constructor(private readonly productRepository: IProductRepositoryPort) {}

  async execute(id: number): Promise<ProductEntity> {
    return this.productRepository.getById(id);
  }
}

export default GetByIdProductUseCase;
