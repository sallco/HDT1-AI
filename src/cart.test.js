const Cart = require('./cart');

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('updateQuantity', () => {
    test('should add a new product when delta is positive', () => {
      const result = cart.updateQuantity('item1', 5);
      expect(result).toEqual({ productExisted: true, quantity: 5, removed: false });
      expect(cart.getItems()).toEqual([{ productId: 'item1', quantity: 5 }]);
    });

    test('should increase the quantity of an existing product when delta is positive', () => {
      cart.updateQuantity('item1', 3);
      const result = cart.updateQuantity('item1', 2);
      expect(result).toEqual({ productExisted: true, quantity: 5, removed: false });
      expect(cart.getItems()).toEqual([{ productId: 'item1', quantity: 5 }]);
    });

    test('should throw an error when trying to decrease quantity of a non-existent product', () => {
      expect(() => {
        cart.updateQuantity('item1', -1);
      }).toThrow('Cannot decrease quantity of non-existent product: item1');
    });

    test('should decrease the quantity of an existing product', () => {
      cart.updateQuantity('item1', 5);
      const result = cart.updateQuantity('item1', -2);
      expect(result).toEqual({ productExisted: true, quantity: 3, removed: false });
      expect(cart.getItems()).toEqual([{ productId: 'item1', quantity: 3 }]);
    });

    test('should remove the product when the resulting quantity is zero or less', () => {
      cart.updateQuantity('item1', 3);
      const result = cart.updateQuantity('item1', -5);
      expect(result).toEqual({ productExisted: true, quantity: 0, removed: true });
      expect(cart.getItems()).toEqual([]);
    });

    test('should return current state when delta is zero', () => {
      cart.updateQuantity('item1', 5);
      const result = cart.updateQuantity('item1', 0);
      expect(result).toEqual({ productExisted: true, quantity: 5, removed: false });
    });

    test('should return state with productExisted false when delta is zero and product is non-existent', () => {
      const result = cart.updateQuantity('item2', 0);
      expect(result).toEqual({ productExisted: false, quantity: 0, removed: false });
    });
  });

  describe('removeProduct', () => {
    test('should remove an existing product from the cart', () => {
      cart.updateQuantity('item1', 5);
      const result = cart.removeProduct('item1');
      expect(result).toBe(true);
      expect(cart.isEmpty()).toBe(true);
    });

    test('should return false when trying to remove a non-existent product', () => {
      const result = cart.removeProduct('item1');
      expect(result).toBe(false);
    });
  });

  describe('isEmpty', () => {
    test('should return true for a new cart', () => {
      expect(cart.isEmpty()).toBe(true);
    });

    test('should return false when the cart has items', () => {
      cart.updateQuantity('item1', 1);
      expect(cart.isEmpty()).toBe(false);
    });
  });
});
