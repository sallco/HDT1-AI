# AGENTS.md - Contexto para Herramientas de Inteligencia Artificial

Este archivo provee el contexto técnico, comandos, guías de estilo, instrucciones de prueba y estándares de seguridad para asistentes y herramientas de IA que trabajen en la base de código **Shop 502 - Cart TUI**.

---

## 1. Vistazo General del Proyecto

- **Propósito**: POC de una interfaz de consola (TUI) para gestionar el carrito de compras de usuarios anónimos en la tienda Shop 502.
- **Tecnologías**: Node.js (v18+), JavaScript (CommonJS), Jest (Testing), `@yao-pkg/pkg` (Compilador de binarios).
- **Arquitectura**:
  - `src/cart.js`: Lógica pura del carrito en memoria (`Map`).
  - `src/tui.js`: Bucle interactivo, parsing de entradas y formateo de respuestas UX.
  - `src/index.js`: Punto de entrada ejecutable CLI.
  - `src/*.test.js`: Suites de pruebas unitarias y de integración.
  - `.github/workflows/`: Pipelines de CI (`ci.yml`) y CD (`cd.yml`).

---

## 2. Comandos para Testear y Buildear

- **Instalar dependencias**: `npm install`
- **Ejecutar pruebas con reporte de cobertura**: `npm test`
- **Ejecutar pruebas de integración E2E**: `npx jest src/integration.test.js`
- **Ejecutar aplicación CLI interactiva**: `npm start`
- **Compilar ejecutable binario (CD)**: `npm run build`

---

## 3. Guías de Estilo de Código

- **Estilo de Módulos**: Usar CommonJS (`require` / `module.exports`).
- **Diseño de Funciones**: Preferir funciones puras y deterministas para el parsing (`parseCommand`) y formateo (`formatCart`).
- **Contrato de Salida UX/UI**:
  - Toda línea de respuesta de la consola debe iniciar con el prefijo `| `.
  - Cada prompt de solicitud de usuario debe iniciar con `> `.
- **Manejo de Errores**: Retornar objetos de estado limpios (ej. `{ type: 'invalid' }`) en lugar de lanzar excepciones no capturadas en la TUI.

---

## 4. Instrucciones para Testear

- **Cobertura Mínima**: Mantener obligatoriamente una cobertura de pruebas `>= 80%` en líneas y ramas.
- **Enfoque TDD/BDD**: Escribir o actualizar pruebas en `cart.test.js` o `tui.test.js` antes de refactorizar componentes.
- **Pruebas de Integración (E2E)**: Toda nueva característica de la TUI o del Carrito debe probarse integradamente en `src/integration.test.js` usando streams (`PassThrough`) para simular `stdin`/`stdout`.

---

## 5. Estándares de Seguridad

- **Validación Estricta de Entradas**: Validar siempre que la cantidad ingresada sea un entero válido (`Number.isInteger`) y que los IDs de producto estén sanitizados antes de mutar el carrito.
- **Gestión de Estado en Memoria**: El carrito opera únicamente en memoria por sesión de usuario anónimo; no almacenar credenciales ni datos personales persistentes.
- **Seguridad en CI/CD y Dependencias**: No exponer claves de API, llaves SSH ni secretos en el código fuente. Mantener dependencias libres de vulnerabilidades conocidas (`npm audit`).
