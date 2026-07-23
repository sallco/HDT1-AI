# Shop 502 - Carrito TUI (Prueba de Concepto)

[![CI Pipeline](https://github.com/sallco/HDT1-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/sallco/HDT1-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Prueba de concepto (POC) de una interfaz de consola (**TUI - Text User Interface**) para el manejo del carrito de compras de usuarios anónimos de la tienda **Shop 502**.

## Grupo 7
- Pedro Caso
- Diego Calderon
- Hugo Méndez
- Arodi Chávez

---

## Características

- **Gestión de Carrito en Memoria**: Permite agregar productos, incrementar/disminuir unidades y eliminar ítems de forma dinámica.
- **Interfaz Interactiva CLI**: Entrada continua mediante prompt (`> `) con respuestas formateadas estilo TUI (`|`).
- **Validación de Comandos y Casos Borde**: Manejo de errores amigable al intentar restar unidades a productos no existentes o ingresar formatos incorrectos.
- **Alta Cobertura de Pruebas**: Suite de pruebas unitarias y de integración end-to-end con **Jest** manteniendo el 100% de cobertura en líneas.
- **Compilación a Binario NATIVO**: Configuración con `@yao-pkg/pkg` para compilar un binario ejecutable sin requerir Node.js en el sistema destino.
- **Pipeline CI/CD en GitHub Actions**: Pruebas automáticas en Pull Requests y publicación automatizada del ejecutable binario en GitHub Artifacts en merges a `main`.

---

## Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior

---

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/sallco/HDT1-AI.git
cd HDT1-AI
npm install
```

---

## Uso de la Aplicación

Para iniciar la interfaz interactiva en la consola:

```bash
npm start
```

### Ejemplo de Sesión en Consola

```text
| Por favor ingrese su nombre.
> Pedro
| Hola Pedro! Que deseas modificar en tu carrito?
> 12345 5
| Tu carrito es:
|   - 12345 con 5 unidades
| Que más deseas hacer?
> 67890 2
| Tu carrito es:
|   - 12345 con 5 unidades
|   - 67890 con 2 unidades
| Que más deseas hacer?
> 12345 -3
| Tu carrito es:
|   - 12345 con 2 unidades
|   - 67890 con 2 unidades
| Que más deseas hacer?
> bye
| Adiós fue un gusto atenderte!
```

---

## Pruebas y Cobertura

Para ejecutar todas las pruebas unitarias y de integración (con reporte de cobertura):

```bash
npm test
```

### Ejecutar sólo las pruebas de integración E2E:

```bash
npx jest src/integration.test.js
```

---

## Compilación del Binario (CD)

Para empaquetar la aplicación como un ejecutable binario independiente:

```bash
npm run build
```

El ejecutable resultante se creará dentro del directorio `dist/`.

---

## Estructura del Código

```text
HDT1-AI/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Pipeline CI para PRs (npm test)
│       └── cd.yml            # Pipeline CD para main (build & artifact)
├── src/
│   ├── cart.js               # Lógica del Carrito (Estructura de datos Map)
│   ├── cart.test.js          # Pruebas unitarias de las reglas del carrito
│   ├── tui.js                # Lógica de la TUI, parsing y formateo UX
│   ├── tui.test.js           # Pruebas unitarias de la TUI
│   ├── integration.test.js   # Pruebas de integración E2E (TUI + Cart)
│   └── index.js              # Punto de entrada principal (CLI)
├── AGENTS.md                 # Contexto agéntico para herramientas de IA
├── package.json              # Configuración y scripts
└── README.md                 # Documentación del proyecto
```

---

