/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 08: KIMMY'S PSYCHEDELIC PALETTE PACK
 * ============================================================================
 * This module manages the generation, interpolation, and hot-swapping of custom
 * 1D Lookup Textures (LUTs) used by the PBR shaders to colorize the biophysical
 * simulations.
 * 
 * The system supports both smooth gradients and razor-sharp screen-printed 
 * flat color bands, configured via the 'flatBand' toggle on individual color stops.
 * ============================================================================
 */

export interface ColorStop {
  /** Normalized position along the gradient [0.0, 1.0] */
  position: number;
  /** Hex color string (e.g., "#ff007f") */
  hex: string;
  /** Optional descriptor for what this color usually represents */
  role?: string;
  /** If true, the shader will snap this color into a hard-edged flat band */
  flatBand?: boolean;
}

export interface KimmyPalette {
  paletteId: string;
  name: string;
  author: string;
  mode: "hybrid_flat_and_pbr" | "pure_pbr" | "pure_flat";
  
  /** Un-stained background agar color */
  agarBackground: string;
  /** Color of the water-soluble diffusing halo (Group 04) */
  solubleHaloColor: string;
  /** Volumetric glow intensity of the halo */
  solubleHaloGlow: number;
  
  /** Mathematical Cosine Gradient (Inigo Quilez method) for continuous base tones */
  cosineGradient: {
    offset: [number, number, number];
    amplitude: [number, number, number];
    frequency: [number, number, number];
    phase: [number, number, number];
  };
  
  /** Discrete color stops mapped to biological elevation/age/phase */
  colorStops: ColorStop[];
  
  /** Global settings for how Flat Colors are rendered */
  flatColorSettings: {
    enabled: boolean;
    bandCount: number;
    /** 0.0 = smooth blend, 1.0 = razor-sharp pop-art edges */
    edgeSharpness: number;
    preservePBRSpecular: boolean;
    preserveSubsurfaceGlow: boolean;
  };
  
  /** Settings to override colors with structural iridescence (Group 05) */
  iridescence: {
    enabled: boolean;
    latticeSpacingNm: number;
    intensity: number;
  };
}

/**
 * ============================================================================
 * 1. KIMMY'S CURATED STARTER PRESETS
 * ============================================================================
 */
