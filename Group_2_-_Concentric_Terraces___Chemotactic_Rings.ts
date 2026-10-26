/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 02: CONCENTRIC TERRACES & CHEMOTACTIC RINGS
 * ============================================================================
 * Biophysical References (Synthesized from Research Notebooks):
 * 1. Esipov & Shapiro (1998) / Ayati (2006) / Czirók, Matsushita & Vicsek (2001):
 *    "Kinetic model of Proteus mirabilis swarm colony development" — Periodic
 *    alternation between hyper-flagellated multinucleated swarmer rafts and
 *    stationary consolidation phases, building 3D "wedding-cake" terraces.
 * 2. Lacasta et al. (1999) / Wakita et al. (2001) / Shimada et al. (2004):
 *    Bacillus subtilis Regime C concentric rings via hysteretic motility
 *    switching between thresholds W_min and W_max:
 *    T = D_0 (W_max - W_min) * [1 / (lambda - D_0*c_s) - 1 / (lambda - D_0*c_g)]
 * 3. Budrene & Berg (1991, 1995) / Woodward, Tyson, Murray, Budrene & Berg (1995):
 *    Escherichia coli and Salmonella typhimurium symmetrical chemotactic rings,
 *    radial spokes, and crystalline spot lattices via Keller-Segel aspartate
 *    chemotaxis.
 * 4. Livne, Koler, Vaknin & Agam (2024, 2025):
 *    Pattern formation in E. coli through chemotactic instability, collective
 *    condensation, and droplet merging in acidic environments.
 * ============================================================================
 */

export type ConcentricSpeciesId =
  | "proteus_mirabilis_terraces"
  | "bacillus_subtilis_regime_c"
  | "ecoli_budrene_berg_lattice"
  | "salmonella_typhimurium_spokes"
  | "ecoli_acidic_condensation";

export interface ConcentricPBRTextureProfile {
  /** 0.0 = ultra-slick wet swarming slime, 1.0 = matte consolidated interior */
  terraceRoughness: number;
  /** Sharpness of the vertical step cliff at each consolidation ring boundary */
  terraceStepSharpness: number;
  /** Number of quantized 3D "wedding-cake" elevation ledges */
  terraceLedgeQuantization: number;
  /** Visibility of swirling multinucleated swarmer rafts along the active ring */
  swarmerRaftSwirlContrast: number;
  /** Refractive dome lensing of chemotactic cell aggregates (pearls/spots) */
  aggregateLensIOR: number;
  /** Subsurface scattering glow inside dense chemotactic rings and spots */
  ringSubsurfaceScattering: number;
  /** Macroscopic 3D height multiplier for terraces and chemotactic pearls */
  elevationScale: number;
}

export interface ConcentricPsychedelicProfile {
  agarVoidHex: string;
  chemoattractantCloudHex: string;
  consolidatedTerraceHex: string;
  activeSwarmRingHex: string;
  chemotacticPearlCrestHex: string;
  /** Enables hard-edge screen-printed concentric target rings */
  enableFlatColorBands: boolean;
  /** Number of posterized color bands across the terrace/ring profile */
  flatBandCount: number;
  /** 0.0 = smooth gradient, 1.0 = razor-sharp pop-art bull's-eye bands */
  flatEdgeSharpness: number;
  /** Radial frequency of psychedelic phase rings driven by chemical waves */
  ringPhaseFrequency: number;
}

export interface ConcentricSpeciesPreset {
  id: ConcentricSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  bergeyForm: "Circular-Terraced" | "Concentric-Target" | "Symmetrical-Punctate";
  bergeyMargin: "Entire-Stepped" | "Undulate-Ringed" | "Beaded-Chemotactic";
  bergeyElevation: "Terraced-Tiered" | "Raised-Rings" | "Convex-Pearls";
  description: string;

