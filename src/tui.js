const readline = require('readline');
const Cart = require('./cart');

function parseCommand(input) {
  const normalizedInput = input.trim();

  if (normalizedInput.toLowerCase() === 'bye') {
    return { type: 'bye' };
  }

  const parts = normalizedInput.split(/\s+/);

  if (parts.length !== 2) {
    return { type: 'invalid' };
  }

  const [productId, quantityText] = parts;
  const quantity = Number(quantityText);

  if (!productId || !Number.isInteger(quantity)) {
    return { type: 'invalid' };
  }

  return {
    type: 'cart-update',
    productId,
    quantity,
  };
}

function formatCart(cart) {
  return [
    '| Tu carrito es:',
    ...cart.getItems().map(({ productId, quantity }) => `|   - ${productId} con ${quantity} unidades`),
  ];
}

function getGreetingName(name) {
  return name.trim().split(/\s+/)[0];
}

function processInput(cart, input) {
  const command = parseCommand(input);

  if (command.type === 'bye') {
    return {
      done: true,
      lines: ['| Adiós fue un gusto atenderte!'],
    };
  }

  if (command.type === 'invalid') {
    return {
      done: false,
      lines: ['| Comando inválido. Que más deseas hacer?'],
    };
  }

  const productExists = cart.getItems().some(({ productId }) => productId === command.productId);

  if (!productExists && command.quantity < 0) {
    return {
      done: false,
      lines: [
        `| Oops parece que no tienes el producto ${command.productId} agregado a tu carrito. Que más deseas hacer?`,
      ],
    };
  }

  cart.updateQuantity(command.productId, command.quantity);

  if (cart.isEmpty()) {
    return {
      done: false,
      lines: ['| Tu carrito está vacío, que más deseas hacer?'],
    };
  }

  return {
    done: false,
    lines: [...formatCart(cart), '| Que más deseas hacer?'],
  };
}

function createReadCommand(rl, output) {
  const queuedLines = [];
  const pendingReads = [];

  rl.on('line', (line) => {
    const pendingRead = pendingReads.shift();

    if (pendingRead) {
      pendingRead(line);
      return;
    }

    queuedLines.push(line);
  });

  return () => {
    output.write('> ');

    if (queuedLines.length > 0) {
      return Promise.resolve(queuedLines.shift());
    }

    return new Promise((resolve) => {
      pendingReads.push(resolve);
    });
  };
}

function writeLine(output, line) {
  output.write(`${line}\n`);
}

async function runCartSession({ readCommand, writeSessionLine }) {
  const cart = new Cart();

  writeSessionLine('| Por favor ingrese su nombre.');
  const name = await readCommand();
  writeSessionLine(`| Hola ${getGreetingName(name)}! Que deseas modificar en tu carrito?`);
  let userInput = await readCommand();

  while (true) {
    const result = processInput(cart, userInput);
    result.lines.forEach(writeSessionLine);

    if (result.done) {
      break;
    }

    userInput = await readCommand();
  }
}

async function runTui({ input = process.stdin, output = process.stdout } = {}) {
  const rl = readline.createInterface({ input, output });

  try {
    await runCartSession({
      readCommand: createReadCommand(rl, output),
      writeSessionLine: (line) => writeLine(output, line),
    });
  } finally {
    rl.close();
  }
}

module.exports = {
  formatCart,
  getGreetingName,
  parseCommand,
  processInput,
  runCartSession,
  runTui,
};
