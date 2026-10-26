/**
 * ============================================================================
 * BACTERIAL TABULA — FLUID MARBLING ADVECTION
 * ============================================================================
 * This post-simulation pass takes the raw chemical/pigment data and applies
 * curl-noise based fluid advection. It makes the water-soluble pigments 
 * (like Pyocyanin) swirl and warp like wet paint or liquid marble.
 * ============================================================================
 */

const ADVECTION_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const ADVECTION_FS = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_mainTex;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_swirlIntensity; // How strong the fluid warp is
uniform float u_swirlScale;     // Size of the fluid eddies

// 2D Simplex/Curl Noise approximation
vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash22(i+0.0)), dot(b, hash22(i+o)), dot(c, hash22(i+1.0)));
    return dot(n, vec3(70.0));
}

// Curl noise gives us divergence-free fluid velocity vectors
vec2 curlNoise(vec2 p) {
    float e = 0.01;
    float dx = (noise(p + vec2(e, 0.0)) - noise(p - vec2(e, 0.0))) / (2.0 * e);
    float dy = (noise(p + vec2(0.0, e)) - noise(p - vec2(0.0, e))) / (2.0 * e);
    return vec2(dy, -dx); // Perpendicular gradient creates swirls
}

void main() {
    // 1. Generate the fluid velocity field based on time and space
    vec2 velocity = curlNoise(v_uv * u_swirlScale + u_time * 0.1);
    
    // 2. Offset the texture coordinates (Advection)
    // We only warp the agar/pigment space, not the solid colony bodies!
    // To do this perfectly, you'd sample the biomass mask here. For now, we warp everything gently.
    vec2 warpedUV = v_uv - (velocity * u_swirlIntensity * 0.01);
    
    // 3. Sample the underlying rendered texture
    vec4 baseColor = texture(u_mainTex, warpedUV);
    
    out_color = baseColor;
}
`;

export class FluidMarblingAdvection {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  
  public swirlIntensity: number = 1.5;
  public swirlScale: number = 5.0;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.compileShader(ADVECTION_VS, ADVECTION_FS);
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
    return prog;
  }

  public render(quadVAO: WebGLVertexArrayObject, inputTexture: WebGLTexture, width: number, height: number, time: number) {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(quadVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_mainTex"), 0);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_resolution"), width, height);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_time"), time);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_swirlIntensity"), this.swirlIntensity);
    gl.uniform1f(gl.getUniformLocation(this.program, "u_swirlScale"), this.swirlScale);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}