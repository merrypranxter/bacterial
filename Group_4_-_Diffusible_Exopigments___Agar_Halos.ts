/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 04: DIFFUSIBLE EXOPIGMENTS & AGAR HALOS
 * ============================================================================
 * Biophysical & Microbiological References (Synthesized from Research Notebooks):
 * 1. Dietrich et al. (2006) / Price-Whelan et al. (2006):
 *    Pseudomonas aeruginosa phenazines (Pyocyanin). These water-soluble, redox-
 *    active secondary metabolites are excreted into the agar matrix to reduce
 *    environmental electron acceptors. They diffuse rapidly ahead of the colony
 *    margin, painting the agar deep blue/green.
 * 2. Bystrykh et al. (1996) / Hopwood (2007):
 *    Streptomyces coelicolor produces Actinorhodin, a water-soluble polyketide
 *    pigment that acts as a natural pH indicator. As the colony ages, metabolic
 *    byproducts shift the local agar pH, causing the diffusing pigment halo to
 *    transition dynamically from red (acidic) to deep blue (alkaline).
 * 3. Bergey's Manual / Blood Agar Hemolysis (Streptococcus):
 *    - Beta (β) Hemolysis: Secretion of Streptolysin O/S completely lyses and
 *      digests red blood cells in the agar, leaving a transparent, cleared halo.
 *    - Alpha (α) Hemolysis: Secretion of hydrogen peroxide (H2O2) oxidizes
 *      hemoglobin to green methemoglobin, creating a dark, murky olive-green halo.
 * ============================================================================
 */

export type ExopigmentSpeciesId =
  | "pseudomonas_pyocyanin_halo"
  | "pseudomonas_pyoverdine_uv"
  | "streptomyces_actinorhodin_ph"
  | "streptococcus_pyogenes_beta_hemolysis"
  | "streptococcus_pneumoniae_alpha_hemolysis";

export interface ExopigmentPBRTextureProfile {
  /** 0.0 = completely dry/matte, 1.0 = highly reflective mucoid slime */
  colonyRoughness: number;
  /** Height multiplier for the actual cellular biomass dome */
  colonyElevationScale: number;
  /** Translucency / subsurface scattering of the colony body */
  colonySubsurfaceScatter: number;
  /** 0.0 = opaque agar, 1.0 = completely transparent glass-like agar (for hemolysis) */
  agarBaseTranslucency: number;
  /** Refractive index of the wet agar medium (usually ~ 1.33 for water/gel) */
  agarIOR: number;
  /** How much the diffusing pigment glows / emits light volumetrically in the agar */
  haloVolumetricGlow: number;
}

export interface ExopigmentPsychedelicProfile {
  /** The natural un-stained color of the agar background (e.g., Blood Agar Red or Nutrient Amber) */
  agarBaseHex: string;
  /** The color of the mature bacterial colony body */
  colonyBiomassHex: string;
  /** The primary color of the water-soluble pigment or the initial pH state */
  pigmentPrimaryHex: string;
  /** The secondary pigment color (used for pH shifting or UV fluorescence) */
  pigmentSecondaryHex: string;
  /** For hemolysis: the color of the cleared/oxidized zone in the agar */
  agarClearingHex: string;
  /** Injects Kimmy's razor-sharp screen-print flat color bands into the DIFFUSING HALO */
  enableHaloFlatBands: boolean;
  /** Number of quantized posterization bands radiating out into the agar */
  haloFlatBandCount: number;
  /** 0.0 = smooth smoky diffusion, 1.0 = hard-edge pop-art target rings */
  haloEdgeSharpness: number;
  /** Wavelength of psychedelic rippling within the agar halo */
  haloWaveFrequency: number;
}

export interface ExopigmentSpeciesPreset {
  id: ExopigmentSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  pigmentOrToxinName: string;
  haloType: "Diffusible-Pigment" | "pH-Indicator" | "Beta-Hemolysis" | "Alpha-Hemolysis";
  description: string;

