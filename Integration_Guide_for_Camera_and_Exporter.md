# Adding the Camera and Exporter

To integrate these final tools, you just need to add a few lines to your `main.ts` file.

## 1. Import the new modules
```typescript
import { ArtExporter } from './utils/ArtExporter';
import { MicroscopeCamera } from './core/MicroscopeCamera';
```

## 2. Add them as properties in `BacterialApp`
```typescript
  private exporter!: ArtExporter;
  private camera!: MicroscopeCamera;
```

## 3. Initialize them in `init()`
```typescript
    this.exporter = new ArtExporter(this.canvas, this.gl);
    this.camera = new MicroscopeCamera(this.canvas);
```

## 4. Pass the Camera Uniform to your PBR Shader
In your `renderLoop`, right before you call `gl.drawArrays` for the PBR program, pass the camera matrix so the shader knows what part of the texture to look at:

```typescript
    // Inside renderLoop, where you bind the renderProgram:
    const matrixLoc = this.gl.getUniformLocation(this.renderProgram, "u_cameraMatrix");
    if (matrixLoc) {
      this.gl.uniformMatrix3fv(matrixLoc, false, this.camera.getTransformMatrix());
    }
```
*(Note: You will need to add `uniform mat3 u_cameraMatrix;` to your PBR shaders and multiply your UV coordinates by this matrix!)*