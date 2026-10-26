/**
 * ============================================================================
 * BACTERIAL TABULA — ART EXPORTER
 * ============================================================================
 * Utility to capture the current WebGL canvas state and download it as a 
 * high-resolution, lossless PNG. 
 * ============================================================================
 */

export class ArtExporter {
  constructor(private canvas: HTMLCanvasElement, private gl: WebGL2RenderingContext) {
    this.setupKeyboardListener();
  }

  private setupKeyboardListener() {
    window.addEventListener('keydown', (e) => {
      // Press 'S' to save the current frame
      if (e.key.toLowerCase() === 's') {
        this.downloadCanvas();
      }
    });
  }

  /**
   * Forces a synchronous read of the WebGL backbuffer and triggers a download.
   */
  public downloadCanvas() {
    // Ensure all rendering operations are finished
    this.gl.finish();

    // Grab the data URL from the canvas
    const dataURL = this.canvas.toDataURL('image/png', 1.0);
    
    // Generate a timestamped filename
    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `Bacterial_Tabula_${timestamp}.png`;

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`📸 Art saved: ${filename}`);
  }
}