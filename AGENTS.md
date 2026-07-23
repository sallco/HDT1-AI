# AGENTS.md - Contexto y Guía para Herramientas de Inteligencia Artificial

Este archivo contiene el contexto del proyecto, arquitectura, reglas de negocio y pautas de desarrollo para asistentes y herramientas de IA (agentes) que trabajen en la base de código de **Shop 502 - Cart TUI**.

---

## 1. Visión General del Proyecto

- **Nombre**: `shop502-cart-tui`
- **Descripción**: Prueba de concepto (POC) de una interfaz de consola (TUI - Text User Interface) para la gestión del carrito de compras de usuarios anónimos en Shop 502.
- **Entorno de Ejecución**: Node.js (v18+).
- **Lenguaje**: JavaScript (CommonJS).
- **Framework de Pruebas**: Jest.
- **Empaquetador/Compilador**: `@yao-pkg/pkg` (para empaquetar ejecutables nativos).

---

## 2. Estructura del Proyecto y Responsabilidades

```
HDT1-AI/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Pipeline CI: ejecuta pruebas automáticamente en Pull Requests a main.
│       └── cd.yml            # Pipeline CD: compila el binario ejecutable y lo sube como artefacto al hacer merge a main.
├── src/
│   ├── cart.js               # Lógica del carrito (estrucura Map en memoria, agregar/eliminar/actualizar productos).
│   ├── cart.test.js          # Pruebas unitarias para las reglas de negocio del carrito.
│   ├── tui.js                # Lógica de la TUI, parseo de comandos y formateo de respuestas de consola.
│   ├── tui.test.js           # Pruebas unitarias de parsing, formateo e interacción de la TUI.
│   ├── integration.test.js   # Pruebas de integración E2E (TUI + Cart).
│   └── index.js              # Punto de entrada principal (ejecutable CLI).
├── package.json              # Configuración de dependencias, scripts de Jest y pkg.
├── package-lock.json         # Lockfile de npm.
├── README.md                 # Documentación básica del proyecto.
└── AGENTS.md                 # Contexto de herramientas agénticas de IA.
```

---

## 3. Reglas de Negocio y Formato UX/UI

Cualquier modificación debe respetar estrictamente los siguientes contratos de formato de interfaz y lógica:

1. **Saludo Inicial**:
   - Mensaje 1: `| Por favor ingrese su nombre.`
   - El primer token del nombre ingresado se usa en el saludo.
   - Mensaje 2: `| Hola <Nombre>! Que deseas modificar en tu carrito?`

2. **Parsing de Comandos**:
   - Formato esperado: `<id_producto> <cantidad>` (ej. `12345 5` o `12345 -2`).
   - Comando de salida: `bye` (case-insensitive).
   - Comando inválido: Responde con `| Comando inválido. Que más deseas hacer?`.

3. **Modificación del Carrito**:
   - **Agregar unidades**: Si la cantidad > 0, agrega o incrementa la cantidad en el carrito.
   - **Restar unidades de un producto existente**: Reduce la cantidad. Si la cantidad resulta <= 0, elimina el producto del carrito.
   - **Restar unidades de un producto NO existente**: Responde con `| Oops parece que no tienes el producto <id> agregado a tu carrito. Que más deseas hacer?`.
   - **Carrito con ítems**: Muestra las líneas:
     ```
     | Tu carrito es:
     |   - <id> con <cantidad> unidades
     | Que más deseas hacer?
     ```
   - **Carrito vacío**: Muestra `| Tu carrito está vacío, que más deseas hacer?`.
   - **Salida**: Al recibir `bye`, responde con `| Adiós fue un gusto atenderte!` y termina el proceso.

4. **Prompt de Entrada**:
   - Toda solicitud de input del usuario se antecede con `> `.

---

## 4. Comandos del Entorno

Los agentes deben usar los siguientes comandos estandarizados:

- **Instalar dependencias**:
  ```bash
  npm install
  ```
- **Ejecutar pruebas unitarias e integración con cobertura**:
  ```bash
  npm test
  ```
- **Ejecutar la aplicación CLI de forma interactiva**:
  ```bash
  npm start
  ```
- **Compilar el binario para distribución**:
  ```bash
  npm run build
  ```

---

## 5. Pautas para Agentes de IA

1. **Mantener Cobertura >= 80%**: Ningún cambio debe reducir la cobertura de pruebas por debajo del 80% exigido por la integración continua.
2. **Preservar la Arquitectura Modular**: Mantener la separación limpia entre la clase `Cart` [src/cart.js] y las funciones de lectura/formateo de la TUI [src/tui.js]
3. **No Romper Pipelines de CI/CD**: Garantizar que el script `npm test` pase sin errores para evitar fallos en el workflow `ci.yml`.
