/**
 * ============================================================================
 * BACTERIAL TABULA — PETRI DISH INOCULATOR
 * ============================================================================
 * This class handles mouse/touch events to allow the user to "paint" bacteria
 * onto the agar plate. It acts as an additive overlay on the PDE state texture.
 * ============================================================================
 */

const INOCULATION_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const INOCULATION_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 u_mousePos;
uniform vec2 u_resolution;
uniform float u_brushSize;
uniform float u_intensity;
out vec4 out_additiveState;

void main() {
    // Correct for aspect ratio to keep the brush circular
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 mouseUv = u_mousePos / u_resolution;
    
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = distance(uv * aspect, mouseUv * aspect);
    
    // Soft brush profile
    float brush = smoothstep(u_brushSize, u_brushSize * 0.1, dist);
    
    // Inject Biomass (R) and a slight burst of localized nutrient (G)
    float biomass = brush * u_intensity;
    float nutrient = brush * (u_intensity * 0.5); // Accompanying agar gouge
    
    out_additiveState = vec4(biomass, nutrient, 0.0, 0.0);
}
`;

export class PetriDishInoculator {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private quadVAO: WebGLVertexArrayObject;
  
  public brushSize: number = 0.015;
  public intensity: number = 0.8;

  constructor(gl: WebGL2RenderingContext, quadVAO: WebGLVertexArrayObject) {
    this.gl = gl;
    this.quadVAO = quadVAO;
    this.program = this.compileShader(INOCULATION_VS, INOCULATION_FS);
  }

  private compileShader(vsSource: string, fsSource: string): WebGLProgram {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      throw new Error("Failed to compile Inoculator shader.");
    }
    return prog;
  }

  /**
   * Renders an additive brush stroke into the current simulation framebuffer.
   */
  public inoculate(targetFBO: WebGLFramebuffer, mouseX: number, mouseY: number, width: number, height: number) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, targetFBO);
    gl.viewport(0, 0, width, height);
    
    // Enable Additive Blending (we are ADDING bacteria to the existing state)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    
    // Prevent writing to B (chemicals) and A (height) channels directly via mouse
    gl.colorMask(true, true, false, false);

    gl.useProgram(this.program);
    gl.bindVertexArray(this.quadVAO);

    // Note: WebGL coordinates are flipped Y compared to DOM mouse events
    const correctedY = height - mouseY;

    gl.uniform2f(gl.getUniformLocation(this.program, "u_mousePos"), mouseX, correctedY);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_resolution"), width, height);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_brushSize"), this.brushSize);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_intensity"), this.intensity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Reset state
    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);
  }
}