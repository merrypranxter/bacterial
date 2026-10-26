/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 05: PHOTONIC CRYSTAL IRIDESCENCE & GLIDING MOTILITY
 * ============================================================================
 * Biophysical & Microbiological References (Synthesized from Research Notebooks):
 * 1. Kientz, Vukusic, Mignot et al. (2012) / Johansen et al. (2018):
 *    Glitter-like iridescence within the Bacteroidetes (e.g., Cellulophaga lytica).
 *    Color is not a pigment, but structural: rod-shaped cells pack into regular
 *    hexagonal lattices forming a 2D photonic crystal.
 * 2. Hoekmine / Vignolini Group (Flavobacterium IR1):
 *    Intense angle-dependent structural color. Wild-type cells pack perfectly
 *    to reflect sparkling green. Genetic knockouts (e.g., delta-moeA) or altered
 *    polysaccharide (fucoidan) uptake disrupt or shift this crystalline packing,
 *    tuning the reflected wavelength or losing the iridescence entirely.
 * 3. Physics of Structural Color (Bragg-Snell Law):
 *    Reflected peak wavelength lambda = 2 * d * sqrt(n_eff^2 - sin^2(theta)),
 *    where d is the lattice spacing (cell width ~ 400nm), n_eff is the effective
 *    refractive index of the biofilm, and theta is the viewing angle.
 * ============================================================================
 */

export type PhotonicSpeciesId =
  | "flavobacterium_ir1_wildtype"
  | "flavobacterium_ir1_moea_mutant"
  | "flavobacterium_fucoidan_shifted"
  | "cellulophaga_lytica_glitter";

export interface PhotonicPBRTextureProfile {
  /** Effective refractive index of the bacterial biofilm matrix (usually ~1.33 to 1.45) */
  effectiveRefractiveIndex: number;
  /** Nanometer spacing of the cellular crystal lattice (d). Determines the base color! */
  latticeSpacingNm: number;
  /** How strictly the Bragg-Snell reflection is enforced (0 = diffuse, 1 = perfect mirror crystal) */
  photonicCrystalPerfection: number;
  /** Scale of the macroscopic metallic "glitter" flakes seen in C. lytica */
  glitterFlakeScale: number;
  /** Contrast/intensity of the glitter flakes */
  glitterContrast: number;
  /** Baseline surface roughness of the non-iridescent areas */
  baseRoughness: number;
  /** Subsurface scattering for the underlying biomass before structural reflection */
  biomassSubsurfaceScatter: number;
  /** Height multiplier for the colony body */
  colonyElevationScale: number;
}

export interface PhotonicPsychedelicProfile {
  agarBaseHex: string;
  /** The fallback color of the biomass if structural iridescence is disrupted */
  disorderedBiomassHex: string;
  /** Mix factor to overlay Kimmy's flat screen-print posterization underneath the iridescence */
  kimmyUnderlayMix: number;
  enableFlatColorBands: boolean;
  flatBandCount: number;
  flatEdgeSharpness: number;
  /** Artificial psychedelic frequency multiplier applied to the nanostructure lattice */
  structuralWaveFrequency: number;
}

export interface PhotonicSpeciesPreset {
  id: PhotonicSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  structuralMechanism: string;
  bergeyForm: "Circular-Spreading" | "Irregular-Gliding";
  bergeyMargin: "Entire" | "Swarming-Fringe";
  description: string;

  /** Coupled PDE Biophysical Parameters (Gliding Motility & Crystallization) */
  math: {
    /** Diffusivity of active cells (Db) */
    Db: number;
    /** Diffusivity of nutrients (Dn) */
    Dn: number;
    /** Collective gliding motility coefficient (enhances expansion at high density) */
    glidingMotilityGamma: number;
    /** Crystallization rate: How fast crowded cells align into a 2D hexagonal lattice */
    latticeOrderingRate: number;
    /** Disruption rate: How fast growth/division mechanically destroys the crystal order */
    disorderStressRate: number;
    /** Maximal cell division rate kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Slime secretion rate (aids in gliding) */
    slimeSecretionAlpha: number;
    /** The optimal biomass density required to form a perfect photonic crystal */
    optimalPackingDensity: number;
  };

  texture: PhotonicPBRTextureProfile;
  psychedelic: PhotonicPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 05)
 * ============================================================================
 */
