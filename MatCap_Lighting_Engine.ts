/**
 * ============================================================================
 * BACTERIAL TABULA — MATCAP ILLUMINATION
 * ============================================================================
 * A highly stylized lighting alternative. Instead of calculating physics (GGX),
 * this uses the colony's 3D normal to sample a spherical texture (MatCap).
 * If Kimmy provides a texture of a shiny gold sphere, the bacteria become gold.
 * If she provides a holographic pearl sphere, the bacteria become holographic.
 * ============================================================================
 */

export const MATCAP_INJECTION_GLSL = /* glsl */ `
// Inject this into any of the PBR fragment shaders (Group 1-7)

uniform sampler2D u_matCapTex; // Kimmy's spherical lighting texture
uniform bool u_useMatCap;
uniform float u_matCapBlend;   // 0.0 = Pure PBR, 1.0 = Pure MatCap

// Call this right before 'out_color = ...' in your PBR shaders
vec3 applyMatCap(vec3 originalPBR, vec3 viewSpaceNormal, sampler2D matCap) {
    // Map normal from [-1, 1] to [0, 1] texture coordinates
    vec2 matCapUV = viewSpaceNormal.xy * 0.5 + 0.5;
    
    // Sample the lighting sphere
    vec3 matCapColor = texture(matCap, matCapUV).rgb;
    
    return mix(originalPBR, matCapColor, u_matCapBlend);
}
`;

export class MatCapManager {
  private gl: WebGL2RenderingContext;
  private matCapTexture: WebGLTexture | null = null;
  public blendStrength: number = 0.8;
  public isEnabled: boolean = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.matCapTexture = gl.createTexture();
  }

  /**
   * Loads an image URL (e.g., a 256x256 sphere image) to use as the lighting environment.
   */
  public loadMatCap(imageUrl: string) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.matCapTexture);
      // Flip Y for WebGL texture coordinates
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      
      // MatCaps require smooth interpolation
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      
      this.isEnabled = true;
      console.log("🎨 MatCap Lighting Environment Loaded.");
    };
    img.src = imageUrl;
  }

  public bind(program: WebGLProgram, textureUnit: number = 2) {
    if (!this.isEnabled || !this.matCapTexture) return;
    
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.matCapTexture);
    
    gl.uniform1i(gl.getUniformLocation(program, "u_matCapTex"), textureUnit);
    gl.uniform1i(gl.getUniformLocation(program, "u_useMatCap"), 1);
    gl.uniform1f(gl.getUniformLocation(program, "u_matCapBlend"), this.blendStrength);
  }
}