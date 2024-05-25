interface IProductRepositoryPort {
  getById(id: number): Promise<ProductEntity | null>;
  list(): Promise<ProductEntity[]>;
}

export default IProductRepositoryPort;
