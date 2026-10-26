/**
 * ============================================================================
 * BACTERIAL TABULA — KUWAHARA "OIL PAINTING" FILTER
 * ============================================================================
 * A post-processing effect that turns the ultra-HD PBR render into a flowing,
 * painterly masterpiece. It samples 4 quadrants around every pixel, finds the
 * quadrant with the lowest color variance, and outputs its average color.
 * This preserves sharp biological edges while creating flat "brush strokes"
 * in the interior of the colonies.
 * ============================================================================
 */

const KUWAHARA_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const KUWAHARA_FS = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_mainTex;
uniform vec2 u_resolution;
uniform int u_radius; // Size of the brush stroke (e.g., 3 to 7)

void main() {
    vec2 uv = v_uv;
    vec2 texel = 1.0 / u_resolution;
    
    // We will calculate the Mean (average color) and Variance (noise/detail)
    // for 4 square quadrants around the current pixel.
    vec3 means[4];
    vec3 variances[4];
    
    for (int i = 0; i < 4; i++) {
        means[i] = vec3(0.0);
        variances[i] = vec3(0.0);
    }
    
    float samples = float((u_radius + 1) * (u_radius + 1));
    
    // Quadrant offsets
    vec2 offsets[4] = vec2[](
        vec2(-u_radius, -u_radius), // Top Left
        vec2(0, -u_radius),         // Top Right
        vec2(-u_radius, 0),         // Bottom Left
        vec2(0, 0)                  // Bottom Right
    );

    // Calculate mean and variance for each quadrant
    for (int k = 0; k < 4; k++) {
        for (int i = 0; i <= u_radius; i++) {
            for (int j = 0; j <= u_radius; j++) {
                vec2 pos = uv + (offsets[k] + vec2(i, j)) * texel;
                vec3 color = texture(u_mainTex, clamp(pos, 0.0, 1.0)).rgb;
                means[k] += color;
                variances[k] += color * color;
            }
        }
        means[k] /= samples;
        variances[k] = abs(variances[k] / samples - means[k] * means[k]);
    }

    // Find the quadrant with the lowest variance (the "smoothest" area)
    float minVariance = 1e5;
    vec3 finalColor = vec3(0.0);
    
    for (int k = 0; k < 4; k++) {
        // Total variance is the sum of the RGB variances
        float v = variances[k].r + variances[k].g + variances[k].b;
        if (v < minVariance) {
            minVariance = v;
            finalColor = means[k];
        }
    }

    out_color = vec4(finalColor, 1.0);
}
`;

export class KuwaharaFilter {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  
  public brushRadius: number = 4; // Higher = thicker, more abstracted paint strokes
  public isEnabled: boolean = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.compileShader(KUWAHARA_VS, KUWAHARA_FS);
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

  public render(quadVAO: WebGLVertexArrayObject, inputTexture: WebGLTexture, width: number, height: number) {
    if (!this.isEnabled) return;
    
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(quadVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_mainTex"), 0);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_resolution"), width, height);
    gl.uniform1i(gl.getUniformLocation(this.program, "u_radius"), this.brushRadius);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}