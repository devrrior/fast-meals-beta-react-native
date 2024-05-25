import ICartRepositoryPort from '../ports/ICartRepositoryPort';

class AddProductToCartUseCase {
  constructor(private cartRepository: ICartRepositoryPort) {}

  async execute(productId: number, quantity: number): Promise<void> {
    await this.cartRepository.addProductToCart(productId, quantity);
  }
}

export default AddProductToCartUseCase;
