/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 01: DENDRITIC, FRACTAL & CHIRAL SWARMERS
 * ============================================================================
 * Biophysical References (Synthesized from Research Notebooks):
 * 1. Kozlovsky, Cohen, Golding & Ben-Jacob (1999), "Lubricating bacteria model
 *    for branching growth of bacterial colonies", Phys. Rev. E 59, 7025.
 * 2. Matsushita et al. (2005), "Colony formation in bacteria: experiments and
 *    modeling" — DLA (Regime A), DBM (Regime B), and "fingernail" active tips.
 * 3. Ben-Jacob et al. (1995/1999), Paenibacillus dendritiformis morphotypes:
 *    Tip-splitting (T-morphotype) vs. Chiral curling branches (C-morphotype).
 * 4. Matsuyama et al. (1989), Serratia marcescens fractal spreading driven by
 *    surface-active exolipids (serrawettin).
 * ============================================================================
 */

export type DendriticSpeciesId =
  | "paenibacillus_t_morphotype"
  | "paenibacillus_c_chiral"
  | "bacillus_subtilis_dla_regime_a"
  | "bacillus_subtilis_dbm_regime_b"
  | "serratia_exolipid_fractal";

export interface DendriticPBRTextureProfile {
  /** 0.0 = matte dry trail, 1.0 = high-gloss wet surfactin coat */
  branchRoughness: number;
  /** Width & refractive visibility of the extracellular lubricating fluid rim ahead of tips */
  surfactinMeniscusStrength: number;
  /** Refractive index of the lubricating fluid film (water/surfactin ~ 1.34 - 1.38) */
  meniscusIOR: number;
  /** Intensity of microscopic aligned bacillar rod bundles along branch flow vectors */
  nematicStreamlineContrast: number;
  /** Aspect ratio of individual bacterial capsules (e.g., 3.5 for short rods, 8.0 for long chiral bacilli) */
  cellAspectRatio: number;
  /** Translucent subsurface scattering radius at the thin "fingernail" active tips */
  tipSubsurfaceScattering: number;
  /** Elevation profile multiplier (flat monolayer vs. raised convex branch ridges) */
  ridgeElevationScale: number;
}

export interface DendriticPsychedelicProfile {
  /** Default hex colors if Kimmy's external LUT is not yet bound */
  agarVoidHex: string;
  surfactinHaloHex: string;
  stationaryTrailHex: string;
  activeFingernailTipHex: string;
  highElevationCrestHex: string;
  /** Injects razor-sharp screen-print flat color bands inside the branches */
  enableFlatColorBands: boolean;
  /** Number of quantized posterization bands across the branch age gradient */
  flatBandCount: number;
  /** 0.0 = soft organic gradient, 1.0 = hard-edge pop-art posterization */
  flatEdgeSharpness: number;
  /** Frequency of psychedelic phase ripples driven by lubricating fluid waves */
  chemicalWaveFrequency: number;
}

export interface DendriticSpeciesPreset {
  id: DendriticSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  bergeyForm: "Filamentous" | "Rhizoid" | "Irregular-Branched";
  bergeyMargin: "Filiform" | "Lobate" | "Curled" | "Dendritic";
  bergeyElevation: "Flat-Monolayer" | "Raised-Tip" | "Convex-Ridge";
  description: string;

  /** Coupled PDE Biophysical Parameters */
  math: {
    /** Base bacterial diffusivity D_b0 (inversely proportional to agar hardness) */
    Db0: number;
    /** Nutrient diffusivity D_n */
    Dn: number;
    /** Lubricating fluid (surfactin) diffusivity D_l */
    Dl: number;
    /** Nonlinear bacterial crowd exponent k in D_b ~ b^k * l^gamma */
    nonlinearCrowdExpK: number;
    /** Nonlinear lubricating fluid exponent gamma */
    lubricantExpGamma: number;
    /** Initial nutrient concentration n_0 (controls branching parameter beta) */
    initialNutrientN0: number;
    /** Maximal cell division rate kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Sporulation / transition from active tip (b) to stationary trail (h) */
    inactivationMu: number;
    /** Chiral torsion angle in radians (0 = symmetric tip-splitting, != 0 = handedness curl) */
    chiralAngleRad: number;
    /** Surfactin / exolipid secretion rate per active bacterium */
    lubricantSecretionAlpha: number;
    /** Surfactin absorption / evaporation rate */
    lubricantDecayBeta: number;
    /** Quenched agar pore heterogeneity amplitude (triggers tip-splitting) */
    agarRoughnessNoise: number;
  };

