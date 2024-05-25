import ICartRepositoryPort from '../ports/ICartRepositoryPort';

class UpdateCartItemUseCase {
  constructor(private cartRepository: ICartRepositoryPort) {}

  async execute(cartItemId: number, quantity: number): Promise<void> {
    await this.cartRepository.updateCartItem(cartItemId, quantity);
  }
}

export default UpdateCartItemUseCase;
