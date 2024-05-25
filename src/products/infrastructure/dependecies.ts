import IProductRepositoryPort from '../application/ports/IProductRepositoryPort';
import GetByIdProductUseCase from '../application/usecases/GetByIdProductUseCase';
import ListProductsUseCase from '../application/usecases/ListProductsUseCase';
import ProductRepositoryAdapter from './adapters/ProductRepositoryAdapter';

const productRepositoryAdapter: IProductRepositoryPort =
  new ProductRepositoryAdapter();

const listProductsUseCase = new ListProductsUseCase(productRepositoryAdapter);
const getByIdProductUseCase = new GetByIdProductUseCase(
  productRepositoryAdapter,
);

export {listProductsUseCase, getByIdProductUseCase};