  texture: DendriticPBRTextureProfile;
  psychedelic: DendriticPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 01)
 * ============================================================================
 */
export const DENDRITIC_SPECIES_PRESETS: Record<DendriticSpeciesId, DendriticSpeciesPreset> = {
  paenibacillus_t_morphotype: {
    id: "paenibacillus_t_morphotype",
    scientificName: "Paenibacillus dendritiformis (T-Morphotype)",
    commonMorphotypeName: "Tip-Splitting Lubricated Dendrite",
    bergeyForm: "Irregular-Branched",
    bergeyMargin: "Dendritic",
    bergeyElevation: "Raised-Tip",
    description:
      "Grown on hard, nutrient-poor peptone agar. Bacteria cannot swim directly on the dry surface; they collectively excrete a lubricating surfactant fluid. A transparent fluid meniscus advances slightly ahead of each branch, while packed rod-shaped cells shove outward and undergo symmetric dichotomous tip-splitting.",
    math: {
      Db0: 0.14,
      Dn: 0.95,
      Dl: 0.32,
      nonlinearCrowdExpK: 1.15,
      lubricantExpGamma: 1.25,
      initialNutrientN0: 0.52,
      growthRateKappa: 0.88,
      nutrientConsumption: 0.72,
      inactivationMu: 0.24,
      chiralAngleRad: 0.0,
      lubricantSecretionAlpha: 0.45,
      lubricantDecayBeta: 0.12,
      agarRoughnessNoise: 0.34,
    },
    texture: {
      branchRoughness: 0.22,
      surfactinMeniscusStrength: 0.92,
      meniscusIOR: 1.36,
      nematicStreamlineContrast: 0.75,
      cellAspectRatio: 4.2,
      tipSubsurfaceScattering: 0.85,
      ridgeElevationScale: 1.15,
    },
    psychedelic: {
      agarVoidHex: "#06040d",
      surfactinHaloHex: "#00f5d4",
      stationaryTrailHex: "#5a189a",
      activeFingernailTipHex: "#ff007f",
      highElevationCrestHex: "#ffbe0b",
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.88,
      chemicalWaveFrequency: 8.0,
    },
  },

  paenibacillus_c_chiral: {
    id: "paenibacillus_c_chiral",
    scientificName: "Paenibacillus dendritiformis (C-Morphotype)",
    commonMorphotypeName: "Chiral Curling Vine Colony",
    bergeyForm: "Rhizoid",
    bergeyMargin: "Curled",
    bergeyElevation: "Flat-Monolayer",
    description:
      "Triggered on semi-dry agar when cells elongate into long filaments (high aspect ratio) and suppress cell division. Flagellar rotation coupled with surface friction breaks mirror symmetry, causing every branch to curl with a uniform handedness like baroque scrollwork.",
    math: {
      Db0: 0.16,
      Dn: 0.90,
      Dl: 0.28,
      nonlinearCrowdExpK: 1.05,
      lubricantExpGamma: 1.10,
      initialNutrientN0: 0.48,
      growthRateKappa: 0.82,
      nutrientConsumption: 0.68,
      inactivationMu: 0.28,
      chiralAngleRad: 0.58, // Strong right-handed chiral flux rotation
      lubricantSecretionAlpha: 0.38,
      lubricantDecayBeta: 0.15,
      agarRoughnessNoise: 0.18,
    },
    texture: {
      branchRoughness: 0.35,
      surfactinMeniscusStrength: 0.65,
      meniscusIOR: 1.35,
      nematicStreamlineContrast: 0.95, // Very long, visible filamentous bundles
      cellAspectRatio: 8.5,
      tipSubsurfaceScattering: 0.70,
      ridgeElevationScale: 0.85,
    },
    psychedelic: {
      agarVoidHex: "#040814",
      surfactinHaloHex: "#3a86ff",
      stationaryTrailHex: "#8338ec",
      activeFingernailTipHex: "#06d6a0",
      highElevationCrestHex: "#ff006e",
      enableFlatColorBands: true,
      flatBandCount: 8,
      flatEdgeSharpness: 0.92,
      chemicalWaveFrequency: 12.0,
    },
  },

  bacillus_subtilis_dla_regime_a: {
    id: "bacillus_subtilis_dla_regime_a",
    scientificName: "Bacillus subtilis OG-01 (Regime A — DLA)",
    commonMorphotypeName: "Diffusion-Limited Aggregation Frost Fractal",
    bergeyForm: "Filamentous",
    bergeyMargin: "Filiform",
    bergeyElevation: "Flat-Monolayer",
    description:
      "Matsushita's Regime A: Very hard agar (1.5% - 2.0%) and severe nutrient starvation. Non-motile cells only divide where diffusing nutrients reach protruding tips, screening interiorfjords and producing a true Witten-Sander fractal with Hausdorff dimension D_f ~ 1.71.",
    math: {
      Db0: 0.08,
      Dn: 1.15,
      Dl: 0.12,
      nonlinearCrowdExpK: 1.45,
      lubricantExpGamma: 0.50,
      initialNutrientN0: 0.32, // Low nutrient triggers severe screening instability
      growthRateKappa: 0.74,
      nutrientConsumption: 0.85,
      inactivationMu: 0.31,
      chiralAngleRad: 0.0,
      lubricantSecretionAlpha: 0.18,
      lubricantDecayBeta: 0.20,
      agarRoughnessNoise: 0.48,
    },
    texture: {
      branchRoughness: 0.58, // Granular, dry crusty interior branches
      surfactinMeniscusStrength: 0.25,
      meniscusIOR: 1.34,
      nematicStreamlineContrast: 0.60,
      cellAspectRatio: 3.2,
      tipSubsurfaceScattering: 0.95,
      ridgeElevationScale: 0.95,
    },
    psychedelic: {
      agarVoidHex: "#08020f",
      surfactinHaloHex: "#7209b7",
      stationaryTrailHex: "#3f37c9",
      activeFingernailTipHex: "#4cc9f0",
      highElevationCrestHex: "#f72585",
      enableFlatColorBands: false, // Smooth electric plasma gradient on fractal tips
      flatBandCount: 5,
      flatEdgeSharpness: 0.50,
      chemicalWaveFrequency: 6.0,
    },
  },

  bacillus_subtilis_dbm_regime_b: {
    id: "bacillus_subtilis_dbm_regime_b",
    scientificName: "Bacillus subtilis (Regime B — DBM)",
    commonMorphotypeName: "Dense Branching Morphology with Fingernail Tips",
    bergeyForm: "Irregular-Branched",
    bergeyMargin: "Lobate",
    bergeyElevation: "Convex-Ridge",
    description:
      "Matsushita's Regime B: Hard agar but abundant nutrients. Branches pack densely at a characteristic wavelength, and active motile bacteria accumulate at the very ends of the radial fingers, forming glowing crescent 'fingernail' structures.",
    math: {
      Db0: 0.18,
      Dn: 0.80,
      Dl: 0.40,
      nonlinearCrowdExpK: 1.00,
      lubricantExpGamma: 1.00,
      initialNutrientN0: 0.85, // High nutrient -> dense array of radial fingers
      growthRateKappa: 1.05,
      nutrientConsumption: 0.55,
      inactivationMu: 0.22,
      chiralAngleRad: 0.0,
      lubricantSecretionAlpha: 0.52,
      lubricantDecayBeta: 0.10,
      agarRoughnessNoise: 0.28,
    },
    texture: {
      branchRoughness: 0.16, // Very wet, glistening mucoid fingers
      surfactinMeniscusStrength: 1.00,
      meniscusIOR: 1.38,
      nematicStreamlineContrast: 0.70,
      cellAspectRatio: 3.8,
      tipSubsurfaceScattering: 1.00, // Intense glowing fingernail tips
      ridgeElevationScale: 1.45,
    },
    psychedelic: {
      agarVoidHex: "#0b090a",
      surfactinHaloHex: "#ff9f1c",
      stationaryTrailHex: "#e71d36",
      activeFingernailTipHex: "#2ec4b6",
      highElevationCrestHex: "#fdfffc",
      enableFlatColorBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.90,
      chemicalWaveFrequency: 10.0,
    },
  },

  serratia_exolipid_fractal: {
    id: "serratia_exolipid_fractal",
    scientificName: "Serratia marcescens (Exolipid Fractal Strain)",
    commonMorphotypeName: "Prodigiosin Crimson Surfactant Coral",
    bergeyForm: "Irregular-Branched",
    bergeyMargin: "Lobate",
    bergeyElevation: "Convex-Ridge",
    description:
      "Produces both water-insoluble crimson prodigiosin pigment and extracellular wetting agents (serrawettin W1). Forms fleshy, coral-like lobate dendrites with deep red internal subsurface scattering and a clear, wide surfactant wetting rim.",
    math: {
      Db0: 0.21,
      Dn: 0.88,
      Dl: 0.55, // Rapidly spreading serrawettin surfactant halo
      nonlinearCrowdExpK: 0.95,
      lubricantExpGamma: 1.35,
      initialNutrientN0: 0.72,
      growthRateKappa: 0.96,
      nutrientConsumption: 0.62,
      inactivationMu: 0.19,
      chiralAngleRad: 0.08, // Subtle organic asymmetry
      lubricantSecretionAlpha: 0.65,
      lubricantDecayBeta: 0.08,
      agarRoughnessNoise: 0.30,
    },
    texture: {
      branchRoughness: 0.12, // Ultra-glossy butyrous/mucoid crimson coral
      surfactinMeniscusStrength: 1.15,
      meniscusIOR: 1.39,
      nematicStreamlineContrast: 0.45,
      cellAspectRatio: 2.4, // Short Coccobacilli rods
      tipSubsurfaceScattering: 0.90,
      ridgeElevationScale: 1.65,
    },
    psychedelic: {
      agarVoidHex: "#090004",
      surfactinHaloHex: "#ff0055",
      stationaryTrailHex: "#800020",
      activeFingernailTipHex: "#ff0a54",
      highElevationCrestHex: "#ffccd5",
      enableFlatColorBands: true,
      flatBandCount: 4,
      flatEdgeSharpness: 0.85,
      chemicalWaveFrequency: 7.5,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (BEN-JACOB LUBRICATING FLUID + CHIRAL TORSION PDE)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active motile bacterial density at branch tips ("fingernails")
 *   G (n) = Agar nutrient concentration
 *   B (l) = Extracellular lubricating fluid height (surfactin / serrawettin)
 *   A (h) = Stationary / sporulated trail biomass & 3D branch elevation
 */
export const DENDRITIC_CHIRAL_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;

// Coupled PDE Uniforms (from DendriticSpeciesPreset.math)
uniform float u_Db0;
uniform float u_Dn;
uniform float u_Dl;
uniform float u_nonlinearCrowdExpK;
uniform float u_lubricantExpGamma;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_inactivationMu;
uniform float u_chiralAngleRad;
uniform float u_lubricantSecretionAlpha;
uniform float u_lubricantDecayBeta;
uniform float u_agarRoughnessNoise;

// Quenched spatial hash for microscopic agar gel pore heterogeneity
float agarPoreHash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// Multi-scale quenched agar substrate resistance
float sampleAgarSubstrate(vec2 uv) {
    vec2 gridFine = floor(uv * u_resolution * 0.65);
    vec2 gridCoarse = floor(uv * u_resolution * 0.18);
    float n1 = agarPoreHash(gridFine);
    float n2 = agarPoreHash(gridCoarse);
    return 1.0 + u_agarRoughnessNoise * ((0.65 * n1 + 0.35 * n2) - 0.5) * 2.0;
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Active bacteria
    float n = center.g; // Nutrient
    float l = center.b; // Lubricating fluid (surfactin)
    float h = center.a; // Inactive stationary biomass / elevation

    // 9-point isotropic stencil for Laplacian & central differences
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
    vec2 gradL = 0.5 * vec2(E.b - W.b, N.b - S.b);
    vec2 gradH = 0.5 * vec2(E.a - W.a, N.a - S.a);

    // 1. Kozlovsky & Ben-Jacob Lubricating Fluid Nonlinear Diffusivity
    // Bacteria can only shove outward where lubricating fluid l and crowd density b exist
    float agarFactor = sampleAgarSubstrate(v_uv);
    float crowdTerm = pow(max(b, 0.0001), u_nonlinearCrowdExpK);
    float lubeTerm  = pow(max(l, 0.0005), u_lubricantExpGamma);
    float Db_eff    = u_Db0 * crowdTerm * lubeTerm * agarFactor;

    // 2. Chiral Torsion Tensor (Paenibacillus dendritiformis C-morphotype)
    // Rotates the bacterial flux vector relative to the advancing colony boundary normal
    float cosTheta = cos(u_chiralAngleRad);
    float sinTheta = sin(u_chiralAngleRad);
    mat2 chiralRot = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);
    vec2 chiralFlux = chiralRot * gradB;
    vec2 colonyNormal = normalize(gradH + gradL + vec2(1e-5));
    float chiralCurlTerm = sinTheta * dot(chiralFlux, vec2(-colonyNormal.y, colonyNormal.x)) * 1.35;

    // 3. Nonlinear Lubricating Fluid Diffusion: Dl_eff = Dl * l^0.5
    float Dl_eff = u_Dl * sqrt(max(l, 0.001));

    // 4. Michaelis-Menten Nutrient Uptake & "Fingernail" Tip Division
    float f_n = n / (0.14 + n);
    float division = u_growthRateKappa * b * f_n;

    // Cells transition to stationary trail (h) as nutrient depletes behind the tip
    float sporulation = u_inactivationMu * b / (1.0 + 4.0 * n);

    // 5. Time integration of the 4 coupled fields
    float db = (Db_eff * lap.r) + dot(gradB, gradL) * u_Db0 + chiralCurlTerm + division - sporulation;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float dl = (Dl_eff * lap.b) + (u_lubricantSecretionAlpha * b * f_n) - (u_lubricantDecayBeta * l);
    float dh = sporulation + 0.025 * lap.a + 0.15 * dot(gradH, gradH);

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 1.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(l + u_dt * dl, 0.0, 1.5),
        clamp(h + u_dt * dh, 0.0, 2.5)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 01)
 * ============================================================================
 * Visualizes:
 * - The transparent, refractive Surfactin Meniscus Halo ahead of each branch tip
 * - Microscopic Nematic Bacterial Rod Bundles aligned with the branch growth vector
 * - Glowing "Fingernail" Active Tips (Matsushita Regime B)
 * - Kimmy's swappable LUT + anti-aliased Flat-Color Screen-Print Posterization
 */
export const DENDRITIC_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Active (b), G: Nutrient (n), B: Lubricant (l), A: Trail (h)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform float u_branchRoughness;
uniform float u_surfactinMeniscusStrength;
uniform float u_meniscusIOR;
uniform float u_nematicStreamlineContrast;
uniform float u_cellAspectRatio;
uniform float u_tipSubsurfaceScattering;
uniform float u_ridgeElevationScale;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarVoidColor;
uniform vec3 u_surfactinHaloColor;
uniform vec3 u_stationaryTrailColor;
uniform vec3 u_activeFingernailTipColor;
uniform vec3 u_highElevationCrestColor;
uniform bool u_enableFlatColorBands;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform float u_chemicalWaveFrequency;

// Anisotropic micro-texture: simulates tightly packed rod-shaped bacilli (nematic streams)
float nematicBacilliTexture(vec2 uv, vec2 growthTangent, float aspectRatio) {
    vec2 p = uv * u_resolution * 0.45;
    vec2 dir = normalize(growthTangent + vec2(1e-5));
    // Rotate coordinate frame to align with bacterial rod orientation
    vec2 alignedP = vec2(
        dot(p, dir),
        dot(p, vec2(-dir.y, dir.x)) * aspectRatio
    );
    float primaryStream = sin(alignedP.y * 2.4 + sin(alignedP.x * 0.8) * 1.5);
    float cellSepta = sin(alignedP.x * 3.1 + cos(alignedP.y * 1.7));
    return 0.5 + 0.5 * (0.75 * primaryStream + 0.25 * cellSepta);
}

// GGX Microfacet Specular Distribution for wet mucoid/surfactin highlights
float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    return a2 / max(3.14159265 * denom * denom, 1e-5);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 s  = texture(u_stateTex, v_uv);
    float b = s.r; // Active fingernail tip density
    float n = s.g; // Remaining nutrient
    float l = s.b; // Lubricating fluid film
    float h = s.a; // Stationary branch elevation

    // 1. Sample neighborhood to reconstruct 3D topography & lubricating meniscus gradients
    vec4 sE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0));
    vec4 sW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0));
    vec4 sN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y));
    vec4 sS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y));

    float heightCenter = (h * 0.75 + b * 0.55) * u_ridgeElevationScale;
    float heightE = (sE.a * 0.75 + sE.r * 0.55) * u_ridgeElevationScale;
    float heightW = (sW.a * 0.75 + sW.r * 0.55) * u_ridgeElevationScale;
    float heightN = (sN.a * 0.75 + sN.r * 0.55) * u_ridgeElevationScale;
    float heightS = (sS.a * 0.75 + sS.r * 0.55) * u_ridgeElevationScale;

    vec2 gradColony = vec2(heightE - heightW, heightN - heightS) * 16.0;
    vec2 gradLube   = vec2(sE.b - sW.b, sN.b - sS.b) * 12.0;

    // 2. Nematic Bacterial Rod Micro-Detail (aligned perpendicular to branch gradient)
    vec2 branchTangent = vec2(-gradColony.y, gradColony.x);
    float microRods = nematicBacilliTexture(v_uv, branchTangent, u_cellAspectRatio);
    float biomassMask = smoothstep(0.015, 0.06, b + h);

    // Combine macro colony elevation normal, micro-rod normal, and outer surfactin meniscus normal
    vec2 combinedSlope = gradColony
                       + gradLube * u_surfactinMeniscusStrength * (1.0 - biomassMask)
                       + (microRods - 0.5) * u_nematicStreamlineContrast * biomassMask * vec2(1.2, 1.2);
    vec3 N = normalize(vec3(-combinedSlope, 1.0));

    // 3. Compute Chromatic Phase Index for Psychedelic / Flat-Color Mapping
    float chemicalRipple = 0.08 * sin(l * u_chemicalWaveFrequency - u_time * 1.5);
    float rawColorCoord = clamp(h * 0.42 + b * 0.82 + chemicalRipple, 0.0, 1.0);

    // Anti-aliased Flat-Color Posterization (Screen-Print Pop-Art Mode)
    float colorCoord = rawColorCoord;
    if (u_enableFlatColorBands) {
        float scaled = rawColorCoord * u_flatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.25, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_flatBandCount;
        colorCoord = mix(rawColorCoord, stepped, u_flatEdgeSharpness);
    }

    // 4. Resolve Base Colony Albedo (either from Kimmy's 1D LUT or built-in 4-stop ramp)
    vec3 colonyAlbedo;
    if (u_useKimmyLut) {
        colonyAlbedo = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        vec3 baseGrad = mix(u_stationaryTrailColor, u_activeFingernailTipColor, clamp(colorCoord * 1.5, 0.0, 1.0));
        colonyAlbedo = mix(baseGrad, u_highElevationCrestColor, smoothstep(0.65, 0.98, colorCoord));
    }

    // Inject extra neon punch into Matsushita's "Fingernail" Active Tips (high b, low h)
    float fingernailMask = clamp(b * 1.6 * (1.0 - 0.5 * clamp(h, 0.0, 1.0)), 0.0, 1.0);
    colonyAlbedo = mix(colonyAlbedo, u_activeFingernailTipColor * 1.25, fingernailMask * 0.55);

    // 5. PBR Lighting: Dual Directional Lights + Subsurface Scattering + Surfactin Clearcoat
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(cos(u_time * 0.25) * 0.55, sin(u_time * 0.25) * 0.55, 0.78));
    vec3 L2 = normalize(vec3(-0.6, 0.45, 0.65));
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, V), 0.0);

    // Subsurface Scattering (SSS) through translucent active branch tips
    float sssWrap = max(0.0, (dot(N, L1) + 0.55) / 1.55);
    float thinness = exp(-heightCenter * 1.8);
    vec3 sssContribution = colonyAlbedo * sssWrap * thinness * u_tipSubsurfaceScattering * (0.5 + 1.1 * fingernailMask);

    // Spatially varying roughness: active tips & surfactin meniscus are wetter/glossier than old interior trails
    float localRoughness = mix(u_branchRoughness * 1.35, max(0.05, u_branchRoughness * 0.35), fingernailMask);
    float spec1 = distributionGGX(N, H1, localRoughness);
    float spec2 = distributionGGX(N, H2, localRoughness * 1.2) * 0.35;

    // Schlick Fresnel from Surfactin IOR (n_fluid ~ 1.36)
    float f0 = pow((u_meniscusIOR - 1.0) / (u_meniscusIOR + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    vec3 litColony = colonyAlbedo * (0.25 + 0.65 * NdotL1 + 0.25 * NdotL2)
                   + sssContribution
                   + vec3(1.0, 0.98, 0.95) * (spec1 + spec2) * (0.25 + 0.75 * fresnel);

    // 6. Render the Extracellular Surfactin Meniscus Halo on the surrounding Agar
    // Visible where lubricating fluid l extends ahead of the bacterial body (b + h)
    float meniscusZone = clamp(l * 1.8, 0.0, 1.0) * (1.0 - biomassMask);
    float meniscusEdgeSpec = distributionGGX(N, H1, 0.08) * meniscusZone * u_surfactinMeniscusStrength;
    vec3 agarSurface = mix(
        u_agarVoidColor,
        u_surfactinHaloColor * 0.65,
        pow(meniscusZone, 1.4) * u_surfactinMeniscusStrength
    ) + vec3(0.85, 0.98, 1.0) * meniscusEdgeSpec * 0.45;

    vec3 finalRGB = mix(agarSurface, litColony, biomassMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 01
 * ============================================================================
 */
export function bindDendriticPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: DendriticSpeciesPreset
): void {
  const hexToVec3 = (hex: string): [number, number, number] => {
    const clean = hex.replace("#", "");
    const n = parseInt(clean, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  // Bind PDE Simulation Uniforms
  gl.useProgram(simProgram);
  const m = preset.math;
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Db0"), m.Db0);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dn"), m.Dn);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dl"), m.Dl);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nonlinearCrowdExpK"), m.nonlinearCrowdExpK);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_lubricantExpGamma"), m.lubricantExpGamma);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_inactivationMu"), m.inactivationMu);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_chiralAngleRad"), m.chiralAngleRad);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_lubricantSecretionAlpha"), m.lubricantSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_lubricantDecayBeta"), m.lubricantDecayBeta);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_agarRoughnessNoise"), m.agarRoughnessNoise);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_branchRoughness"), t.branchRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_surfactinMeniscusStrength"), t.surfactinMeniscusStrength);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_meniscusIOR"), t.meniscusIOR);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_nematicStreamlineContrast"), t.nematicStreamlineContrast);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_cellAspectRatio"), t.cellAspectRatio);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_tipSubsurfaceScattering"), t.tipSubsurfaceScattering);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_ridgeElevationScale"), t.ridgeElevationScale);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarVoidColor"), hexToVec3(p.agarVoidHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_surfactinHaloColor"), hexToVec3(p.surfactinHaloHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_stationaryTrailColor"), hexToVec3(p.stationaryTrailHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_activeFingernailTipColor"), hexToVec3(p.activeFingernailTipHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_highElevationCrestColor"), hexToVec3(p.highElevationCrestHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableFlatColorBands"), p.enableFlatColorBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatBandCount"), p.flatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatEdgeSharpness"), p.flatEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_chemicalWaveFrequency"), p.chemicalWaveFrequency);
}