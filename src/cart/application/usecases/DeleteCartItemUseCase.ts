import ICartRepositoryPort from '../ports/ICartRepositoryPort';

class DeleteCartItemUseCase {
  constructor(private cartRepository: ICartRepositoryPort) {}

  async execute(cartItemId: number): Promise<void> {
    await this.cartRepository.removeProductFromCart(cartItemId);
  }
}

export default DeleteCartItemUseCase;
