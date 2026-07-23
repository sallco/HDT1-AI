const { PassThrough } = require('stream');
const { runTui, runCartSession } = require('./tui');
const Cart = require('./cart');

describe('Pruebas de Integración', () => {
  test('Flujo E2E completo: saludo, agregar varios productos, modificar stock y finalizar con bye', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let transcript = '';

    output.on('data', (chunk) => {
      transcript += chunk.toString();
    });

    const session = runTui({ input, output });

    // Ingresar nombre
    input.write('Pedro Pablo\n');
    // Agregar primer producto: ID 101, cantidad 5
    input.write('101 5\n');
    // Agregar segundo producto: ID 202, cantidad 3
    input.write('202 3\n');
    // Modificar cantidad del primer producto (-2)
    input.write('101 -2\n');
    // Finalizar sesión
    input.write('bye\n');
    input.end();

    await session;

    expect(transcript).toContain('| Por favor ingrese su nombre.\n> ');
    expect(transcript).toContain('| Hola Pedro! Que deseas modificar en tu carrito?\n> ');
    expect(transcript).toContain('| Tu carrito es:\n|   - 101 con 5 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Tu carrito es:\n|   - 101 con 5 unidades\n|   - 202 con 3 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Tu carrito es:\n|   - 101 con 3 unidades\n|   - 202 con 3 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Adiós fue un gusto atenderte!\n');
  });

  test('Flujo E2E de errores y casos borde: comando invalido y producto inexistente', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let transcript = '';

    output.on('data', (chunk) => {
      transcript += chunk.toString();
    });

    const session = runTui({ input, output });

    input.write('Ana Maria\n');
    // Comando inválido
    input.write('comando_erroneo\n');
    // Intentar restar unidades a un producto no agregado
    input.write('999 -1\n');
    // Comando válido
    input.write('101 2\n');
    // Salir
    input.write('bye\n');
    input.end();

    await session;

    expect(transcript).toContain('| Hola Ana! Que deseas modificar en tu carrito?\n> ');
    expect(transcript).toContain('| Comando inválido. Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Oops parece que no tienes el producto 999 agregado a tu carrito. Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Tu carrito es:\n|   - 101 con 2 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Adiós fue un gusto atenderte!\n');
  });

  test('Flujo E2E vaciado total del carrito', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let transcript = '';

    output.on('data', (chunk) => {
      transcript += chunk.toString();
    });

    const session = runTui({ input, output });

    input.write('Carlos\n');
    input.write('555 10\n');
    input.write('555 -10\n');
    input.write('bye\n');
    input.end();

    await session;

    expect(transcript).toContain('| Tu carrito es:\n|   - 555 con 10 unidades\n| Que más deseas hacer?\n> ');
    expect(transcript).toContain('| Tu carrito está vacío, que más deseas hacer?\n> ');
    expect(transcript).toContain('| Adiós fue un gusto atenderte!\n');
  });
});
