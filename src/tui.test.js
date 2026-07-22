const Cart = require('./cart');
const { PassThrough } = require('stream');
const { getGreetingName, parseCommand, processInput, runCartSession, runTui } = require('./tui');

describe('parseCommand', () => {
  test('extracts product id and quantity from a valid cart command', () => {
    expect(parseCommand('12345 5')).toEqual({
      type: 'cart-update',
      productId: '12345',
      quantity: 5,
    });
  });

  test('supports extra spaces between command parts', () => {
    expect(parseCommand('  456   -29  ')).toEqual({
      type: 'cart-update',
      productId: '456',
      quantity: -29,
    });
  });

  test('detects the bye command', () => {
    expect(parseCommand('bye')).toEqual({ type: 'bye' });
  });

  test('rejects commands without product id and integer quantity', () => {
    expect(parseCommand('12345')).toEqual({ type: 'invalid' });
    expect(parseCommand('12345 two')).toEqual({ type: 'invalid' });
    expect(parseCommand('12345 1.5')).toEqual({ type: 'invalid' });
  });
});

describe('getGreetingName', () => {
  test('uses the first name from the provided input', () => {
    expect(getGreetingName('Rodrigo Custodio')).toBe('Rodrigo');
  });
});

describe('processInput', () => {
  test('adds products to the cart and prints the cart contents', () => {
    const cart = new Cart();

    expect(processInput(cart, '12345 5')).toEqual({
      done: false,
      lines: ['| Tu carrito es:', '|   - 12345 con 5 unidades', '| Que más deseas hacer?'],
    });
  });

  test('removes product units and prints the empty cart message', () => {
    const cart = new Cart();
    processInput(cart, '12345 5');

    expect(processInput(cart, '12345 -5')).toEqual({
      done: false,
      lines: ['| Tu carrito está vacío, que más deseas hacer?'],
    });
  });

  test('prints a helpful message when removing a missing product', () => {
    const cart = new Cart();

    expect(processInput(cart, '12345 -5')).toEqual({
      done: false,
      lines: [
        '| Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?',
      ],
    });
  });

  test('keeps the cart visible when a product still has units after removal', () => {
    const cart = new Cart();
    processInput(cart, '12345 5');

    expect(processInput(cart, '12345 -2')).toEqual({
      done: false,
      lines: ['| Tu carrito es:', '|   - 12345 con 3 unidades', '| Que más deseas hacer?'],
    });
  });

  test('prints the invalid command message', () => {
    const cart = new Cart();

    expect(processInput(cart, '12345')).toEqual({
      done: false,
      lines: ['| Comando inválido. Que más deseas hacer?'],
    });
  });

  test('ends the conversation with the UX farewell message', () => {
    const cart = new Cart();

    expect(processInput(cart, 'bye')).toEqual({
      done: true,
      lines: ['| Adiós fue un gusto atenderte!'],
    });
  });
});

describe('runCartSession', () => {
  test('runs the console conversation using the UX copy', async () => {
    const inputs = ['Rodrigo Custodio', '12345 5', '12345 -5', 'bye'];
    const transcript = [];

    await runCartSession({
      readCommand: jest.fn().mockImplementation(() => Promise.resolve(inputs.shift())),
      writeSessionLine: (line) => transcript.push(line),
    });

    expect(transcript).toEqual([
      '| Por favor ingrese su nombre.',
      '| Hola Rodrigo! Que deseas modificar en tu carrito?',
      '| Tu carrito es:',
      '|   - 12345 con 5 unidades',
      '| Que más deseas hacer?',
      '| Tu carrito está vacío, que más deseas hacer?',
      '| Adiós fue un gusto atenderte!',
    ]);
  });
});

describe('runTui', () => {
  test('supports input piped through stdin', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let transcript = '';

    output.on('data', (chunk) => {
      transcript += chunk.toString();
    });

    const session = runTui({ input, output });

    input.write('Rodrigo Custodio\n');
    input.write('12345 5\n');
    input.write('12345 -5\n');
    input.write('bye\n');
    input.end();

    await session;

    expect(transcript).toContain('| Por favor ingrese su nombre.\n> ');
    expect(transcript).toContain('| Hola Rodrigo! Que deseas modificar en tu carrito?\n> ');
    expect(transcript).toContain('| Tu carrito es:\n|   - 12345 con 5 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Tu carrito está vacío, que más deseas hacer?\n> ');
    expect(transcript).toContain('| Adiós fue un gusto atenderte!\n');
  });
});