  /** Coupled PDE Biophysical Parameters (Hysteretic Swarming + Keller-Segel Chemotaxis) */
  math: {
    /** Base swimming diffusivity D_swim (low motility phase) */
    Dswim: number;
    /** Cooperative swarming diffusivity D_swarm (hyper-flagellated raft phase) */
    Dswarm: number;
    /** Nutrient diffusivity D_n */
    Dn: number;
    /** Chemoattractant (aspartate / succinate) diffusivity D_c */
    Dc: number;
    /** Upper biomass threshold W_max that triggers breakout into rapid swarming */
    hysteresisWmax: number;
    /** Lower biomass threshold W_min where swarming stalls into consolidation */
    hysteresisWmin: number;
    /** Frequency of the internal swarmer-to-consolidator differentiation clock */
    consolidationClockFreq: number;
    /** Keller-Segel chemotactic sensitivity chi_0 */
    chemotaxisChi: number;
    /** Chemoattractant receptor saturation constant K_c (controls spot splitting) */
    receptorSaturationKc: number;
    /** Chemoattractant secretion rate alpha_c per active cell */
    chemoSecretionAlpha: number;
    /** Chemoattractant degradation rate beta_c */
    chemoDecayBeta: number;
    /** Maximal cell division rate kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Transition rate mu from motile swarmer (b) to terraced biofilm step (h) */
    terraceConsolidationMu: number;
  };

  texture: ConcentricPBRTextureProfile;
  psychedelic: ConcentricPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 02)
 * ============================================================================
 */
