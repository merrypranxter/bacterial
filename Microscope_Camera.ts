/**
 * ============================================================================
 * BACTERIAL TABULA — MICROSCOPE CAMERA (PAN & ZOOM)
 * ============================================================================
 * Simulates a microscope stage. Allows the user to use the mouse wheel to 
 * zoom in on biological details, and middle-click (or hold shift+click) to 
 * pan the view around the Petri dish.
 * ============================================================================
 */

export class MicroscopeCamera {
  public zoom: number = 1.0;
  public offsetX: number = 0.0;
  public offsetY: number = 0.0;

  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  private minZoom = 0.5; // Zoom out
  private maxZoom = 10.0; // Zoom in (Macro scale)

  constructor(private canvas: HTMLCanvasElement) {
    this.setupEvents();
  }

  private setupEvents() {
    // 1. Zoom (Mouse Wheel)
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      const zoomSensitivity = 0.001;
      const oldZoom = this.zoom;
      
      // Calculate new zoom
      this.zoom -= e.deltaY * zoomSensitivity * this.zoom;
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));

      // Adjust offsets so we zoom IN toward the mouse cursor, not the top-left
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Map mouse to normalized device coordinates [-1, 1]
      const nx = (mouseX / rect.width) * 2.0 - 1.0;
      const ny = -((mouseY / rect.height) * 2.0 - 1.0);

      const zoomRatio = this.zoom / oldZoom;
      this.offsetX = nx - (nx - this.offsetX) * zoomRatio;
      this.offsetY = ny - (ny - this.offsetY) * zoomRatio;
      
    }, { passive: false });

    // 2. Pan (Middle-Click Drag or Shift+Left-Click)
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      // Translate screen space movement to normalized camera space
      const rect = this.canvas.getBoundingClientRect();
      this.offsetX += (deltaX / rect.width) * 2.0 / this.zoom;
      this.offsetY -= (deltaY / rect.height) * 2.0 / this.zoom; // Y is inverted in WebGL
    });
  }

  /**
   * Returns a 3x3 Transformation Matrix to pass to your PBR shaders
   * so they render the zoomed/panned area of the simulation texture.
   */
  public getTransformMatrix(): Float32Array {
    // 3x3 Matrix for 2D transformation (Scale and Translate)
    return new Float32Array([
      this.zoom, 0.0, 0.0,
      0.0, this.zoom, 0.0,
      this.offsetX * this.zoom, this.offsetY * this.zoom, 1.0
    ]);
  }
}