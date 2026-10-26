# Integrating the Psychedelic Art Upgrades

Here is how you inject the **Fluid Marbling Advection** and **MatCap Lighting** into your main loop.

## 1. Fluid Marbling (Liquid Light)
This should happen *after* your PBR render, but *before* your Post-Processor (Macro Lens).

In `main.ts`:
```typescript
// 1. Initialize it
private fluidMarbler = new FluidMarblingAdvection(this.gl);

// 2. In your renderLoop, add an extra FBO step
// ... after rendering to this.pbrFramebuffer ...

this.fluidMarbler.render(
    quadVAO, 
    this.pbrTexture, // The texture containing your rendered bacteria
    this.simWidth, 
    this.simHeight, 
    timeSec
);
```
Add a slider for `swirlIntensity` to your Tweakpane UI. At `0.0`, it looks like normal agar. At `2.0`, it looks like a psychedelic oil slick!

## 2. MatCap Illumination
This requires a slight tweak to your PBR shaders, but gives Kimmy ultimate control over the "lighting vibe" (e.g., alien planets, neon clubs, sterile labs).

In `main.ts`:
```typescript
// 1. Initialize
private matCapManager = new MatCapManager(this.gl);

// 2. Load a spherical material image (you can grab free ones online, just search "MatCap sphere")
this.matCapManager.loadMatCap('./assets/matcap_holographic.png');

// 3. Bind it in the render loop before calling drawArrays for the PBR shader
this.matCapManager.bind(this.renderProgram, 2); // Put it in Texture Slot 2
```