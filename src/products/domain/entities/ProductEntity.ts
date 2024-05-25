class ProductEntity {
  id: number;
  title: string;
  imageURL: string;
  description: string;
  price: number;
  stock: number;

  constructor(
    id: number,
    title: string,
    imageURL: string,
    description: string,
    price: number,
    stock: number,
  ) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }
}

export default ProductEntity;