  /** Coupled PDE Biophysical Parameters */
  math: {
    /** Base bacterial diffusivity D_b */
    Db: number;
    /** Nutrient diffusivity D_n */
    Dn: number;
    /** Exopigment or Toxin diffusivity D_p in the agar (usually MUCH faster than Db) */
    Dp: number;
    /** Agar State diffusivity D_a (tracks pH diffusion or red blood cell lysis propagation) */
    Da: number;
    /** Maximal cell division rate kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Secretion rate of the water-soluble pigment / toxin per active cell */
    exopigmentSecretionAlpha: number;
    /** Decay or breakdown rate of the pigment in the agar */
    exopigmentDecayBeta: number;
    /** Rate at which the colony alters the background agar state (e.g., acidifying pH or lysing cells) */
    agarStateShiftRate: number;
    /** Baseline starting state of the agar (e.g., 0.5 for neutral pH, 1.0 for 100% intact blood cells) */
    agarInitialState: number;
    /** KPZ lateral shoving / colony boundary sharpness */
    colonyCompactness: number;
  };

  texture: ExopigmentPBRTextureProfile;
  psychedelic: ExopigmentPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 04)
 * ============================================================================
 */
export const EXOPIGMENT_SPECIES_PRESETS: Record<ExopigmentSpeciesId, ExopigmentSpeciesPreset> = {
  pseudomonas_pyocyanin_halo: {
    id: "pseudomonas_pyocyanin_halo",
    scientificName: "Pseudomonas aeruginosa (Pyocyanin Strain)",
    commonMorphotypeName: "Cyan-Blue Diffusing Phenazine Halo",
    pigmentOrToxinName: "Pyocyanin (Water-Soluble Phenazine)",
    haloType: "Diffusible-Pigment",
    description:
      "A fast-growing, highly motile opportunistic pathogen. Secretes large quantities of the redox-active, water-soluble pigment pyocyanin. While the colony itself is an opaque, slightly metallic mucoid mound, it paints a massive, spreading cyan/teal halo deep into the surrounding agar matrix.",
    math: {
      Db: 0.12,
      Dn: 0.85,
      Dp: 0.95, // Extremely fast diffusion through the agar gel
      Da: 0.10,
      growthRateKappa: 0.92,
      nutrientConsumption: 0.65,
      exopigmentSecretionAlpha: 0.85,
      exopigmentDecayBeta: 0.08,
      agarStateShiftRate: 0.0, // Standard diffusion, no pH shift needed
      agarInitialState: 0.0,
      colonyCompactness: 0.45,
    },
    texture: {
      colonyRoughness: 0.15, // Wet, glossy mucoid sheen
      colonyElevationScale: 1.25,
      colonySubsurfaceScatter: 0.75,
      agarBaseTranslucency: 0.25,
      agarIOR: 1.34,
      haloVolumetricGlow: 0.85, // Strong psychedelic neon glow in the agar
    },
    psychedelic: {
      agarBaseHex: "#090b0c",
      colonyBiomassHex: "#1a4301",
      pigmentPrimaryHex: "#00f5d4", // Bright Cyan
      pigmentSecondaryHex: "#0077b6", // Deep Blue edge
      agarClearingHex: "#000000",
      enableHaloFlatBands: true,
      haloFlatBandCount: 8,
      haloEdgeSharpness: 0.88,
      haloWaveFrequency: 6.5,
    },
  },

  pseudomonas_pyoverdine_uv: {
    id: "pseudomonas_pyoverdine_uv",
    scientificName: "Pseudomonas fluorescens (Pyoverdine Strain)",
    commonMorphotypeName: "Electric UV-Green Siderophore Halo",
    pigmentOrToxinName: "Pyoverdine (Fluorescent Siderophore)",
    haloType: "Diffusible-Pigment",
    description:
      "When starved of iron, this species secretes pyoverdine, an intensely fluorescent, water-soluble siderophore. The pigment spreads into the agar and glows an aggressive, almost radioactive yellow-green when exposed to UV light, vastly out-scaling the physical boundaries of the bacterial colony.",
    math: {
      Db: 0.10,
      Dn: 0.88,
      Dp: 1.20, // Explosive diffusion rate for small siderophore molecules
      Da: 0.10,
      growthRateKappa: 0.90,
      nutrientConsumption: 0.70,
      exopigmentSecretionAlpha: 1.10,
      exopigmentDecayBeta: 0.15,
      agarStateShiftRate: 0.0,
      agarInitialState: 0.0,
      colonyCompactness: 0.50,
    },
    texture: {
      colonyRoughness: 0.22,
      colonyElevationScale: 1.10,
      colonySubsurfaceScatter: 0.80,
      agarBaseTranslucency: 0.20,
      agarIOR: 1.33,
      haloVolumetricGlow: 1.35, // Overdriven bloom/glow for UV fluorescence
    },
    psychedelic: {
      agarBaseHex: "#050505",
      colonyBiomassHex: "#5c6b73", // Drab colony body makes the halo pop
      pigmentPrimaryHex: "#ccff33", // Electric UV Green
      pigmentSecondaryHex: "#70e000",
      agarClearingHex: "#000000",
      enableHaloFlatBands: true,
      haloFlatBandCount: 5,
      haloEdgeSharpness: 0.94,
      haloWaveFrequency: 9.0,
    },
  },

  streptomyces_actinorhodin_ph: {
    id: "streptomyces_actinorhodin_ph",
    scientificName: "Streptomyces coelicolor",
    commonMorphotypeName: "Actinorhodin pH-Shifting Halo",
    pigmentOrToxinName: "Actinorhodin (pH-Indicator Polyketide)",
    haloType: "pH-Indicator",
    description:
      "A soil-dwelling actinomycete that grows as a dense, dry mycelial mat. It excretes actinorhodin, a polyketide antibiotic that acts as a powerful pH indicator. As the colony respires, it alters the local agar pH, driving a dramatic, psychedelic color shift in the halo from acidic red/pink to alkaline deep blue.",
    math: {
      Db: 0.04, // Very slow, dry mycelial growth
      Dn: 0.75,
      Dp: 0.65, // Moderate pigment diffusion
      Da: 0.85, // Rapid diffusion of protons/pH waves
      growthRateKappa: 0.65,
      nutrientConsumption: 0.45,
      exopigmentSecretionAlpha: 0.75,
      exopigmentDecayBeta: 0.05,
      agarStateShiftRate: 0.55, // Colony actively shifts pH state (a) over time
      agarInitialState: 0.2, // Starts slightly acidic
      colonyCompactness: 0.85, // Hard, leathery colony edge
    },
    texture: {
      colonyRoughness: 0.85, // Very dry, powdery/leathery mycelial texture
      colonyElevationScale: 1.40,
      colonySubsurfaceScatter: 0.25, // Opaque
      agarBaseTranslucency: 0.35,
      agarIOR: 1.35,
      haloVolumetricGlow: 0.55,
    },
    psychedelic: {
      agarBaseHex: "#120d14",
      colonyBiomassHex: "#f8f9fa", // White/grey aerial spores
      pigmentPrimaryHex: "#ef233c", // Acidic Red (low pH)
      pigmentSecondaryHex: "#3a0ca3", // Alkaline Blue (high pH)
      agarClearingHex: "#000000",
      enableHaloFlatBands: true,
      haloFlatBandCount: 12, // Lots of bands to show off the pH gradient shift
      haloEdgeSharpness: 0.82,
      haloWaveFrequency: 14.0,
    },
  },

  streptococcus_pyogenes_beta_hemolysis: {
    id: "streptococcus_pyogenes_beta_hemolysis",
    scientificName: "Streptococcus pyogenes (Group A Strep)",
    commonMorphotypeName: "Beta (β) Hemolysis Clear Zone",
    pigmentOrToxinName: "Streptolysin O/S (Erythrocyte Exotoxin)",
    haloType: "Beta-Hemolysis",
    description:
      "When cultured on Blood Agar, this pathogen secretes exotoxins (Streptolysin) that rapidly diffuse into the medium and completely rupture the red blood cells. This creates a sharply defined, completely transparent zone of 'clearing' around the colony, wiping out the opaque crimson agar background.",
    math: {
      Db: 0.08,
      Dn: 0.80,
      Dp: 0.75, // Toxin diffusion rate
      Da: 0.00, // Not used as a diffusing field, 'a' represents fixed RBCs
      growthRateKappa: 0.85,
      nutrientConsumption: 0.60,
      exopigmentSecretionAlpha: 0.95, // Toxin production
      exopigmentDecayBeta: 0.12,
      agarStateShiftRate: -1.8, // Rapidly DESTROYS the agar initial state (RBCs)
      agarInitialState: 1.0, // 100% Intact Red Blood Cells (Opaque)
      colonyCompactness: 0.65,
    },
    texture: {
      colonyRoughness: 0.35,
      colonyElevationScale: 0.85, // Small, low convex colonies
      colonySubsurfaceScatter: 0.65,
      agarBaseTranslucency: 0.05, // Starts highly opaque (blood)
      agarIOR: 1.36,
      haloVolumetricGlow: 0.0, // No glow, just clearing/transparency
    },
    psychedelic: {
      agarBaseHex: "#660000", // Deep, opaque Blood Agar Red
      colonyBiomassHex: "#e0e1dd", // Pale whitish colony
      pigmentPrimaryHex: "#000000", // (Unused for pure clearing)
      pigmentSecondaryHex: "#000000", // (Unused)
      agarClearingHex: "#ffb703", // The color of the transparent backlit agar base once RBCs are gone
      enableHaloFlatBands: false, // Smoothly transitioning clearing zone
      haloFlatBandCount: 4,
      haloEdgeSharpness: 0.4,
      haloWaveFrequency: 4.0,
    },
  },

  streptococcus_pneumoniae_alpha_hemolysis: {
    id: "streptococcus_pneumoniae_alpha_hemolysis",
    scientificName: "Streptococcus pneumoniae",
    commonMorphotypeName: "Alpha (α) Hemolysis Green Oxidation",
    pigmentOrToxinName: "Hydrogen Peroxide (H2O2) Oxidation",
    haloType: "Alpha-Hemolysis",
    description:
      "Produces hydrogen peroxide which diffuses into Blood Agar, partially damaging the red blood cells and oxidizing the red hemoglobin into a murky, dark olive-green methemoglobin. Creates a characteristic dark green halo ('viridans') rather than a fully transparent clearing.",
    math: {
      Db: 0.09,
      Dn: 0.82,
      Dp: 0.85, // H2O2 diffusion
      Da: 0.0,
      growthRateKappa: 0.82,
      nutrientConsumption: 0.58,
      exopigmentSecretionAlpha: 0.70, // H2O2 production
      exopigmentDecayBeta: 0.25, // H2O2 breaks down quickly
      agarStateShiftRate: -1.2, // Modifies RBC state
      agarInitialState: 1.0, // 100% Intact Hemoglobin (Red)
      colonyCompactness: 0.70,
    },
    texture: {
      colonyRoughness: 0.40,
      colonyElevationScale: 0.90,
      colonySubsurfaceScatter: 0.60,
      agarBaseTranslucency: 0.10, // Opaque blood agar
      agarIOR: 1.35,
      haloVolumetricGlow: 0.15, // Slight murky reflectance
    },
    psychedelic: {
      agarBaseHex: "#780000", // Deep Blood Red
      colonyBiomassHex: "#a7a2a9",
      pigmentPrimaryHex: "#000000", // (Unused)
      pigmentSecondaryHex: "#000000", // (Unused)
      agarClearingHex: "#2b3a00", // Dark Murky Methemoglobin Olive-Green!
      enableHaloFlatBands: true,
      haloFlatBandCount: 5,
      haloEdgeSharpness: 0.65,
      haloWaveFrequency: 5.5,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (EXOPIGMENT DIFFUSION, pH SHIFT & HEMOLYSIS)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active bacterial biomass / dividing cells
 *   G (n) = Nutrient substrate concentration
 *   B (p) = Diffusing Water-Soluble Exopigment OR Toxin (Streptolysin / H2O2)
 *   A (a) = Agar Environmental State (Tracks local pH, or Intact Red Blood Cells)
 */
export const EXOPIGMENT_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;
uniform float u_time;

// Coupled PDE Uniforms (from ExopigmentSpeciesPreset.math)
uniform float u_Db;
uniform float u_Dn;
uniform float u_Dp;
uniform float u_Da;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_exopigmentSecretionAlpha;
uniform float u_exopigmentDecayBeta;
uniform float u_agarStateShiftRate;
uniform float u_agarInitialState;
uniform float u_colonyCompactness;
uniform int u_isHemolysis; // 1 if Beta/Alpha Hemolysis, 0 if standard pigment

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Bacteria
    float n = center.g; // Nutrient
    float p = center.b; // Pigment / Toxin
    float a = center.a; // Agar State (pH or RBCs)

    // Initialization block for the agar state (run on first frames or handled externally)
    // If 'a' is 0.0 globally but u_agarInitialState > 0.0, we assume it needs seeding.
    // (In a real engine, you'd init this in a separate pass, but we'll safeguard it here).
    if (u_time < 0.1 && a < 0.01 && u_agarInitialState > 0.0) {
        a = u_agarInitialState;
    }

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

    // 1. Bacterial Expansion (KPZ/Eden-like compact shoving)
    float Db_eff = u_Db * pow(max(b, 0.001), u_colonyCompactness);
    
    // 2. Cell Growth & Nutrient Consumption
    float f_n = n / (0.15 + n);
    float division = u_growthRateKappa * b * f_n * (1.0 - b/2.5); // Logistic cap

    // 3. Exopigment / Toxin Secretion (Proportional to metabolic activity)
    float secretion = u_exopigmentSecretionAlpha * b * f_n;

    // 4. Agar State Shifting (pH changes, or Hemolysis Lysis)
    float da_local = 0.0;
    if (u_isHemolysis == 1) {
        // Hemolysis: The secreted toxin (p) destroys the intact Red Blood Cells (a)
        da_local = u_agarStateShiftRate * p * a; // Destruction rate is proportional to toxin conc and remaining cells
    } else {
        // pH Indicator: Bacterial metabolism shifts the pH. 
        // We use 'a' as a pH scalar (0.0 to 1.0). Metabolism pushes it towards 1.0 (alkaline) or 0.0 (acidic).
        da_local = u_agarStateShiftRate * b * f_n; 
    }

    // 5. Time Integration
    float db = (Db_eff * lap.r) + division - 0.01 * b;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float dp = (u_Dp * lap.b) + secretion - (u_exopigmentDecayBeta * p);
    
    // Agar state 'a' might diffuse (like pH protons) or stay fixed (like intact blood cells in a matrix)
    float da = (u_Da * lap.a) + da_local;

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 2.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(p + u_dt * dp, 0.0, 2.5),
        clamp(a + u_dt * da, 0.0, 1.0)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 04)
 * ============================================================================
 * Visualizes:
 * - Huge, glowing, water-soluble pigment halos diffusing through the agar.
 * - Dynamic pH-dependent color shifting (Actinorhodin Red -> Blue).
 * - Alpha and Beta Hemolysis: Clearing or oxidizing the agar background.
 * - Kimmy's flat-color posterization applied directly to the glowing halo gradients.
 */
export const EXOPIGMENT_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Biomass (b), G: Nutrient (n), B: Toxin/Pigment (p), A: Agar State (a)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform float u_colonyRoughness;
uniform float u_colonyElevationScale;
uniform float u_colonySubsurfaceScatter;
uniform float u_agarBaseTranslucency;
uniform float u_agarIOR;
uniform float u_haloVolumetricGlow;
uniform int u_haloType; // 0=Pigment, 1=pH, 2=BetaHemolysis, 3=AlphaHemolysis

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarBaseColor;
uniform vec3 u_colonyBiomassColor;
uniform vec3 u_pigmentPrimaryColor;
uniform vec3 u_pigmentSecondaryColor;
uniform vec3 u_agarClearingColor;
uniform bool u_enableHaloFlatBands;
uniform float u_haloFlatBandCount;
uniform float u_haloEdgeSharpness;
uniform float u_haloWaveFrequency;

// GGX Specular for wet mucoid colony surface
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
    float p = s.b; // Pigment / Toxin
    float a = s.a; // Agar State (pH or Red Blood Cells)

    // 1. Reconstruct 3D Colony Elevation & Normals
    vec4 sE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0));
    vec4 sW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0));
    vec4 sN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y));
    vec4 sS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y));

    float hC = b * u_colonyElevationScale;
    vec2 gradH = vec2(sE.r - sW.r, sN.r - sS.r) * u_colonyElevationScale * 20.0;
    vec3 N = normalize(vec3(-gradH, 1.0));
    
    // Mask for physical colony biomass
    float colonyMask = smoothstep(0.02, 0.08, b);

    // 2. Compute the Diffusing Halo / Agar Color
    vec3 finalAgarColor = u_agarBaseColor;
    float currentTranslucency = u_agarBaseTranslucency;
    float currentGlow = 0.0;

    // Posterize the diffusing pigment 'p' if Kimmy's flat bands are enabled
    float rawHaloPhase = p + 0.05 * sin(p * u_haloWaveFrequency - u_time * 1.5);
    float haloIntensity = rawHaloPhase;
    
    if (u_enableHaloFlatBands) {
        float scaled = clamp(rawHaloPhase, 0.0, 1.0) * u_haloFlatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.25, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_haloFlatBandCount;
        haloIntensity = mix(rawHaloPhase, stepped, u_haloEdgeSharpness);
    }

    if (u_haloType == 0) {
        // Standard Diffusible Pigment (e.g., Pseudomonas Pyocyanin)
        // Blends pigment over the agar base.
        float mixFactor = clamp(haloIntensity * 1.5, 0.0, 1.0);
        vec3 pigmentMix = mix(u_pigmentPrimaryColor, u_pigmentSecondaryColor, clamp(p * 0.4, 0.0, 1.0));
        finalAgarColor = mix(u_agarBaseColor, pigmentMix, mixFactor);
        currentGlow = mixFactor * u_haloVolumetricGlow;
        
    } else if (u_haloType == 1) {
        // pH Indicator Pigment (e.g., Streptomyces Actinorhodin)
        // Pigment intensity 'p' acts as an alpha layer. Agar state 'a' determines the hue (Red <-> Blue).
        float mixFactor = clamp(haloIntensity * 1.2, 0.0, 1.0);
        vec3 phTint = mix(u_pigmentPrimaryColor, u_pigmentSecondaryColor, clamp(a, 0.0, 1.0));
        finalAgarColor = mix(u_agarBaseColor, phTint, mixFactor);
        currentGlow = mixFactor * u_haloVolumetricGlow;

    } else if (u_haloType == 2 || u_haloType == 3) {
        // Hemolysis: Toxin destroys agar state 'a' (Red Blood Cells).
        // 1.0 = Intact (Base Color). 0.0 = Lysed (Clearing Color).
        
        // We can apply Kimmy's flat bands to the lysis front (1.0 - a)
        float lysisRaw = 1.0 - a;
        float lysisMapped = lysisRaw;
        
        if (u_enableHaloFlatBands) {
            float scaled = clamp(lysisRaw, 0.0, 1.0) * u_haloFlatBandCount;
            float frac = fract(scaled);
            float fw = max(fwidth(scaled) * 1.25, 0.005);
            float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_haloFlatBandCount;
            lysisMapped = mix(lysisRaw, stepped, u_haloEdgeSharpness);
        }

        finalAgarColor = mix(u_agarBaseColor, u_agarClearingColor, clamp(lysisMapped, 0.0, 1.0));
        
        if (u_haloType == 2) {
            // Beta Hemolysis: Lysis dramatically increases translucency (clearing the agar)
            currentTranslucency = mix(u_agarBaseTranslucency, 1.0, clamp(lysisMapped, 0.0, 1.0));
        } else {
            // Alpha Hemolysis: Partial clearing + oxidation
            currentTranslucency = mix(u_agarBaseTranslucency, u_agarBaseTranslucency + 0.15, clamp(lysisMapped, 0.0, 1.0));
            currentGlow = lysisMapped * u_haloVolumetricGlow;
        }
    }

    // 3. Resolve Colony Biomass Albedo
    vec3 colonyAlbedo;
    if (u_useKimmyLut) {
        // If Kimmy's LUT is bound, use biomass and pigment as coordinates
        float coord = clamp(b * 0.4 + p * 0.6, 0.0, 1.0);
        colonyAlbedo = texture(u_kimmyLutTex, vec2(coord, 0.5)).rgb;
    } else {
        colonyAlbedo = u_colonyBiomassColor;
    }

    // 4. Lighting & PBR Setup
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(cos(u_time * 0.2) * 0.5, sin(u_time * 0.2) * 0.5, 0.8));
    vec3 L2 = normalize(vec3(-0.6, -0.4, 0.7));
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, V), 0.0);

    // Subsurface Scattering for the Colony
    float sssWrap = max(0.0, (dot(N, L1) + 0.6) / 1.6);
    float thinness = exp(-hC * 1.5);
    vec3 sssGlow = colonyAlbedo * sssWrap * thinness * u_colonySubsurfaceScatter * 1.2;

    // Specular Reflection (Colony is often mucoid and wet)
    float spec1 = distributionGGX(N, H1, u_colonyRoughness);
    float spec2 = distributionGGX(N, H2, u_colonyRoughness * 1.2) * 0.4;
    float f0 = pow((u_agarIOR - 1.0) / (u_agarIOR + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    vec3 litColony = colonyAlbedo * (0.3 + 0.6 * NdotL1 + 0.2 * NdotL2)
                   + sssGlow
                   + vec3(1.0, 0.98, 0.95) * (spec1 + spec2) * (0.3 + 0.7 * fresnel);

    // 5. Final Composition (Agar Halo vs Colony)
    // If agar is highly translucent (e.g., Beta Hemolysis), we simulate backlighting
    vec3 backLight = vec3(1.0, 0.95, 0.9) * 0.7; // Warm light glowing from underneath the petri dish
    vec3 agarDisplay = finalAgarColor + (backLight * currentTranslucency) + (finalAgarColor * currentGlow);

    vec3 finalRGB = mix(agarDisplay, litColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 04
 * ============================================================================
 */
export function bindExopigmentPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: ExopigmentSpeciesPreset
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
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dp"), m.Dp);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Da"), m.Da);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_exopigmentSecretionAlpha"), m.exopigmentSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_exopigmentDecayBeta"), m.exopigmentDecayBeta);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_agarStateShiftRate"), m.agarStateShiftRate);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_agarInitialState"), m.agarInitialState);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_colonyCompactness"), m.colonyCompactness);
  
  const isHemolysis = (preset.haloType === "Beta-Hemolysis" || preset.haloType === "Alpha-Hemolysis") ? 1 : 0;
  gl.uniform1i(gl.getUniformLocation(simProgram, "u_isHemolysis"), isHemolysis);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  
  let haloTypeCode = 0;
  if (preset.haloType === "pH-Indicator") haloTypeCode = 1;
  if (preset.haloType === "Beta-Hemolysis") haloTypeCode = 2;
  if (preset.haloType === "Alpha-Hemolysis") haloTypeCode = 3;

  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_haloType"), haloTypeCode);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_colonyRoughness"), t.colonyRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_colonyElevationScale"), t.colonyElevationScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_colonySubsurfaceScatter"), t.colonySubsurfaceScatter);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_agarBaseTranslucency"), t.agarBaseTranslucency);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_agarIOR"), t.agarIOR);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_haloVolumetricGlow"), t.haloVolumetricGlow);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarBaseColor"), hexToVec3(p.agarBaseHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_colonyBiomassColor"), hexToVec3(p.colonyBiomassHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_pigmentPrimaryColor"), hexToVec3(p.pigmentPrimaryHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_pigmentSecondaryColor"), hexToVec3(p.pigmentSecondaryHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarClearingColor"), hexToVec3(p.agarClearingHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableHaloFlatBands"), p.enableHaloFlatBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_haloFlatBandCount"), p.haloFlatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_haloEdgeSharpness"), p.haloEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_haloWaveFrequency"), p.haloWaveFrequency);
}