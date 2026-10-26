/**
 * ============================================================================
 * BACTERIAL TABULA — CORE SIMULATION ENGINE
 * ============================================================================
 * This class manages the WebGL2 Ping-Pong Framebuffer Object (FBO) architecture
 * required to solve our coupled Partial Differential Equations (PDEs).
 * 
 * Reaction-Diffusion requires us to read from the current state texture while
 * writing to the next state texture, then swapping them for the next time step.
 * ============================================================================
 */

export class SimulationEngine {
  private gl: WebGL2RenderingContext;
  private width: number;
  private height: number;

  // Ping-Pong Textures and Framebuffers
  private stateTextures: [WebGLTexture, WebGLTexture];
  private framebuffers: [WebGLFramebuffer, WebGLFramebuffer];
  
  // Index of the current texture to read from (0 or 1)
  private readIndex: number = 0;

  // A full-screen quad for rendering the simulation passes
  private quadVAO: WebGLVertexArrayObject;

  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    this.gl = gl;
    this.width = width;
    this.height = height;

    // 1. Ensure the device supports rendering to high-precision floating point textures
    this.checkExtensions();

    // 2. Initialize the dual textures and framebuffers
    this.stateTextures = [this.createStateTexture(), this.createStateTexture()];
    this.framebuffers = [this.createFramebuffer(this.stateTextures[0]), this.createFramebuffer(this.stateTextures[1])];

    // 3. Setup the full-screen quad geometry
    this.quadVAO = this.setupQuad();
  }

  private checkExtensions() {
    const extColorBufferFloat = this.gl.getExtension('EXT_color_buffer_float');
    const extFloatBlend = this.gl.getExtension('EXT_float_blend');
    if (!extColorBufferFloat) {
      console.warn("EXT_color_buffer_float not supported. PDE simulation may fail or clip.");
    }
  }

  /**
   * Creates an RGBA32F (32-bit floating point per channel) texture.
   * R = Biomass, G = Nutrient, B = Chemical/Exudate/Order, A = Elevation/State
   */
  private createStateTexture(): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error("Failed to create state texture.");

    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Use RGBA32F for maximum mathematical precision during PDE integration
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
    
    // Nearest neighbor filtering is critical for PDE data to prevent interpolation errors
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
  }

  private createFramebuffer(texture: WebGLTexture): WebGLFramebuffer {
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    if (!fb) throw new Error("Failed to create framebuffer.");

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Framebuffer incomplete: ${status}`);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fb;
  }

  private setupQuad(): WebGLVertexArrayObject {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    if (!vao) throw new Error("Failed to create VAO");
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Two triangles covering the entire screen (-1 to 1 clip space)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    return vao;
  }

  /**
   * Executes one time-step of the active PDE simulation.
   * @param simProgram The compiled WebGLProgram for the specific bacterial group
   * @param dt The delta-time step (e.g., 0.01)
   */
  public step(simProgram: WebGLProgram, dt: number, time: number) {
    const gl = this.gl;
    const writeIndex = 1 - this.readIndex;

    gl.useProgram(simProgram);
    gl.bindVertexArray(this.quadVAO);

    // Bind the output framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[writeIndex]);
    gl.viewport(0, 0, this.width, this.height);

    // Bind the input state texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateTextures[this.readIndex]);
    
    // Set uniforms
    gl.uniform1i(gl.getUniformLocation(simProgram, "u_stateTex"), 0);
    gl.uniform2f(gl.getUniformLocation(simProgram, "u_resolution"), this.width, this.height);
    gl.uniform1f(gl.getUniformLocation(simProgram, "u_dt"), dt);
    gl.uniform1f(gl.getUniformLocation(simProgram, "u_time"), time);

    // Execute PDE Compute pass
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap buffers for the next frame
    this.readIndex = writeIndex;
  }

  /**
   * Returns the most up-to-date state texture to pass to the PBR Render Shader.
   */
  public getCurrentStateTexture(): WebGLTexture {
    return this.stateTextures[this.readIndex];
  }

  /**
   * Allows the inoculator to write directly to the current state buffer.
   */
  public getWriteFramebuffer(): WebGLFramebuffer {
    return this.framebuffers[this.readIndex];
  }
}