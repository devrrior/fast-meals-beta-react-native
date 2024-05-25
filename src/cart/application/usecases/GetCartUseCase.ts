import CartEntity from '../../domain/entities/CartEntity';
import ICartRepositoryPort from '../ports/ICartRepositoryPort';

class GetCartUseCase {
  constructor(private cartRepository: ICartRepositoryPort) {}

  async execute(): Promise<CartEntity> {
    return await this.cartRepository.getCart();
  }
}

export default GetCartUseCase;
