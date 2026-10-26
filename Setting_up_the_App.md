# Setup & Running `bacterial`

Now that we have the core taxonomy modules, the engine, and the main loop, here is how you can quickly get this running locally.

## Prerequisites
1. Ensure you have [Node.js](https://nodejs.org/) installed.

## 1. Initialize the Project

In the root of your `bacterial` repository, run:

```bash
npm init -y
npm install vite typescript --save-dev
```

## 2. Create the HTML File
Create a file named `index.html` in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bacterial Tabula</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #000;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
    #ui-layer {
      position: absolute;
      top: 20px;
      left: 20px;
      color: rgba(255, 255, 255, 0.5);
      font-family: monospace;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="ui-layer">
    <h1>BACTERIAL TABULA</h1>
    <p>Click and drag to inoculate the agar.</p>
  </div>
  <canvas id="bacterial-canvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## 3. Create TSConfig
Create a `tsconfig.json` file in the root directory to ensure TypeScript compiles nicely with Vite:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## 4. Run the Dev Server
```bash
npx vite
```
Navigate to `http://localhost:5173`. You can now click and drag on the screen to paint bacteria!

## Next Steps for Development
*   **The UI Controller:** The logical next step is adding a small dat.GUI or Tweakpane UI overlay so you can switch between Group 01-07 and Kimmy's palettes without editing the code.
*   **Exporting Art:** Add a keyboard shortcut (like pressing 'S') that grabs the current WebGL canvas buffer and saves it as a high-res PNG for your art suite.