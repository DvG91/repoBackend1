import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/products.json');

export default class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async _readFile() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this._readFile();

    const newId = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields, id: products[index].id };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const updatedProducts = products.filter(p => p.id != id);

    if (products.length === updatedProducts.length) return false;

    await this._writeFile(updatedProducts);
    return true;
  }
}
