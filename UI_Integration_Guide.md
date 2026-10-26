# Adding the UI to your App

To get the floating UI panel working, you just need to install the library and add a few lines to your `main.ts` file.

## 1. Install Tweakpane
In your terminal, run:
```bash
npm install tweakpane
```

## 2. Update `src/main.ts`

First, import the new UI manager at the top of your `main.ts` file:
```typescript
import { UIManager } from './ui/UIManager';
```

Next, inside your `BacterialApp` class, add a property for the UI:
```typescript
class BacterialApp {
  // ... existing properties ...
  private uiManager!: UIManager;
```

Finally, at the very end of your `init()` method inside `BacterialApp`, instantiate the UI and pass it the hooks it needs:

```typescript
  private init() {
    // ... all your existing initialization code ...
    // ... this.paletteManager.applyPalette(...) ...

    // 5. Initialize the UI
    this.uiManager = new UIManager(
      this.inoculator,
      this.postProcessor,
      this.timeline,
      // Callback for when Kimmy's palette is changed in the dropdown
      (newPalette) => {
        this.paletteManager.applyPalette(newPalette);
      },
      // Callback to clear the dish (resets the FBOs)
      () => {
        const gl = this.gl;
        const fbo = this.simEngine.getWriteFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.clearColor(0, 0, 0, 0); // Wipes biomass, nutrients, chemicals, and elevation
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.timeline.reset();
      }
    );
  }
```

That's it! When you run `npx vite`, you will now have a beautiful, dark-themed control panel sitting in the top right corner of your screen, letting you orchestrate the biology and the art in real-time.