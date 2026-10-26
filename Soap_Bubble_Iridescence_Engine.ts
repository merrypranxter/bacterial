/**
 * ============================================================================
 * BACTERIAL TABULA — THIN-FILM INTERFERENCE (OIL SLICK / SOAP BUBBLE)
 * ============================================================================
 * A GLSL injection module. Instead of standard white specular highlights,
 * this calculates the optical phase shift of light bouncing through the
 * transparent mucoid slime layer of the bacteria.
 * 
 * Result: The specular reflections will ripple with vivid neon pinks, greens,
 * and blues depending on the viewing angle and the local height of the colony.
 * ============================================================================
 */

export const THIN_FILM_INJECTION_GLSL = /* glsl */ `
// Inject this into any of the PBR fragment shaders (Group 02, 03, 04, 06)

uniform float u_thinFilmThicknessMultiplier; // Maps the PDE height (h) to nanometers
uniform bool u_useThinFilm;

/**
 * Calculates Spectral Thin-Film Interference.
 * @param cosTheta The dot product of the Normal and View vectors (NdotV)
 * @param thicknessNm The thickness of the slime layer in nanometers (e.g. 200-800nm)
 * @param ior The refractive index of the slime (usually ~1.33 to 1.45)
 */
vec3 calculateThinFilmReflectance(float cosTheta, float thicknessNm, float ior) {
    // Snell's law to find the angle of refracted light inside the film
    float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
    float sinThetaT = sinTheta / ior;
    float cosThetaT = sqrt(1.0 - sinThetaT * sinThetaT);
    
    // Optical path difference
    float pathDifference = 2.0 * ior * thicknessNm * cosThetaT;
    
    // Phase shift approximation for R, G, B wavelengths (650nm, 530nm, 450nm)
    // We use a continuous cosine palette mapped to the phase shift to generate 
    // the psychedelic rainbow banding typical of oil slicks and soap bubbles.
    float phase = pathDifference * 0.015; 
    
    // An artistic cosine palette that generates vibrant, shifting neon rainbows
    vec3 rainbow = 0.5 + 0.5 * cos(vec3(phase, phase + 2.094, phase + 4.188)); // 2.094 = 2*PI/3
    
    // Amplify the saturation for the psychedelic art style
    rainbow = smoothstep(0.1, 0.9, rainbow);
    
    return rainbow;
}

// HOW TO USE IN THE PBR SHADER:
// Replace this standard specular calculation:
// vec3 specular = vec3(1.0) * specPower * fresnel;
//
// With this:
// vec3 specularColor = vec3(1.0);
// if (u_useThinFilm) {
//     // Map bacterial elevation 'h' to a nanometer thickness (e.g. 300 to 800 nm)
//     float filmThickness = 300.0 + h * u_thinFilmThicknessMultiplier;
//     specularColor = calculateThinFilmReflectance(NdotV, filmThickness, u_domeIOR);
// }
// vec3 specular = specularColor * specPower * fresnel;
`;

export class ThinFilmManager {
  private gl: WebGL2RenderingContext;
  
  public isEnabled: boolean = true;
  public thicknessMultiplier: number = 250.0; // How drastically the height changes the rainbow color

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /**
   * Binds the thin-film parameters to a compiled PBR shader program.
   */
  public bind(program: WebGLProgram) {
    const gl = this.gl;
    
    const useLoc = gl.getUniformLocation(program, "u_useThinFilm");
    if (useLoc) gl.uniform1i(useLoc, this.isEnabled ? 1 : 0);
    
    const thickLoc = gl.getUniformLocation(program, "u_thinFilmThicknessMultiplier");
    if (thickLoc) gl.uniform1f(thickLoc, this.thicknessMultiplier);
  }
}