export const KIMMY_PRESETS: Record<string, KimmyPalette> = {
  acid_pyocyanin: {
    paletteId: "acid_pyocyanin",
    name: "Acid Pyocyanin & Flat Magenta Spores",
    author: "Kimmy",
    mode: "hybrid_flat_and_pbr",
    agarBackground: "#070312", // Deep void purple
    solubleHaloColor: "#00ffcc", // Neon Cyan bleed
    solubleHaloGlow: 1.45,
    cosineGradient: {
      offset: [0.5, 0.5, 0.5],
      amplitude: [0.5, 0.5, 0.5],
      frequency: [1.0, 1.0, 1.0],
      phase: [0.0, 0.33, 0.67]
    },
    colorStops: [
      { position: 0.00, hex: "#070312", role: "Agar Margin", flatBand: true },
      { position: 0.22, hex: "#00f5d4", role: "Juvenile Biofilm", flatBand: false },
      { position: 0.48, hex: "#7b2cbf", role: "Mature Interior", flatBand: true },
      { position: 0.76, hex: "#ff007f", role: "Active Growth Ring", flatBand: true },
      { position: 0.95, hex: "#ffee32", role: "Sporulation Apex", flatBand: true }
    ],
    flatColorSettings: {
      enabled: true,
      bandCount: 5,
      edgeSharpness: 0.92,
      preservePBRSpecular: true,
      preserveSubsurfaceGlow: true
    },
    iridescence: { enabled: false, latticeSpacingNm: 0, intensity: 0 }
  },

  vaporwave_bioluminescence: {
    paletteId: "vaporwave_bioluminescence",
    name: "Vaporwave Bioluminescence",
    author: "Kimmy",
    mode: "hybrid_flat_and_pbr",
    agarBackground: "#02000d", 
    solubleHaloColor: "#ff00ff", // Magenta glow
    solubleHaloGlow: 1.8,
    cosineGradient: {
      offset: [0.6, 0.5, 0.4],
      amplitude: [0.4, 0.5, 0.6],
      frequency: [1.0, 1.0, 1.0],
      phase: [0.0, 0.1, 0.2]
    },
    colorStops: [
      { position: 0.00, hex: "#02000d", role: "Void", flatBand: false },
      { position: 0.30, hex: "#4cc9f0", role: "Cyan Periphery", flatBand: false },
      { position: 0.60, hex: "#f72585", role: "Hot Pink Body", flatBand: true },
      { position: 0.85, hex: "#b5179e", role: "Deep Purple Ridges", flatBand: true },
      { position: 1.00, hex: "#ffffff", role: "White Hot Tips", flatBand: false }
    ],
    flatColorSettings: {
      enabled: true,
      bandCount: 4,
      edgeSharpness: 0.85,
      preservePBRSpecular: true,
      preserveSubsurfaceGlow: true
    },
    iridescence: { enabled: false, latticeSpacingNm: 0, intensity: 0 }
  },

  toxic_starburst: {
    paletteId: "toxic_starburst",
    name: "Toxic Starburst",
    author: "Kimmy",
    mode: "pure_flat",
    agarBackground: "#000000",
    solubleHaloColor: "#38b000", // Radioactive green
    solubleHaloGlow: 2.0,
    cosineGradient: {
      offset: [0.5, 0.5, 0.5],
      amplitude: [0.5, 0.5, 0.5],
      frequency: [1.0, 1.0, 1.0],
      phase: [0.3, 0.2, 0.2]
    },
    colorStops: [
      { position: 0.00, hex: "#000000", role: "Pitch Black", flatBand: true },
      { position: 0.25, hex: "#006400", role: "Dark Sludge", flatBand: true },
      { position: 0.50, hex: "#70e000", role: "Biohazard Green", flatBand: true },
      { position: 0.75, hex: "#ccff33", role: "Electric Chartreuse", flatBand: true },
      { position: 1.00, hex: "#ffffff", role: "Blinding Apex", flatBand: true }
    ],
    flatColorSettings: {
      enabled: true,
      bandCount: 6,
      edgeSharpness: 1.0, // Razor sharp vector-art bands
      preservePBRSpecular: false, // Pure 2D pop-art mode
      preserveSubsurfaceGlow: false
    },
    iridescence: { enabled: false, latticeSpacingNm: 0, intensity: 0 }
  },

  iridescent_flavobacterium: {
    paletteId: "iridescent_flavobacterium",
    name: "Bragg-Snell Photonic Jewel",
    author: "Kimmy",
    mode: "pure_pbr",
    agarBackground: "#050608",
    solubleHaloColor: "#000000", // No halo
    solubleHaloGlow: 0.0,
    cosineGradient: {
      offset: [0.5, 0.5, 0.5],
      amplitude: [0.5, 0.5, 0.5],
      frequency: [1.0, 1.0, 1.0],
      phase: [0.0, 0.33, 0.67]
    },
    colorStops: [
      // When iridescence is broken, fallback to these dark purples/greys
      { position: 0.0, hex: "#1d2d44", flatBand: false },
      { position: 1.0, hex: "#3e5c76", flatBand: false }
    ],
    flatColorSettings: {
      enabled: false,
      bandCount: 0,
      edgeSharpness: 0.0,
      preservePBRSpecular: true,
      preserveSubsurfaceGlow: true
    },
    iridescence: {
      enabled: true,
      latticeSpacingNm: 430.0, // Intense Green shifting to blue
      intensity: 0.95
    }
  },

  blood_agar_hemolysis: {
    paletteId: "blood_agar_hemolysis",
    name: "Beta Hemolysis on Blood Agar",
    author: "Kimmy",
    mode: "pure_pbr",
    agarBackground: "#590d22", // Deep opaque blood red
    solubleHaloColor: "#ffba08", // Yellowish transparent clearing zone
    solubleHaloGlow: 0.8,
    cosineGradient: {
      offset: [0.5, 0.5, 0.5],
      amplitude: [0.5, 0.5, 0.5],
      frequency: [1.0, 1.0, 1.0],
      phase: [0.0, 0.33, 0.67]
    },
    colorStops: [
      { position: 0.0, hex: "#8a817c", role: "Base Colony", flatBand: false },
      { position: 1.0, hex: "#f4f3ee", role: "White Crest", flatBand: false }
    ],
    flatColorSettings: {
      enabled: false,
      bandCount: 0,
      edgeSharpness: 0.0,
      preservePBRSpecular: true,
      preserveSubsurfaceGlow: true
    },
    iridescence: { enabled: false, latticeSpacingNm: 0, intensity: 0 }
  }
};

