class Cart {
  constructor() {
    this.items = new Map();
  }

  updateQuantity(productId, delta) {
    if (delta > 0) {
      const current = this.items.get(productId) || 0;
      const quantity = current + delta;
      this.items.set(productId, quantity);
      return { productExisted: true, quantity, removed: false };
    }

    if (delta < 0) {
      if (!this.items.has(productId)) {
        throw new Error(`Cannot decrease quantity of non-existent product: ${productId}`);
      }

      const current = this.items.get(productId);
      const next = current + delta;

      if (next <= 0) {
        this.items.delete(productId);
        return { productExisted: true, quantity: 0, removed: true };
      }

      this.items.set(productId, next);
      return { productExisted: true, quantity: next, removed: false };
    }

    return {
      productExisted: this.items.has(productId),
      quantity: this.items.get(productId) ?? 0,
      removed: false,
    };
  }

  removeProduct(productId) {
    return this.items.delete(productId);
  }

  isEmpty() {
    return this.items.size === 0;
  }

  getItems() {
    return Array.from(this.items.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }
}

module.exports = Cart;