export const PHOTONIC_SPECIES_PRESETS: Record<PhotonicSpeciesId, PhotonicSpeciesPreset> = {
  flavobacterium_ir1_wildtype: {
    id: "flavobacterium_ir1_wildtype",
    scientificName: "Flavobacterium IR1 (Wild-Type)",
    commonMorphotypeName: "Intense Sparkling Green Photonic Crystal",
    structuralMechanism: "2D Hexagonal Cellular Lattice (~420nm spacing)",
    bergeyForm: "Circular-Spreading",
    bergeyMargin: "Entire",
    description:
      "Isolated from Rotterdam harbour. Elongated cells pack seamlessly into a tight hexagonal lattice. Because the lattice spacing perfectly matches the wavelength of visible light, the colony reflects an intense, metallic green iridescence that shifts to blue at shallow viewing angles.",
    math: {
      Db: 0.12,
      Dn: 0.90,
      glidingMotilityGamma: 0.45,
      latticeOrderingRate: 1.25, // Very fast, highly ordered crystallization
      disorderStressRate: 0.35,
      growthRateKappa: 0.85,
      nutrientConsumption: 0.60,
      slimeSecretionAlpha: 0.20,
      optimalPackingDensity: 1.20,
    },
    texture: {
      effectiveRefractiveIndex: 1.38,
      latticeSpacingNm: 430.0, // Primary Green reflection
      photonicCrystalPerfection: 0.95, // Near-perfect mirror-like iridescence
      glitterFlakeScale: 12.0,
      glitterContrast: 0.2, // Smooth, continuous metallic sheen
      baseRoughness: 0.15,
      biomassSubsurfaceScatter: 0.3,
      colonyElevationScale: 1.0, // Flatter spreading colonies
    },
    psychedelic: {
      agarBaseHex: "#050608",
      disorderedBiomassHex: "#2b2d42", // Dull greyish-purple where crystal is broken
      kimmyUnderlayMix: 0.35, // Let some pop-art flat bands show through the metallic sheen
      enableFlatColorBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.85,
      structuralWaveFrequency: 1.0, // Natural physics
    },
  },

  flavobacterium_ir1_moea_mutant: {
    id: "flavobacterium_ir1_moea_mutant",
    scientificName: "Flavobacterium IR1 (ΔmoeA Mutant)",
    commonMorphotypeName: "Blue-Shifted Semi-Disordered Lattice",
    structuralMechanism: "Altered Dimensions & Packing Density",
    bergeyForm: "Circular-Spreading",
    bergeyMargin: "Entire",
    description:
      "A genetic knockout of the moeA gene (molybdopterin molybdenum transferase) alters the cell shape and gliding mechanism. The cells pack much tighter, shifting the Bragg diffraction wavelength into the deep blue/violet spectrum, with a noticeable loss in overall crystal perfection.",
    math: {
      Db: 0.10,
      Dn: 0.90,
      glidingMotilityGamma: 0.25, // Impaired gliding
      latticeOrderingRate: 0.65, // Struggles to achieve perfect order
      disorderStressRate: 0.55, // Growth easily breaks the crystal
      growthRateKappa: 0.82,
      nutrientConsumption: 0.65,
      slimeSecretionAlpha: 0.15,
      optimalPackingDensity: 1.45, // Tighter packing
    },
    texture: {
      effectiveRefractiveIndex: 1.38,
      latticeSpacingNm: 360.0, // Deep Blue / Violet reflection
      photonicCrystalPerfection: 0.65, // Matted, less intense iridescence
      glitterFlakeScale: 15.0,
      glitterContrast: 0.4, // Patchy structural color
      baseRoughness: 0.35,
      biomassSubsurfaceScatter: 0.5,
      colonyElevationScale: 1.1,
    },
    psychedelic: {
      agarBaseHex: "#0a0908",
      disorderedBiomassHex: "#4a4e69",
      kimmyUnderlayMix: 0.65, // More reliance on underlying Kimmy palettes
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.9,
      structuralWaveFrequency: 1.5,
    },
  },

  cellulophaga_lytica_glitter: {
    id: "cellulophaga_lytica_glitter",
    scientificName: "Cellulophaga lytica",
    commonMorphotypeName: "Intense Macroscopic Glitter Flakes",
    structuralMechanism: "Polycrystalline Gliding Swarms",
    bergeyForm: "Irregular-Gliding",
    bergeyMargin: "Swarming-Fringe",
    description:
      "Exhibits a phenomenal 'glitter-like' iridescence. Gliding motility organizes the colony into distinct, millimeter-sized polycrystalline domains with varying orientations. Under direct light, the colony flashes like a chaotic mosaic of green, gold, and red sequins.",
    math: {
      Db: 0.25, // Highly motile gliding
      Dn: 0.95,
      glidingMotilityGamma: 0.85, // Explosive gliding swarms
      latticeOrderingRate: 0.95,
      disorderStressRate: 0.45,
      growthRateKappa: 0.88,
      nutrientConsumption: 0.55,
      slimeSecretionAlpha: 0.65,
      optimalPackingDensity: 1.10,
    },
    texture: {
      effectiveRefractiveIndex: 1.40,
      latticeSpacingNm: 480.0, // Base Gold/Green
      photonicCrystalPerfection: 0.98, // Intense mirror reflection within each flake
      glitterFlakeScale: 4.5, // Large, distinct macroscopic flakes
      glitterContrast: 1.0, // Extremely high contrast between crystal domains
      baseRoughness: 0.20,
      biomassSubsurfaceScatter: 0.4,
      colonyElevationScale: 0.85, // Very flat, spreading biofilm
    },
    psychedelic: {
      agarBaseHex: "#040306",
      disorderedBiomassHex: "#1d2d44",
      kimmyUnderlayMix: 0.20,
      enableFlatColorBands: false, // Let the pure polycrystalline physics do the talking
      flatBandCount: 4,
      flatEdgeSharpness: 0.5,
      structuralWaveFrequency: 2.5, // Exaggerates the color shifts across flakes
    },
  },

  flavobacterium_fucoidan_shifted: {
    id: "flavobacterium_fucoidan_shifted",
    scientificName: "Flavobacterium IR1 (Fucoidan Cultured)",
    commonMorphotypeName: "Red-Shifted Polysaccharide Swell",
    structuralMechanism: "Polysaccharide-Swollen Lattice (~580nm)",
    bergeyForm: "Circular-Spreading",
    bergeyMargin: "Entire",
    description:
      "When cultured on media rich in the polysaccharide fucoidan, a specific PUL (Polysaccharide Utilization Locus) operon is activated. The uptake of this large polymer physically swells the biofilm matrix, pushing the cellular lattice apart and shifting the iridescence to a fiery ruby-red and orange.",
    math: {
      Db: 0.14,
      Dn: 0.85,
      glidingMotilityGamma: 0.40,
      latticeOrderingRate: 1.05,
      disorderStressRate: 0.40,
      growthRateKappa: 0.78, // Slower growth on complex sugars
      nutrientConsumption: 0.70,
      slimeSecretionAlpha: 0.85, // High exopolysaccharide production
      optimalPackingDensity: 0.95, // Swollen, lower density packing
    },
    texture: {
      effectiveRefractiveIndex: 1.36, // Lowered IOR due to excess water/sugar matrix
      latticeSpacingNm: 590.0, // Swollen Red/Orange reflection
      photonicCrystalPerfection: 0.88,
      glitterFlakeScale: 8.0,
      glitterContrast: 0.45,
      baseRoughness: 0.12, // Very wet, mucoid
      biomassSubsurfaceScatter: 0.7,
      colonyElevationScale: 1.35, // Thick, swollen biofilm
    },
    psychedelic: {
      agarBaseHex: "#0c0804",
      disorderedBiomassHex: "#3c0919",
      kimmyUnderlayMix: 0.45,
      enableFlatColorBands: true,
      flatBandCount: 7,
      flatEdgeSharpness: 0.8,
      structuralWaveFrequency: 1.2,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (GLIDING MOTILITY & 2D CRYSTALLIZATION)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active Biomass / Gliding Cells
 *   G (n) = Nutrient Concentration
 *   B (o) = Hexagonal Orientational Order Parameter (1.0 = Perfect Crystal, 0.0 = Chaos)
 *   A (h) = 3D Biofilm Height / Gliding Slime Matrix
 */
export const PHOTONIC_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;
uniform float u_time;

// Coupled PDE Uniforms
uniform float u_Db;
uniform float u_Dn;
uniform float u_glidingMotilityGamma;
uniform float u_latticeOrderingRate;
uniform float u_disorderStressRate;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_slimeSecretionAlpha;
uniform float u_optimalPackingDensity;

// Noise for structural defects and polycrystalline domain boundaries
float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Biomass
    float n = center.g; // Nutrient
    float o = center.b; // Photonic Crystal Order Parameter
    float h = center.a; // Biofilm slime / elevation

    // 9-point isotropic stencil
    vec4 N  = texture(u_stateTex, v_uv + vec2( 0.0,      texel.y));
    vec4 S  = texture(u_stateTex, v_uv + vec2( 0.0,     -texel.y));
    vec4 E  = texture(u_stateTex, v_uv + vec2( texel.x,  0.0));
    vec4 W  = texture(u_stateTex, v_uv + vec2(-texel.x,  0.0));
    vec4 NE = texture(u_stateTex, v_uv + vec2( texel.x,  texel.y));
    vec4 NW = texture(u_stateTex, v_uv + vec2(-texel.x,  texel.y));
    vec4 SE = texture(u_stateTex, v_uv + vec2( texel.x, -texel.y));
    vec4 SW = texture(u_stateTex, v_uv + vec2(-texel.x, -texel.y));

    vec4 lap = -1.0 * center
             + 0.20 * (N + S + E + W)
             + 0.05 * (NE + NW + SE + SW);
             
    vec2 gradB = 0.5 * vec2(E.r - W.r, N.r - S.r);
    vec2 gradH = 0.5 * vec2(E.a - W.a, N.a - S.a);

    // 1. Gliding Motility: Diffusivity drastically increases in the presence of secreted slime (h)
    float glidingEff = u_Db + u_glidingMotilityGamma * pow(max(h, 0.0), 1.5) * (0.5 + 0.5 * o);

    // 2. Michaelis-Menten Growth
    float f_n = n / (0.15 + n);
    float division = u_growthRateKappa * b * f_n;

    // 3. 2D Hexagonal Crystallization (Order Parameter Dynamics)
    // Order naturally emerges when density 'b' approaches 'optimalPackingDensity'
    // Growth and active division locally DESTROY order (disorderStressRate)
    float packingProximity = 1.0 - abs(b - u_optimalPackingDensity) / u_optimalPackingDensity;
    float crystalPotential = max(0.0, packingProximity);
    
    // Domain defect noise (creates polycrystalline glitter flakes)
    float defectNoise = hash21(floor(v_uv * u_resolution * 0.15));
    float ordering = u_latticeOrderingRate * b * crystalPotential * (0.7 + 0.3 * defectNoise) * (1.0 - o);
    float disordering = u_disorderStressRate * division * o;

    // 4. Time Integration
    float db = (glidingEff * lap.r) + dot(gradB, gradH) * 0.25 + division - 0.01 * b;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float d_order = (0.01 * lap.b) + ordering - disordering; // Minor diffusion smooths out crystal domains
    float dh = (0.05 * lap.a) + (u_slimeSecretionAlpha * b * f_n) + (0.15 * division);

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 2.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(o + u_dt * d_order, 0.0, 1.0),
        clamp(h + u_dt * dh, 0.0, 3.0)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 05)
 * ============================================================================
 * Visualizes:
 * - The Bragg-Snell Thin-Film / Photonic Crystal interference pattern.
 * - Dynamic color shifting based on viewing angle (NdotV).
 * - "Glitter-like" iridescence caused by polycrystalline domain micro-noise.
 * - Blending structural physics with Kimmy's flat-band psychedelic palettes.
 */
export const PHOTONIC_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Biomass (b), G: Nutrient (n), B: Order (o), A: Elevation (h)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Photonic & PBR Uniforms
uniform float u_effectiveRefractiveIndex;
uniform float u_latticeSpacingNm;
uniform float u_photonicCrystalPerfection;
uniform float u_glitterFlakeScale;
uniform float u_glitterContrast;
uniform float u_baseRoughness;
uniform float u_biomassSubsurfaceScatter;
uniform float u_colonyElevationScale;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarBaseColor;
uniform vec3 u_disorderedBiomassColor;
uniform float u_kimmyUnderlayMix;
uniform bool u_enableFlatColorBands;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform float u_structuralWaveFrequency;

// Voronoi noise to generate polycrystalline "Glitter Flakes" for C. lytica
vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float voronoiGlitter(vec2 uv, float scale) {
    vec2 p = uv * u_resolution * 0.1 * scale;
    vec2 n = floor(p);
    vec2 f = fract(p);
    float min_dist = 1.0;
    float cell_id = 0.0;
    
    for(int j=-1; j<=1; j++) {
        for(int i=-1; i<=1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash22(n + g);
            // Animate the glitter flashing slightly
            o = 0.5 + 0.5 * sin(u_time * 0.8 + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < min_dist) {
                min_dist = d;
                cell_id = fract(dot(n + g, vec2(11.0, 73.0)));
            }
        }
    }
    return cell_id; // Returns a random constant per flake domain
}

// Bragg-Snell Structural Color Calculation
// Returns RGB intensity for the given lattice spacing and viewing angle
vec3 calculateStructuralColor(float cosTheta, float latticeNm, float perfection) {
    // Standard RGB wavelength peaks in nm
    vec3 wavelengths = vec3(650.0, 530.0, 450.0);
    
    // n_eff^2 - sin^2(theta)
    float sinTheta2 = 1.0 - (cosTheta * cosTheta);
    float rootTerm = sqrt(max(0.0, u_effectiveRefractiveIndex * u_effectiveRefractiveIndex - sinTheta2));
    
    // Optical path difference phase shift
    vec3 phase = (4.0 * 3.14159265 * latticeNm * rootTerm) / wavelengths;
    
    // Intense iridescence follows a cosine squared interference pattern
    // Softened by the "perfection" parameter of the crystal
    vec3 interference = 0.5 + 0.5 * cos(phase);
    return mix(vec3(0.5), interference, perfection);
}

// GGX Microfacet Specular Distribution
float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float denom = (NdotH * NdotH * (a2 - 1.0) + 1.0);
    return a2 / max(3.14159265 * denom * denom, 1e-5);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 s  = texture(u_stateTex, v_uv);
    float b = s.r; // Biomass
    float n = s.g; // Nutrient
    float o = s.b; // Photonic Crystal Order Parameter (0 to 1)
    float h = s.a; // Elevation

    // 1. Reconstruct 3D Elevation & Normals
    float hC = (h * 0.7 + b * 0.5) * u_colonyElevationScale;
    float hE = (texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).a * 0.7 + texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).r * 0.5) * u_colonyElevationScale;
    float hW = (texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).a * 0.7 + texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).r * 0.5) * u_colonyElevationScale;
    float hN = (texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).a * 0.7 + texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).r * 0.5) * u_colonyElevationScale;
    float hS = (texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).a * 0.7 + texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).r * 0.5) * u_colonyElevationScale;

    vec2 gradH = vec2(hE - hW, hN - hS) * 20.0;
    
    // Polycrystalline Glitter Noise Perturbs the Normal slightly
    float flakeID = voronoiGlitter(v_uv, u_glitterFlakeScale);
    float flakeAngle = flakeID * 6.2831;
    vec2 glitterPerturb = vec2(cos(flakeAngle), sin(flakeAngle)) * u_glitterContrast * o * 0.15;
    
    vec3 N = normalize(vec3(-(gradH + glitterPerturb), 1.0));
    float colonyMask = smoothstep(0.02, 0.08, b + h);

    // 2. Psychedelic / Flat-Color Base Coordinate
    // This is Kimmy's layer underneath the metallic structural reflection
    float rawCoord = clamp(h * 0.35 + b * 0.65, 0.0, 1.0);
    float colorCoord = rawCoord;
    if (u_enableFlatColorBands) {
        float scaled = rawCoord * u_flatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.25, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_flatBandCount;
        colorCoord = mix(rawCoord, stepped, u_flatEdgeSharpness);
    }

    vec3 baseAlbedo;
    if (u_useKimmyLut) {
        baseAlbedo = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        baseAlbedo = u_disorderedBiomassColor; 
    }

    // 3. Physics: Lighting Setup
    vec3 V = vec3(0.0, 0.0, 1.0); // Looking straight down
    // Primary light source animated to show off iridescence shifts
    vec3 L1 = normalize(vec3(cos(u_time * 0.15) * 0.7, sin(u_time * 0.15) * 0.7, 0.7)); 
    vec3 L2 = normalize(vec3(-0.5, -0.5, 0.7)); // Static fill light
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, V), 0.0);
    float NdotH1 = max(dot(N, H1), 0.0);

    // 4. Calculate Structural Color (The Magic of Flavobacterium IR1)
    // The lattice spacing is modulated slightly by the structural wave frequency for psychedelic effect
    float activeLatticeNm = u_latticeSpacingNm * (1.0 + 0.1 * sin(o * 15.0 * u_structuralWaveFrequency));
    
    // We use NdotH1 for the iridescence calculation to simulate the active reflection angle to the camera
    float angleFactor = max(NdotH1, NdotV); 
    
    // Effective perfection combines the preset's max perfection with the PDE's local order parameter (o)
    float currentPerfection = u_photonicCrystalPerfection * o;
    
    vec3 structuralIridescence = calculateStructuralColor(angleFactor, activeLatticeNm, currentPerfection);
    
    // Apply macroscopic glitter contrast (makes some flakes dark, some bright based on angle)
    float glitterFlash = pow(0.5 + 0.5 * sin(flakeID * 43.0 + u_time * 1.5 + NdotV * 5.0), 4.0);
    structuralIridescence *= mix(1.0, 0.2 + 1.8 * glitterFlash, u_glitterContrast * o);

    // 5. Final PBR Blending
    // Subsurface glow of the underlying biomass
    float sssWrap = max(0.0, (dot(N, L1) + 0.6) / 1.6);
    float thinness = exp(-hC * 1.5);
    vec3 sssGlow = baseAlbedo * sssWrap * thinness * u_biomassSubsurfaceScatter;

    // Specular lobe for the wet mucosal layer over the crystal
    float spec1 = distributionGGX(N, H1, u_baseRoughness);
    float spec2 = distributionGGX(N, H2, u_baseRoughness * 1.2) * 0.3;
    
    float f0 = pow((u_effectiveRefractiveIndex - 1.0) / (u_effectiveRefractiveIndex + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    // Blend Kimmy's Base Albedo with the Structural Color
    vec3 combinedColor = mix(structuralIridescence, baseAlbedo, u_kimmyUnderlayMix * (1.0 - currentPerfection));

    vec3 litColony = combinedColor * (0.3 + 0.7 * NdotL1 + 0.2 * NdotL2)
                   + sssGlow
                   + vec3(1.0, 0.99, 0.98) * (spec1 + spec2) * (0.2 + 0.8 * fresnel);

    // Background agar
    vec3 finalRGB = mix(u_agarBaseColor, litColony, colonyMask);
    
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 05
 * ============================================================================
 */
export function bindPhotonicPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: PhotonicSpeciesPreset
): void {
  const hexToVec3 = (hex: string): [number, number, number] => {
    const clean = hex.replace("#", "");
    const n = parseInt(clean, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  // Bind PDE Simulation Uniforms
  gl.useProgram(simProgram);
  const m = preset.math;
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Db"), m.Db);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dn"), m.Dn);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_glidingMotilityGamma"), m.glidingMotilityGamma);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_latticeOrderingRate"), m.latticeOrderingRate);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_disorderStressRate"), m.disorderStressRate);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_slimeSecretionAlpha"), m.slimeSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_optimalPackingDensity"), m.optimalPackingDensity);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_effectiveRefractiveIndex"), t.effectiveRefractiveIndex);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_latticeSpacingNm"), t.latticeSpacingNm);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_photonicCrystalPerfection"), t.photonicCrystalPerfection);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_glitterFlakeScale"), t.glitterFlakeScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_glitterContrast"), t.glitterContrast);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_baseRoughness"), t.baseRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_biomassSubsurfaceScatter"), t.biomassSubsurfaceScatter);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_colonyElevationScale"), t.colonyElevationScale);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarBaseColor"), hexToVec3(p.agarBaseHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_disorderedBiomassColor"), hexToVec3(p.disorderedBiomassHex));
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_kimmyUnderlayMix"), p.kimmyUnderlayMix);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableFlatColorBands"), p.enableFlatColorBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatBandCount"), p.flatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatEdgeSharpness"), p.flatEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_structuralWaveFrequency"), p.structuralWaveFrequency);
}