export const CONCENTRIC_SPECIES_PRESETS: Record<ConcentricSpeciesId, ConcentricSpeciesPreset> = {
  proteus_mirabilis_terraces: {
    id: "proteus_mirabilis_terraces",
    scientificName: "Proteus mirabilis (Swarmer-Consolidator Cycle)",
    commonMorphotypeName: "Bull's-Eye Wedding-Cake Terraces",
    bergeyForm: "Circular-Terraced",
    bergeyMargin: "Entire-Stepped",
    bergeyElevation: "Terraced-Tiered",
    description:
      "Famous for its clockwise/counter-clockwise bull's-eye terraces. Vegetative swimmer rods differentiate into giant, multinucleated, hyper-flagellated swarmer cells (20-80 um) that surge outward in wet viscoelastic rafts, then abruptly dedifferentiate and consolidate into raised architectural steps.",
    math: {
      Dswim: 0.04,
      Dswarm: 0.62,
      Dn: 0.75,
      Dc: 0.35,
      hysteresisWmax: 0.68,
      hysteresisWmin: 0.22,
      consolidationClockFreq: 5.5,
      chemotaxisChi: 0.08,
      receptorSaturationKc: 0.45,
      chemoSecretionAlpha: 0.25,
      chemoDecayBeta: 0.12,
      growthRateKappa: 0.92,
      nutrientConsumption: 0.58,
      terraceConsolidationMu: 0.34,
    },
    texture: {
      terraceRoughness: 0.18,
      terraceStepSharpness: 0.92, // Razor-sharp stepped cliff ledges
      terraceLedgeQuantization: 8.0,
      swarmerRaftSwirlContrast: 0.88,
      aggregateLensIOR: 1.37,
      ringSubsurfaceScattering: 0.75,
      elevationScale: 1.55,
    },
    psychedelic: {
      agarVoidHex: "#050712",
      chemoattractantCloudHex: "#00bbf9",
      consolidatedTerraceHex: "#5f0f40",
      activeSwarmRingHex: "#fb5607",
      chemotacticPearlCrestHex: "#ffbe0b",
      enableFlatColorBands: true,
      flatBandCount: 7,
      flatEdgeSharpness: 0.94,
      ringPhaseFrequency: 14.0,
    },
  },

  bacillus_subtilis_regime_c: {
    id: "bacillus_subtilis_regime_c",
    scientificName: "Bacillus subtilis (Regime C — Hysteretic Rings)",
    commonMorphotypeName: "Periodic Swarm & Rest Concentric Waves",
    bergeyForm: "Concentric-Target",
    bergeyMargin: "Undulate-Ringed",
    bergeyElevation: "Raised-Rings",
    description:
      "Matsushita & Lacasta's Regime C on soft-to-intermediate agar (0.6% - 0.8%). Colony expansion alternates rhythmically between a high-density cooperative migration phase and a stationary cell-division build-up phase, engraving wide concentric target rings.",
    math: {
      Dswim: 0.07,
      Dswarm: 0.54,
      Dn: 0.88,
      Dc: 0.42,
      hysteresisWmax: 0.60,
      hysteresisWmin: 0.18,
      consolidationClockFreq: 4.2,
      chemotaxisChi: 0.14,
      receptorSaturationKc: 0.50,
      chemoSecretionAlpha: 0.30,
      chemoDecayBeta: 0.14,
      growthRateKappa: 0.86,
      nutrientConsumption: 0.52,
      terraceConsolidationMu: 0.27,
    },
    texture: {
      terraceRoughness: 0.26,
      terraceStepSharpness: 0.65, // Softer, rolling wave ridges
      terraceLedgeQuantization: 5.0,
      swarmerRaftSwirlContrast: 0.72,
      aggregateLensIOR: 1.36,
      ringSubsurfaceScattering: 0.88,
      elevationScale: 1.25,
    },
    psychedelic: {
      agarVoidHex: "#07020d",
      chemoattractantCloudHex: "#7209b7",
      consolidatedTerraceHex: "#3a0ca3",
      activeSwarmRingHex: "#f72585",
      chemotacticPearlCrestHex: "#4cc9f0",
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.86,
      ringPhaseFrequency: 11.0,
    },
  },

  ecoli_budrene_berg_lattice: {
    id: "ecoli_budrene_berg_lattice",
    scientificName: "Escherichia coli (Budrene-Berg Chemotactic Strain)",
    commonMorphotypeName: "Symmetrical Sunflower & Pearl Spot Lattice",
    bergeyForm: "Symmetrical-Punctate",
    bergeyMargin: "Beaded-Chemotactic",
    bergeyElevation: "Convex-Pearls",
    description:
      "Discovered by Elena Budrene and Howard Berg (Nature 1991, 1995). Swimming cells metabolize succinate and excrete aspartate, a potent chemoattractant. Expanding chemotactic rings destabilize via Keller-Segel self-attraction into breathtaking geometric lattices of high-density bacterial pearls.",
    math: {
      Dswim: 0.19,
      Dswarm: 0.32,
      Dn: 0.95,
      Dc: 0.48,
      hysteresisWmax: 0.52,
      hysteresisWmin: 0.25,
      consolidationClockFreq: 6.8,
      chemotaxisChi: 0.92, // Strong Keller-Segel aggregation breaks rings into spots
      receptorSaturationKc: 0.28,
      chemoSecretionAlpha: 0.68,
      chemoDecayBeta: 0.22,
      growthRateKappa: 0.80,
      nutrientConsumption: 0.64,
      terraceConsolidationMu: 0.24,
    },
    texture: {
      terraceRoughness: 0.12, // Glistening, lens-like micro-beads
      terraceStepSharpness: 0.45,
      terraceLedgeQuantization: 4.0,
      swarmerRaftSwirlContrast: 0.40,
      aggregateLensIOR: 1.40, // Strong refractive lensing on each chemotactic spot
      ringSubsurfaceScattering: 0.96,
      elevationScale: 1.40,
    },
    psychedelic: {
      agarVoidHex: "#020b14",
      chemoattractantCloudHex: "#00f5d4",
      consolidatedTerraceHex: "#0077b6",
      activeSwarmRingHex: "#00bbf9",
      chemotacticPearlCrestHex: "#fee440",
      enableFlatColorBands: false, // Luminous glowing gradients on each pearl
      flatBandCount: 5,
      flatEdgeSharpness: 0.70,
      ringPhaseFrequency: 16.0,
    },
  },

  salmonella_typhimurium_spokes: {
    id: "salmonella_typhimurium_spokes",
    scientificName: "Salmonella enterica sv. Typhimurium",
    commonMorphotypeName: "Chemotactic Mandala Rings & Radial Spokes",
    bergeyForm: "Symmetrical-Punctate",
    bergeyMargin: "Beaded-Chemotactic",
    bergeyElevation: "Convex-Pearls",
    description:
      "Modeled by Woodward, Tyson, Murray, Budrene & Berg (1995). Combines radial chemotactic ring propagation with azimuthal symmetry breaking, forming perforated rings and radial spoke lines that resemble a glowing stained-glass cathedral rose window.",
    math: {
      Dswim: 0.16,
      Dswarm: 0.38,
      Dn: 0.92,
      Dc: 0.52,
      hysteresisWmax: 0.56,
      hysteresisWmin: 0.20,
      consolidationClockFreq: 5.8,
      chemotaxisChi: 0.78,
      receptorSaturationKc: 0.34,
      chemoSecretionAlpha: 0.60,
      chemoDecayBeta: 0.18,
      growthRateKappa: 0.84,
      nutrientConsumption: 0.60,
      terraceConsolidationMu: 0.22,
    },
    texture: {
      terraceRoughness: 0.15,
      terraceStepSharpness: 0.58,
      terraceLedgeQuantization: 6.0,
      swarmerRaftSwirlContrast: 0.55,
      aggregateLensIOR: 1.39,
      ringSubsurfaceScattering: 0.92,
      elevationScale: 1.35,
    },
    psychedelic: {
      agarVoidHex: "#09010f",
      chemoattractantCloudHex: "#9b5de5",
      consolidatedTerraceHex: "#f15bb5",
      activeSwarmRingHex: "#00bbf9",
      chemotacticPearlCrestHex: "#00f5d4",
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.88,
      ringPhaseFrequency: 15.0,
    },
  },

  ecoli_acidic_condensation: {
    id: "ecoli_acidic_condensation",
    scientificName: "Escherichia coli (Livne-Vaknin Acidic Auto-Aggregation)",
    commonMorphotypeName: "Coarsening Chemotactic Droplet Condensates",
    bergeyForm: "Symmetrical-Punctate",
    bergeyMargin: "Beaded-Chemotactic",
    bergeyElevation: "Convex-Pearls",
    description:
      "Based on Livne, Koler, Vaknin & Agam (2024/2025). In uniform acidic environments, opposing pH taxis and self-attraction cause bacterial lawns to undergo spinodal-like phase separation—condensing into dense, liquid-like bacterial droplets that drift and merge.",
    math: {
      Dswim: 0.22,
      Dswarm: 0.28,
      Dn: 1.00,
      Dc: 0.60,
      hysteresisWmax: 0.48,
      hysteresisWmin: 0.26,
      consolidationClockFreq: 3.5,
      chemotaxisChi: 1.05, // Very high self-condensation instability
      receptorSaturationKc: 0.24,
      chemoSecretionAlpha: 0.75,
      chemoDecayBeta: 0.25,
      growthRateKappa: 0.76,
      nutrientConsumption: 0.48,
      terraceConsolidationMu: 0.18,
    },
    texture: {
      terraceRoughness: 0.10, // Liquid-like glossy bacterial droplets
      terraceStepSharpness: 0.38,
      terraceLedgeQuantization: 3.0,
      swarmerRaftSwirlContrast: 0.50,
      aggregateLensIOR: 1.41,
      ringSubsurfaceScattering: 1.00,
      elevationScale: 1.50,
    },
    psychedelic: {
      agarVoidHex: "#060805",
      chemoattractantCloudHex: "#38b000",
      consolidatedTerraceHex: "#006400",
      activeSwarmRingHex: "#70e000",
      chemotacticPearlCrestHex: "#ccff33",
      enableFlatColorBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.82,
      ringPhaseFrequency: 9.5,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (HYSTERETIC SWARMING + KELLER-SEGEL CHEMOTAXIS)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active swimming / swarming cell density
 *   G (n) = Nutrient substrate concentration
 *   B (c) = Self-secreted Chemoattractant (aspartate) & Swarming Phase Coordinator
 *   A (h) = Consolidated 3D Terrace Biomass / Chemotactic Pearl Elevation
 */
export const CONCENTRIC_CHEMOTACTIC_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;
uniform float u_time;

// Coupled PDE Uniforms (from ConcentricSpeciesPreset.math)
uniform float u_Dswim;
uniform float u_Dswarm;
uniform float u_Dn;
uniform float u_Dc;
uniform float u_hysteresisWmax;
uniform float u_hysteresisWmin;
uniform float u_consolidationClockFreq;
uniform float u_chemotaxisChi;
uniform float u_receptorSaturationKc;
uniform float u_chemoSecretionAlpha;
uniform float u_chemoDecayBeta;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_terraceConsolidationMu;

// Subtle spatial noise to seed azimuthal spot symmetry-breaking (Budrene-Berg instability)
float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Motile bacteria
    float n = center.g; // Nutrient
    float c = center.b; // Aspartate chemoattractant concentration
    float h = center.a; // Consolidated terrace height

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
    vec2 gradC = 0.5 * vec2(E.b - W.b, N.b - S.b);

    // 1. Lacasta / Esipov-Shapiro Hysteretic Swarming Switch
    // Combines local biomass accumulation with an internal differentiation phase wave
    float radialDist = length(v_uv - vec2(0.5)) * 2.0;
    float clockWave = 0.5 + 0.5 * sin(u_time * u_consolidationClockFreq - radialDist * 18.0);
    float effectiveCrowd = b + 0.35 * c * clockWave;
    float swarmGate = smoothstep(u_hysteresisWmin, u_hysteresisWmax, effectiveCrowd);

    // Effective diffusivity jumps from D_swim to D_swarm during the swarming raft phase
    float Db_eff = mix(u_Dswim, u_Dswarm, swarmGate) * clamp(n + 0.1, 0.0, 1.0);

    // 2. Keller-Segel Chemotaxis with Receptor Saturation (Budrene-Berg & Woodward-Murray)
    // Receptor law: chi(b, c) = chi_0 * b * (1 - b/1.35) / (K_c + c)^2
    float receptorFactor = 1.0 / pow(u_receptorSaturationKc + c, 2.0);
    float logisticCap = clamp(1.0 - b / 1.35, 0.0, 1.0);
    float chiEffective = u_chemotaxisChi * receptorFactor * logisticCap;

    // Divergence of chemotactic flux: div(chi(b,c) * b * grad(c))
    float chemotacticAdvection = chiEffective * (b * lap.b + dot(gradB, gradC));

    // 3. Nutrient Uptake & Swarmer-to-Consolidator Terrace Deposition
    float microPerturb = 0.96 + 0.08 * hash21(floor(v_uv * u_resolution * 0.75));
    float f_n = (n / (0.15 + n)) * microPerturb;
    float division = u_growthRateKappa * b * f_n;

    // Consolidation peaks when swarmers decelerate (1.0 - swarmGate) or nutrient drops
    float consolidation = u_terraceConsolidationMu * b * (1.25 - 0.85 * swarmGate) / (1.0 + 2.5 * n);

    // 4. Time Integration of Coupled Fields
    float db = (Db_eff * lap.r) - chemotacticAdvection + division - consolidation;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float dc = (u_Dc * lap.b) + (u_chemoSecretionAlpha * b * (0.4 + 0.6 * f_n)) - (u_chemoDecayBeta * c);
    float dh = consolidation + 0.015 * lap.a;

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 1.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(c + u_dt * dc, 0.0, 1.6),
        clamp(h + u_dt * dh, 0.0, 2.8)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 02)
 * ============================================================================
 * Visualizes:
 * - Architectural 3D "Wedding-Cake" Stepped Terraces (Proteus mirabilis)
 * - Swirling Hyper-Flagellated Swarmer Rafts along active ring fronts
 * - Refractive, Lens-like Chemotactic Bacterial Pearls (E. coli / Salmonella)
 * - Kimmy's swappable LUT + Bull's-Eye Flat-Color Posterization
 */
export const CONCENTRIC_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Motile (b), G: Nutrient (n), B: Chemoattractant (c), A: Terrace (h)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform float u_terraceRoughness;
uniform float u_terraceStepSharpness;
uniform float u_terraceLedgeQuantization;
uniform float u_swarmerRaftSwirlContrast;
uniform float u_aggregateLensIOR;
uniform float u_ringSubsurfaceScattering;
uniform float u_elevationScale;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarVoidColor;
uniform vec3 u_chemoattractantCloudColor;
uniform vec3 u_consolidatedTerraceColor;
uniform vec3 u_activeSwarmRingColor;
uniform vec3 u_chemotacticPearlCrestColor;
uniform bool u_enableFlatColorBands;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform float u_ringPhaseFrequency;

// Procedural micro-texture for swirling multinucleated swarmer rafts (Proteus / Bacillus)
float swarmerRaftVortices(vec2 uv, vec2 ringTangent) {
    vec2 p = uv * u_resolution * 0.38;
    vec2 t = normalize(ringTangent + vec2(1e-5));
    vec2 n = vec2(-t.y, t.x);
    vec2 localCoords = vec2(dot(p, t), dot(p, n) * 3.2);
    float vortex = sin(localCoords.x * 1.4 + sin(localCoords.y * 0.9) * 2.2);
    float flagellaStreams = cos(localCoords.y * 2.6 - sin(localCoords.x * 1.8));
    return 0.5 + 0.5 * (0.65 * vortex + 0.35 * flagellaStreams);
}

// Quantizes continuous biomass into stepped "wedding-cake" terrace ledges
float shapeWeddingCakeTerrace(float rawH, float ledges, float sharpness) {
    float scaled = rawH * ledges;
    float fl = floor(scaled);
    float fr = fract(scaled);
    float stepRamp = smoothstep(0.5 * (1.0 - sharpness), 1.0 - 0.45 * sharpness, fr);
    return mix(rawH, (fl + stepRamp) / ledges, sharpness);
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
    float b = s.r; // Active swarmers / chemotactic pearl centers
    float n = s.g; // Nutrient
    float c = s.b; // Chemoattractant field
    float h = s.a; // Consolidated terrace height

    // 1. Reconstruct 3D Stepped Wedding-Cake Terraces & Chemotactic Pearl Domes
    vec4 sE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0));
    vec4 sW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0));
    vec4 sN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y));
    vec4 sS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y));

    float tC = shapeWeddingCakeTerrace(h, u_terraceLedgeQuantization, u_terraceStepSharpness);
    float tE = shapeWeddingCakeTerrace(sE.a, u_terraceLedgeQuantization, u_terraceStepSharpness);
    float tW = shapeWeddingCakeTerrace(sW.a, u_terraceLedgeQuantization, u_terraceStepSharpness);
    float tN = shapeWeddingCakeTerrace(sN.a, u_terraceLedgeQuantization, u_terraceStepSharpness);
    float tS = shapeWeddingCakeTerrace(sS.a, u_terraceLedgeQuantization, u_terraceStepSharpness);

    float elevC = (tC * 0.85 + b * 0.65) * u_elevationScale;
    float elevE = (tE * 0.85 + sE.r * 0.65) * u_elevationScale;
    float elevW = (tW * 0.85 + sW.r * 0.65) * u_elevationScale;
    float elevN = (tN * 0.85 + sN.r * 0.65) * u_elevationScale;
    float elevS = (tS * 0.85 + sS.r * 0.65) * u_elevationScale;

    vec2 gradElev = vec2(elevE - elevW, elevN - elevS) * 18.0;

    // 2. Swarmer Raft Vortex Micro-Normals along the terrace rings
    vec2 ringTangent = vec2(-gradElev.y, gradElev.x);
    float raftDetail = swarmerRaftVortices(v_uv, ringTangent);
    float colonyMask = smoothstep(0.015, 0.055, b + h);

    vec2 totalSlope = gradElev + (raftDetail - 0.5) * u_swarmerRaftSwirlContrast * colonyMask * vec2(1.1, 1.1);
    vec3 N = normalize(vec3(-totalSlope, 1.0));

    // Terrace cliff ambient occlusion (darkens the vertical step risers slightly for 3D depth)
    float cliffSteepness = clamp(length(gradElev) * 0.35, 0.0, 1.0);
    float terraceAO = 1.0 - 0.28 * cliffSteepness * u_terraceStepSharpness;

    // 3. Compute Chromatic Coordinate for Bull's-Eye / Spot Mapping
    float phaseWave = 0.07 * cos(c * u_ringPhaseFrequency - u_time * 1.2);
    float rawCoord = clamp(tC * 0.52 + b * 0.78 + phaseWave, 0.0, 1.0);

    // Anti-aliased Flat-Color Posterization for Screen-Print Target Rings
    float colorCoord = rawCoord;
    if (u_enableFlatColorBands) {
        float scaled = rawCoord * u_flatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.25, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_flatBandCount;
        colorCoord = mix(rawCoord, stepped, u_flatEdgeSharpness);
    }

    // 4. Resolve Colony Albedo (Kimmy's 1D LUT or Built-in Terrace/Pearl Ramp)
    vec3 colonyAlbedo;
    if (u_useKimmyLut) {
        colonyAlbedo = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        vec3 ringMix = mix(u_consolidatedTerraceColor, u_activeSwarmRingColor, clamp(colorCoord * 1.45, 0.0, 1.0));
        colonyAlbedo = mix(ringMix, u_chemotacticPearlCrestColor, smoothstep(0.62, 0.96, colorCoord));
    }

    // Highlight dense chemotactic pearl aggregates (high b & c)
    float pearlMask = clamp(b * c * 1.75, 0.0, 1.0);
    colonyAlbedo = mix(colonyAlbedo, u_chemotacticPearlCrestColor * 1.2, pearlMask * 0.5);

    // 5. PBR Lighting + Subsurface Lensing + Mucoid Swarm Highlights
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(cos(u_time * 0.22) * 0.58, sin(u_time * 0.22) * 0.58, 0.76));
    vec3 L2 = normalize(vec3(-0.55, -0.45, 0.70));
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, V), 0.0);

    // Subsurface Scattering & Refractive Pearl Lensing
    float sssWrap = max(0.0, (dot(N, L1) + 0.6) / 1.6);
    float lensFocus = pow(max(dot(-N.xy, L1.xy), 0.0), 2.0) * pearlMask;
    vec3 sssGlow = colonyAlbedo * (sssWrap + 0.65 * lensFocus) * u_ringSubsurfaceScattering * (0.45 + 0.95 * b);

    // Active swarming rings & chemotactic droplets are wetter/glossier than consolidated inner terraces
    float localRoughness = mix(u_terraceRoughness * 1.3, max(0.04, u_terraceRoughness * 0.35), clamp(b * 1.4, 0.0, 1.0));
    float spec1 = distributionGGX(N, H1, localRoughness);
    float spec2 = distributionGGX(N, H2, localRoughness * 1.25) * 0.4;

    float f0 = pow((u_aggregateLensIOR - 1.0) / (u_aggregateLensIOR + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    vec3 litColony = colonyAlbedo * (0.26 + 0.62 * NdotL1 + 0.24 * NdotL2) * terraceAO
                   + sssGlow
                   + vec3(1.0, 0.99, 0.96) * (spec1 + spec2) * (0.3 + 0.7 * fresnel);

    // 6. Render Self-Secreted Chemoattractant Cloud in the Agar Medium
    float chemoHalo = clamp(c * 1.35, 0.0, 1.0) * (1.0 - colonyMask);
    vec3 agarBackground = mix(
        u_agarVoidColor,
        u_chemoattractantCloudColor * 0.55,
        pow(chemoHalo, 1.5)
    );

    vec3 finalRGB = mix(agarBackground, litColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 02
 * ============================================================================
 */
export function bindConcentricPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: ConcentricSpeciesPreset
): void {
  const hexToVec3 = (hex: string): [number, number, number] => {
    const clean = hex.replace("#", "");
    const n = parseInt(clean, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  // Bind PDE Simulation Uniforms
  gl.useProgram(simProgram);
  const m = preset.math;
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dswim"), m.Dswim);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dswarm"), m.Dswarm);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dn"), m.Dn);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dc"), m.Dc);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_hysteresisWmax"), m.hysteresisWmax);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_hysteresisWmin"), m.hysteresisWmin);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_consolidationClockFreq"), m.consolidationClockFreq);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_chemotaxisChi"), m.chemotaxisChi);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_receptorSaturationKc"), m.receptorSaturationKc);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_chemoSecretionAlpha"), m.chemoSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_chemoDecayBeta"), m.chemoDecayBeta);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_terraceConsolidationMu"), m.terraceConsolidationMu);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_terraceRoughness"), t.terraceRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_terraceStepSharpness"), t.terraceStepSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_terraceLedgeQuantization"), t.terraceLedgeQuantization);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_swarmerRaftSwirlContrast"), t.swarmerRaftSwirlContrast);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_aggregateLensIOR"), t.aggregateLensIOR);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_ringSubsurfaceScattering"), t.ringSubsurfaceScattering);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_elevationScale"), t.elevationScale);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarVoidColor"), hexToVec3(p.agarVoidHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_chemoattractantCloudColor"), hexToVec3(p.chemoattractantCloudHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_consolidatedTerraceColor"), hexToVec3(p.consolidatedTerraceHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_activeSwarmRingColor"), hexToVec3(p.activeSwarmRingHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_chemotacticPearlCrestColor"), hexToVec3(p.chemotacticPearlCrestHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableFlatColorBands"), p.enableFlatColorBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatBandCount"), p.flatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatEdgeSharpness"), p.flatEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_ringPhaseFrequency"), p.ringPhaseFrequency);
}