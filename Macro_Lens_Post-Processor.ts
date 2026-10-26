/**
 * ============================================================================
 * BACTERIAL TABULA — MACRO LENS POST-PROCESSOR
 * ============================================================================
 * Takes the raw output from the PBR Render Shader and applies cinematic camera
 * effects to emulate a high-end microscope viewing psychedelic art.
 * 
 * Features:
 * - Optical Bloom (essential for glowing exopigments and UV fluorescence)
 * - Chromatic Aberration (simulates cheap/thick microscope glass lenses)
 * - Vignette & Film Grain
 * ============================================================================
 */

const POSTPROCESS_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const POSTPROCESS_FS = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_mainTex;
uniform vec2 u_resolution;
uniform float u_time;

// Post-Processing Settings
uniform float u_bloomIntensity;
uniform float u_chromaticAberration;
uniform float u_vignetteStrength;
uniform float u_grainStrength;

// Simple pseudo-random hash for film grain
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;
    vec2 texel = 1.0 / u_resolution;

    // 1. Chromatic Aberration (Radial)
    vec2 toCenter = vec2(0.5) - uv;
    float distToCenter = length(toCenter);
    vec2 aberrationOffset = normalize(toCenter) * distToCenter * u_chromaticAberration * 0.01;

    float r = texture(u_mainTex, uv - aberrationOffset).r;
    float g = texture(u_mainTex, uv).g;
    float b = texture(u_mainTex, uv + aberrationOffset).b;
    vec3 color = vec3(r, g, b);

    // 2. Simple Box-Blur Bloom Approximation (for glowing UV halos)
    vec3 bloom = vec3(0.0);
    float bloomSpread = 4.0;
    for(float x = -2.0; x <= 2.0; x++) {
        for(float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * texel * bloomSpread;
            vec3 sampleCol = texture(u_mainTex, uv + offset).rgb;
            // Only bloom bright pixels (thresholding)
            float luma = dot(sampleCol, vec3(0.299, 0.587, 0.114));
            bloom += sampleCol * smoothstep(0.7, 1.0, luma);
        }
    }
    bloom /= 25.0; // 5x5 box average
    color += bloom * u_bloomIntensity;

    // 3. Film Grain
    float noise = (hash(uv + u_time) - 0.5) * 2.0;
    color += noise * u_grainStrength * color; // Grain is more visible in brighter areas

    // 4. Vignette
    float vignette = smoothstep(0.8, 0.2, distToCenter);
    color *= mix(1.0, vignette, u_vignetteStrength);

    // ACES Tonemapping
    color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);

    out_color = vec4(color, 1.0);
}
`;

export class MacroLensPostProcessor {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  
  public bloomIntensity: number = 0.8;
  public chromaticAberration: number = 1.2;
  public vignetteStrength: number = 0.6;
  public grainStrength: number = 0.04;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.compileShader(POSTPROCESS_VS, POSTPROCESS_FS);
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
      throw new Error("Failed to compile Post-Processor shader.");
    }
    return prog;
  }

  /**
   * Applies the post-processing effects to the rendered colony texture, drawing to the screen.
   */
  public render(quadVAO: WebGLVertexArrayObject, renderTexture: WebGLTexture, width: number, height: number, time: number) {
    const gl = this.gl;

    // Bind default framebuffer (the screen)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);
    gl.bindVertexArray(quadVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_mainTex"), 0);

    gl.uniform2f(gl.getUniformLocation(this.program, "u_resolution"), width, height);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_time"), time);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_bloomIntensity"), this.bloomIntensity);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_chromaticAberration"), this.chromaticAberration);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_vignetteStrength"), this.vignetteStrength);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_grainStrength"), this.grainStrength);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}