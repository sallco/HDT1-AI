const Cart = require('./cart');

function main() {
  const cart = new Cart();
  console.log('Shop 502 - Carrito TUI (POC)');
  return cart;
}

if (require.main === module) {
  main();
}

module.exports = main;