/**
 * ============================================================================
 * 2. PALETTE MANAGER / LUT GENERATOR
 * ============================================================================
 * Converts Kimmy's JSON palettes into a WebGLTexture.
 * The fragment shaders read this texture using a phase coordinate (0.0 to 1.0)
 * derived from the biological state (e.g., active growth, elevation, chemicals).
 */
export class PaletteManager {
  private gl: WebGL2RenderingContext;
  private lutTexture: WebGLTexture;
  private lutWidth = 512;
  
  public currentPalette: KimmyPalette = KIMMY_PRESETS.acid_pyocyanin;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error("Failed to allocate 1D Palette LUT texture");
    this.lutTexture = tex;
    
    // Initialize with default
    this.applyPalette(this.currentPalette);
  }

  private hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  /**
   * Builds a 512x1 RGBA8 texture from Kimmy's colorStops.
   * - RGB Channels: The interpolated color.
   * - A Channel: A boolean flag (255 or 0) communicating to the shader 
   *   whether this specific coordinate should be forced into a flat band.
   */
  public applyPalette(palette: KimmyPalette): WebGLTexture {
    this.currentPalette = palette;
    const { gl, lutWidth } = this;
    const data = new Uint8Array(lutWidth * 4);
    
    // Ensure stops are sorted by position
    const stops = [...palette.colorStops].sort((a, b) => a.position - b.position);

    for (let i = 0; i < lutWidth; i++) {
      const t = i / (lutWidth - 1);
      let left = stops[0];
      let right = stops[stops.length - 1];

      // Find the two color stops that bracket the current 't'
      for (let s = 0; s < stops.length - 1; s++) {
        if (t >= stops[s].position && t <= stops[s + 1].position) {
          left = stops[s];
          right = stops[s + 1];
          break;
        }
      }

      const span = Math.max(0.0001, right.position - left.position);
      const localT = Math.min(1.0, Math.max(0.0, (t - left.position) / span));

      // If the left stop demands a flat band, we apply a power curve to the interpolation
      // to snap it faster to the color, creating a stepped gradient.
      const mixFactor = left.flatBand 
        ? Math.pow(localT, 1.0 / Math.max(0.01, 1.0 - palette.flatColorSettings.edgeSharpness))
        : localT;

      const rgbL = this.hexToRgb(left.hex);
      const rgbR = this.hexToRgb(right.hex);

      const idx = i * 4;
      data[idx + 0] = Math.round(rgbL[0] + (rgbR[0] - rgbL[0]) * mixFactor);
      data[idx + 1] = Math.round(rgbL[1] + (rgbR[1] - rgbL[1]) * mixFactor);
      data[idx + 2] = Math.round(rgbL[2] + (rgbR[2] - rgbL[2]) * mixFactor);
      
      // We pass the flatBand flag down to the shader via the Alpha channel.
      // The shader uses this to know if it should quantize the UV coordinate!
      data[idx + 3] = left.flatBand ? 255 : 0;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.lutTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lutWidth, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Linear filtering ensures smooth gradients, but the shader will step the UVs 
    // mathematically if flat bands are enabled, giving us the best of both worlds.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return this.lutTexture;
  }

  public getTexture(): WebGLTexture {
    return this.lutTexture;
  }
}