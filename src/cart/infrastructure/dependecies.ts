import ICartRepositoryPort from '../application/ports/ICartRepositoryPort';
import AddProductToCartUseCase from '../application/usecases/AddProductToCartUseCase';
import DeleteCartItemUseCase from '../application/usecases/DeleteCartItemUseCase';
import GetCartUseCase from '../application/usecases/GetCartUseCase';
import UpdateCartItemUseCase from '../application/usecases/UpdateCartItemUseCase';
import CartRepositoryAdapter from './adapters/CartRepositoryAdapter';

const cartRepositoryAdapter: ICartRepositoryPort = new CartRepositoryAdapter();

const addProductToCartUseCase = new AddProductToCartUseCase(
  cartRepositoryAdapter,
);
const deleteProductFromCartUseCase = new DeleteCartItemUseCase(
  cartRepositoryAdapter,
);
const getCartUseCase = new GetCartUseCase(cartRepositoryAdapter);
const updateCartItemUseCase = new UpdateCartItemUseCase(cartRepositoryAdapter);

export {
  addProductToCartUseCase,
  deleteProductFromCartUseCase,
  getCartUseCase,
  updateCartItemUseCase,
};
