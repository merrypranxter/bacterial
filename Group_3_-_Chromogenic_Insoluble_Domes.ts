/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 03: CHROMOGENIC INSOLUBLE DOMES & PULVINATE CUSHIONS
 * ============================================================================
 * Biophysical & Microbiological References (Synthesized from Research Notebooks):
 * 1. Warren et al. (2019) & Kannan et al. (2025):
 *    3D verticalization of non-motile / low-motility colonies on agar. After
 *    an initial ~5h monolayer phase, interior nutrient depletion confines cell
 *    division to a ~20 um peripheral ring while passive shoving and surface
 *    tension build steep 3D domes (Convex, Pulvinate, Umbonate, Crateriform).
 * 2. Chaturwedi et al. (2024) / Chakraborty et al. (2026) / Bergey's Manual:
 *    Water-insoluble (nonpolar, membrane-bound) intracellular chromogenic
 *    pigments: Prodigiosin (Serratia), Violacein (Chromobacterium),
 *    Staphyloxanthin & Zeaxanthin (Staphylococcus / Micrococcus), and
 *    Indigoidine (Vogesella / Corynebacterium). Because these pigments are
 *    hydrophobic, 100% of the chroma stays locked inside the colony dome with
 *    zero bleed into the surrounding agar.
 * 3. Siddharthan et al. (2020) / Kothari et al. (2016):
 *    Quorum-Sensing (QS) regulation of bacterial chromogenesis — intracellular
 *    pigment synthesis is triggered only when local autoinducer concentration
 *    crosses a population-density threshold.
 * ============================================================================
 */

export type ChromogenicSpeciesId =
  | "serratia_prodigiosin_umbonate"
  | "chromobacterium_violacein_pulvinate"
  | "staphylococcus_staphyloxanthin_golden"
  | "micrococcus_zeaxanthin_cushion"
  | "vogesella_indigoidine_crateriform";

/**
 * Bergey's Manual Side-Profile Elevation Classifications:
 *  0 = Convex (smooth watch-glass dome)
 *  1 = Pulvinate (steep, high cushion-shaped dome)
 *  2 = Umbonate (raised dome with a central knobby belly-button protuberance)
 *  3 = Crateriform (raised rim with a sunken saucer/crater center from core autolysis)
 */
export type BergeyElevationCode = 0 | 1 | 2 | 3;

export interface ChromogenicPBRTextureProfile {
  /** Bergey's Manual cross-sectional elevation profile code (0..3) */
  elevationCode: BergeyElevationCode;
  /** Base microfacet roughness of the cellular surface (butyrous vs. granular) */
  surfaceRoughness: number;
  /** Polysaccharide capsule / mucoid clearcoat thickness (0 = matte, 1 = wet glass dome) */
  mucoidClearcoat: number;
  /** Refractive index of the butyrous/mucoid dome (1.38 - 1.49 for lipid-rich membranes) */
  domeIOR: number;
  /** Beer-Lambert volumetric absorption density of the intracellular pigment */
  beerLambertAbsorption: number;
  /** Subsurface scattering (SSS) diffusion radius (gives creamy/waxy internal glow) */
  subsurfaceScatterRadius: number;
  /** Micro-scale cocci / packet pebble bump contrast (grape-like clusters or tetrads) */
  cocciMicroClusterContrast: number;
  /** Frequency of the microscopic cocci/coccobacilli packing grain */
  cocciGrainScale: number;
  /** Macroscopic 3D height multiplier for the colony dome */
  domeHeightScale: number;
}

export interface ChromogenicPsychedelicProfile {
  agarVoidHex: string;
  /** Unpigmented young peripheral margin color (before Quorum Sensing fires) */
  juvenileMarginHex: string;
  /** Primary intracellular chromogenic pigment color */
  primaryPigmentHex: string;
  /** Deep Beer-Lambert volumetric core absorption color */
  deepCoreAbsorptionHex: string;
  /** High-elevation umbonate/pulvinate apex highlight color */
  apexCrestHex: string;
  /** Enables hard-edge screen-printed topographic contour bands on the 3D dome */
  enableFlatColorBands: boolean;
  /** Number of quantized posterization bands from margin to dome apex */
  flatBandCount: number;
  /** 0.0 = smooth buttery gradient, 1.0 = razor-sharp pop-art contour rings */
  flatEdgeSharpness: number;
  /** Quorum-sensing phase wave frequency inside the colony dome */
  quorumWaveFrequency: number;
}

export interface ChromogenicSpeciesPreset {
  id: ChromogenicSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  naturalPigmentName: string;
  chemicalClass: string;
  bergeyForm: "Circular" | "Irregular-Circular" | "Punctiform-Cluster";
  bergeyMargin: "Entire" | "Undulate" | "Lobate-Crenated";
  bergeyElevation: "Convex" | "Pulvinate" | "Umbonate" | "Crateriform";
  bergeyConsistency: "Butyrous (Buttery)" | "Mucoid-Viscid" | "Firm-Granular";
  description: string;

  /** Coupled PDE Biophysical Parameters (Eden-KPZ Shoving + Quorum-Sensing Chromogenesis) */
  math: {
    /** Passive cell-shoving diffusivity D_b0 (Regime D/E compact expansion) */
    Db0: number;
    /** Nutrient diffusivity D_n in agar */
    Dn: number;
    /** Quorum-sensing autoinducer (AHL/AIP) diffusivity D_q */
    Dq: number;
    /** Contact-line surface tension exponent k (keeps colony margin entire & compact) */
    compactnessExpK: number;
    /** Maximal cell division rate kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Verticalization rate mu (monolayer -> 3D vertical dome stacking) */
    verticalizationMu: number;
    /** KPZ lateral shoving coefficient lambda_KPZ */
    kpzLateralLambda: number;
    /** Autoinducer secretion rate alpha_q per active cell */
    qsSecretionAlpha: number;
    /** Critical Quorum-Sensing threshold Q_crit that switches on pigment synthesis */
    qsThresholdCrit: number;
    /** Quenched agar pinning noise (0.05 = razor-smooth entire margin, 0.35 = undulate) */
    marginPinningNoise: number;
  };

  texture: ChromogenicPBRTextureProfile;
  psychedelic: ChromogenicPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 03)
 * ============================================================================
 */
export const CHROMOGENIC_SPECIES_PRESETS: Record<ChromogenicSpeciesId, ChromogenicSpeciesPreset> = {
  serratia_prodigiosin_umbonate: {
    id: "serratia_prodigiosin_umbonate",
    scientificName: "Serratia marcescens (Wild-Type Chromogenic Strain)",
    commonMorphotypeName: "Prodigiosin Crimson Umbonate Cabochon",
    naturalPigmentName: "Prodigiosin (Tripyrrole, lambda_max = 535 nm)",
    chemicalClass: "Nonpolar Tripyrrole (Water-Insoluble)",
    bergeyForm: "Circular",
    bergeyMargin: "Entire",
    bergeyElevation: "Umbonate",
    bergeyConsistency: "Butyrous (Buttery)",
    description:
      "Classic smooth, circular colony with an umbonate (raised central button) profile and a glossy, butyrous consistency. Regulated by quorum sensing, cells synthesize nonpolar crimson prodigiosin strictly inside the cell envelope—leaving a translucent pale-pink juvenile outer rim and a blood-ruby core with zero agar bleed.",
    math: {
      Db0: 0.11,
      Dn: 0.85,
      Dq: 0.24,
      compactnessExpK: 0.65,
      growthRateKappa: 0.90,
      nutrientConsumption: 0.64,
      verticalizationMu: 0.36,
      kpzLateralLambda: 0.42,
      qsSecretionAlpha: 0.55,
      qsThresholdCrit: 0.32,
      marginPinningNoise: 0.08,
    },
    texture: {
      elevationCode: 2, // Umbonate (dome with raised central knobby protuberance)
      surfaceRoughness: 0.14,
      mucoidClearcoat: 0.88,
      domeIOR: 1.44,
      beerLambertAbsorption: 1.65,
      subsurfaceScatterRadius: 0.92,
      cocciMicroClusterContrast: 0.25,
      cocciGrainScale: 1.4,
      domeHeightScale: 1.55,
    },
    psychedelic: {
      agarVoidHex: "#080307",
      juvenileMarginHex: "#ffccd5",
      primaryPigmentHex: "#ff0033",
      deepCoreAbsorptionHex: "#590d22",
      apexCrestHex: "#ff758f",
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.86,
      quorumWaveFrequency: 9.0,
    },
  },

  chromobacterium_violacein_pulvinate: {
    id: "chromobacterium_violacein_pulvinate",
    scientificName: "Chromobacterium violaceum / Janthinobacterium lividum",
    commonMorphotypeName: "Violacein Velvet-Purple Pulvinate Cushion",
    naturalPigmentName: "Violacein (Bis-indole derivative, lambda_max = 575 nm)",
    chemicalClass: "Hydrophobic Indole Derivative (Water-Insoluble)",
    bergeyForm: "Circular",
    bergeyMargin: "Entire",
    bergeyElevation: "Pulvinate",
    bergeyConsistency: "Mucoid-Viscid",
    description:
      "Synthesizes violacein from L-tryptophan via the vioABCDE operon under CviI/CviR quorum sensing. Forms steep, cushion-shaped (pulvinate) domes that look like liquid amethyst cabochons—combining intense deep-violet Beer-Lambert interior absorption with a mirror-slick viscid polysaccharide clearcoat.",
    math: {
      Db0: 0.09,
      Dn: 0.82,
      Dq: 0.20,
      compactnessExpK: 0.75,
      growthRateKappa: 0.84,
      nutrientConsumption: 0.60,
      verticalizationMu: 0.44, // High vertical stacking for steep pulvinate cushion
      kpzLateralLambda: 0.38,
      qsSecretionAlpha: 0.62,
      qsThresholdCrit: 0.28,
      marginPinningNoise: 0.06,
    },
    texture: {
      elevationCode: 1, // Pulvinate (steep hemispherical cushion)
      surfaceRoughness: 0.08, // Ultra-smooth glass-like dome
      mucoidClearcoat: 0.98,
      domeIOR: 1.48,
      beerLambertAbsorption: 2.10, // Deep velvet-violet optical density
      subsurfaceScatterRadius: 0.78,
      cocciMicroClusterContrast: 0.18,
      cocciGrainScale: 1.2,
      domeHeightScale: 1.85,
    },
    psychedelic: {
      agarVoidHex: "#04010a",
      juvenileMarginHex: "#e0aaff",
      primaryPigmentHex: "#7b2cbf",
      deepCoreAbsorptionHex: "#10002b",
      apexCrestHex: "#00f5d4",
      enableFlatColorBands: true,
      flatBandCount: 7,
      flatEdgeSharpness: 0.90,
      quorumWaveFrequency: 11.5,
    },
  },

  staphylococcus_staphyloxanthin_golden: {
    id: "staphylococcus_staphyloxanthin_golden",
    scientificName: "Staphylococcus aureus (Carotenoid Golden Strain)",
    commonMorphotypeName: "Staphyloxanthin Butyrous Golden Dome",
    naturalPigmentName: "Staphyloxanthin (C30 Triterpenoid Carotenoid, lambda_max = 462 nm)",
    chemicalClass: "Membrane-Integrated Triterpenoid Carotenoid (Water-Insoluble)",
    bergeyForm: "Circular",
    bergeyMargin: "Entire",
    bergeyElevation: "Convex",
    bergeyConsistency: "Butyrous (Buttery)",
    description:
      "Produces membrane-bound golden carotenoid staphyloxanthin (an antioxidant virulence shield). Colonies are circular with entire margins, convex elevation, and a classic creamy 'butyrous' (butter-like) texture that scatters warm golden-amber light beneath a soft, waxy specular sheen.",
    math: {
      Db0: 0.08,
      Dn: 0.90,
      Dq: 0.22,
      compactnessExpK: 0.80,
      growthRateKappa: 0.88,
      nutrientConsumption: 0.58,
      verticalizationMu: 0.38,
      kpzLateralLambda: 0.35,
      qsSecretionAlpha: 0.50,
      qsThresholdCrit: 0.25,
      marginPinningNoise: 0.05,
    },
    texture: {
      elevationCode: 0, // Convex dome
      surfaceRoughness: 0.24, // Soft, creamy buttery microfacet spread
      mucoidClearcoat: 0.55,
      domeIOR: 1.42,
      beerLambertAbsorption: 1.15,
      subsurfaceScatterRadius: 1.00, // High creamy/waxy SSS
      cocciMicroClusterContrast: 0.42, // Grape-like staphylococcal cocci clusters
      cocciGrainScale: 1.8,
      domeHeightScale: 1.40,
    },
    psychedelic: {
      agarVoidHex: "#0a0702",
      juvenileMarginHex: "#fff3b0",
      primaryPigmentHex: "#ffaa00",
      deepCoreAbsorptionHex: "#9e2a2b",
      apexCrestHex: "#ffff3f",
      enableFlatColorBands: false, // Creamy, buttery golden-amber subsurface gradient
      flatBandCount: 5,
      flatEdgeSharpness: 0.75,
      quorumWaveFrequency: 7.5,
    },
  },

  micrococcus_zeaxanthin_cushion: {
    id: "micrococcus_zeaxanthin_cushion",
    scientificName: "Micrococcus luteus (Sarcinaxanthin / Zeaxanthin Strain)",
    commonMorphotypeName: "Electric Lemon-Chartreuse Tetrad Cushion",
    naturalPigmentName: "Sarcinaxanthin & Zeaxanthin (C50/C40 Carotenoids, lambda_max = 440 nm)",
    chemicalClass: "Isoprenoid Carotenoid (Water-Insoluble)",
    bergeyForm: "Circular",
    bergeyMargin: "Entire",
    bergeyElevation: "Pulvinate",
    bergeyConsistency: "Firm-Granular",
    description:
      "Spherical cocci arranged in regular tetrads and cuboidal packets of eight. Forms high, opaque, electric lemon-yellow pulvinate cushions with a finely pebbled micro-tetrad surface texture and intense ultraviolet/blue light absorption.",
    math: {
      Db0: 0.07,
      Dn: 0.88,
      Dq: 0.18,
      compactnessExpK: 0.90,
      growthRateKappa: 0.78,
      nutrientConsumption: 0.52,
      verticalizationMu: 0.48,
      kpzLateralLambda: 0.30,
      qsSecretionAlpha: 0.58,
      qsThresholdCrit: 0.22,
      marginPinningNoise: 0.09,
    },
    texture: {
      elevationCode: 1, // Pulvinate cushion
      surfaceRoughness: 0.34, // Finely pebbled cuboidal tetrad packets
      mucoidClearcoat: 0.38,
      domeIOR: 1.40,
      beerLambertAbsorption: 1.05,
      subsurfaceScatterRadius: 0.88,
      cocciMicroClusterContrast: 0.68, // Pronounced tetrad packet micro-relief
      cocciGrainScale: 2.3,
      domeHeightScale: 1.65,
    },
    psychedelic: {
      agarVoidHex: "#060902",
      juvenileMarginHex: "#e9ff70",
      primaryPigmentHex: "#ccff00",
      deepCoreAbsorptionHex: "#38b000",
      apexCrestHex: "#ffffff",
      enableFlatColorBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.92,
      quorumWaveFrequency: 10.0,
    },
  },

  vogesella_indigoidine_crateriform: {
    id: "vogesella_indigoidine_crateriform",
    scientificName: "Vogesella indigofera / Corynebacterium insidiosum",
    commonMorphotypeName: "Indigoidine Metallic-Blue Crateriform Ring-Dome",
    naturalPigmentName: "Indigoidine (Bipyridyl Quinone-like Pigment, lambda_max = 602 nm)",
    chemicalClass: "Insoluble Bipyridyl Granules (Metallic Coppery-Blue)",
    bergeyForm: "Irregular-Circular",
    bergeyMargin: "Undulate",
    bergeyElevation: "Crateriform",
    bergeyConsistency: "Firm-Granular",
    description:
      "Synthesizes water-insoluble indigoidine granules that precipitate inside the colony with a striking metallic royal-blue hue and a coppery specular sheen. As the interior starves, core autolysis collapses the center into a classic Bergey's 'crateriform' (volcanic saucer) elevation.",
    math: {
      Db0: 0.12,
      Dn: 0.78,
      Dq: 0.26,
      compactnessExpK: 0.70,
      growthRateKappa: 0.86,
      nutrientConsumption: 0.74, // High interior consumption drives central cratering
      verticalizationMu: 0.40,
      kpzLateralLambda: 0.45,
      qsSecretionAlpha: 0.64,
      qsThresholdCrit: 0.30,
      marginPinningNoise: 0.22, // Undulate wavy outer margin
    },
    texture: {
      elevationCode: 3, // Crateriform (volcanic rim with sunken saucer center)
      surfaceRoughness: 0.20,
      mucoidClearcoat: 0.76,
      domeIOR: 1.52, // High refractive index for metallic coppery-indigo sheen
      beerLambertAbsorption: 1.95,
      subsurfaceScatterRadius: 0.65,
      cocciMicroClusterContrast: 0.52, // Crystalline indigoidine granule texture
      cocciGrainScale: 1.9,
      domeHeightScale: 1.60,
    },
    psychedelic: {
      agarVoidHex: "#02040d",
      juvenileMarginHex: "#4cc9f0",
      primaryPigmentHex: "#003566",
      deepCoreAbsorptionHex: "#000814",
      apexCrestHex: "#ff9e00", // Coppery-gold metallic rim highlight
      enableFlatColorBands: true,
      flatBandCount: 6,
      flatEdgeSharpness: 0.88,
      quorumWaveFrequency: 13.0,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (3D VERTICALIZATION + QUORUM-SENSING CHROMOGENESIS)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active dividing peripheral ring cells (~20 um growth zone)
 *   G (n) = Nutrient substrate concentration in agar
 *   B (q) = Intracellular Chromogenic Pigment & Quorum-Sensing Autoinducer
 *   A (h) = 3D Vertical Colony Dome Biomass (drives Convex/Pulvinate/Umbonate/Crateriform)
 */
export const CHROMOGENIC_DOME_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;

// Coupled PDE Uniforms (from ChromogenicSpeciesPreset.math)
uniform float u_Db0;
uniform float u_Dn;
uniform float u_Dq;
uniform float u_compactnessExpK;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_verticalizationMu;
uniform float u_kpzLateralLambda;
uniform float u_qsSecretionAlpha;
uniform float u_qsThresholdCrit;
uniform float u_marginPinningNoise;

float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Active peripheral dividing cells
    float n = center.g; // Nutrient
    float q = center.b; // Quorum-sensing chromogenic pigment concentration
    float h = center.a; // 3D vertical dome height

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

    vec2 gradH = 0.5 * vec2(E.a - W.a, N.a - S.a);

    // 1. Compact Passive Shoving Motility (Eden / KPZ front with surface tension)
    float pinning = 1.0 + u_marginPinningNoise * (hash21(floor(v_uv * u_resolution * 0.45)) - 0.5) * 2.0;
    float Db_eff = u_Db0 * pow(max(b, 0.0005), u_compactnessExpK) * pinning;

    // 2. Michaelis-Menten Nutrient Uptake & Peripheral Ring Growth (Warren & Kannan 2019/2025)
    float f_n = n / (0.14 + n);
    // Logistic crowding cap ensures division concentrates in the outer peripheral ring
    float division = u_growthRateKappa * b * f_n * clamp(1.0 - 0.38 * h, 0.05, 1.0);

    // 3. 3D Verticalization: cells shoved upward into the dome height field h
    float verticalStacking = u_verticalizationMu * b * (0.35 + 0.65 * clamp(b + h, 0.0, 1.5)) / (1.0 + 1.8 * n);
    float kpzSlopeGrowth   = u_kpzLateralLambda * dot(gradH, gradH);

    // 4. Quorum-Sensing (QS) Regulated Intracellular Chromogenesis
    // Pigment synthesis switches on via a Hill function when total biomass (b + h) > Q_crit
    float totalBiomass = b + h;
    float hillSwitch = pow(max(totalBiomass, 0.0), 3.0) / (pow(u_qsThresholdCrit, 3.0) + pow(max(totalBiomass, 0.0), 3.0));
    // Crucial: Insoluble pigment q only diffuses INSIDE the colony mask (zero bleed into bare agar!)
    float insideColonyMask = smoothstep(0.01, 0.06, totalBiomass);
    float dq = (u_Dq * insideColonyMask * lap.b) + (u_qsSecretionAlpha * hillSwitch * (0.3 + 0.7 * b)) - 0.04 * q;

    // 5. Time integration of coupled fields
    float db = (Db_eff * lap.r) + division - verticalStacking;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float dh = verticalStacking + kpzSlopeGrowth + 0.035 * lap.a;

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 1.4),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp((q + u_dt * dq) * insideColonyMask, 0.0, 1.8),
        clamp(h + u_dt * dh, 0.0, 2.8)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 03)
 * ============================================================================
 * Visualizes:
 * - Bergey's Manual 3D Elevations: Convex, Pulvinate, Umbonate, Crateriform
 * - Strictly Water-Insoluble Intracellular Chromogenesis (Zero Agar Bleed)
 * - Beer-Lambert Volumetric Absorption + Creamy Butyrous Subsurface Scattering
 * - Dual-Layer Specular BRDF (Waxy Butyrous Base + Wet Mucoid Capsule Clearcoat)
 * - Microscopic Cocci / Tetrad Packet Pebble Normals
 */
export const CHROMOGENIC_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Active ring (b), G: Nutrient (n), B: QS Pigment (q), A: Dome Biomass (h)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform int u_elevationCode;        // 0: Convex, 1: Pulvinate, 2: Umbonate, 3: Crateriform
uniform float u_surfaceRoughness;
uniform float u_mucoidClearcoat;
uniform float u_domeIOR;
uniform float u_beerLambertAbsorption;
uniform float u_subsurfaceScatterRadius;
uniform float u_cocciMicroClusterContrast;
uniform float u_cocciGrainScale;
uniform float u_domeHeightScale;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarVoidColor;
uniform vec3 u_juvenileMarginColor;
uniform vec3 u_primaryPigmentColor;
uniform vec3 u_deepCoreAbsorptionColor;
uniform vec3 u_apexCrestColor;
uniform bool u_enableFlatColorBands;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform float u_quorumWaveFrequency;

// Procedural cellular Voronoi-like pebble texture for cocci clusters & tetrads
float cocciClusterPebbles(vec2 uv, float grainScale) {
    vec2 p = uv * u_resolution * 0.42 * grainScale;
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = 0.5 + 0.42 * sin(vec2(dot(i + neighbor, vec2(127.1, 311.7)), dot(i + neighbor, vec2(269.5, 183.3))));
            vec2 diff = neighbor + point - f;
            minDist = min(minDist, dot(diff, diff));
        }
    }
    return sqrt(minDist);
}

// Bergey's Manual Side-View Elevation Shaping Function
float shapeBergeyElevation(float rawH, float activeB, int code) {
    float base = clamp((rawH * 0.72 + activeB * 0.45) / 2.2, 0.0, 1.0);
    if (code == 0) {
        // Convex: smooth watch-glass dome
        return pow(base, 0.75) * 1.15;
    } else if (code == 1) {
        // Pulvinate: steep, high hemispherical cushion
        return sqrt(clamp(base * 1.35, 0.0, 1.0)) * 1.45;
    } else if (code == 2) {
        // Umbonate: broad raised base + central knobby belly-button protuberance
        float broadShelf = smoothstep(0.0, 0.55, base) * 0.65;
        float centralKnob = exp(-pow((1.0 - base) * 3.2, 2.0)) * 0.75;
        return broadShelf + centralKnob;
    } else {
        // Crateriform: raised volcanic rim with sunken saucer center (from core autolysis)
        float rimDome = pow(base, 0.65) * 1.35;
        float coreCollapse = smoothstep(0.55, 0.98, base) * 0.68;
        return max(0.0, rimDome - coreCollapse);
    }
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
    float b = s.r; // Active peripheral growth ring
    float n = s.g; // Nutrient
    float q = s.b; // Intracellular Quorum-Sensing Pigment
    float h = s.a; // Raw vertical biomass

    // 1. Reconstruct 3D Bergey's Elevation Profile & Surface Normals
    vec4 sE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0));
    vec4 sW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0));
    vec4 sN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y));
    vec4 sS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y));

    float domeC = shapeBergeyElevation(h, b, u_elevationCode) * u_domeHeightScale;
    float domeE = shapeBergeyElevation(sE.a, sE.r, u_elevationCode) * u_domeHeightScale;
    float domeW = shapeBergeyElevation(sW.a, sW.r, u_elevationCode) * u_domeHeightScale;
    float domeN = shapeBergeyElevation(sN.a, sN.r, u_elevationCode) * u_domeHeightScale;
    float domeS = shapeBergeyElevation(sS.a, sS.r, u_elevationCode) * u_domeHeightScale;

    vec2 gradDome = vec2(domeE - domeW, domeN - domeS) * 20.0;

    // 2. Cocci / Tetrad Micro-Cluster Normal Perturbation
    float cocciC = cocciClusterPebbles(v_uv, u_cocciGrainScale);
    float cocciE = cocciClusterPebbles(v_uv + vec2(texel.x, 0.0), u_cocciGrainScale);
    float cocciN = cocciClusterPebbles(v_uv + vec2(0.0, texel.y), u_cocciGrainScale);
    vec2 gradCocci = vec2(cocciE - cocciC, cocciN - cocciC) * 4.5;

    // Razor-clean margin mask: water-insoluble pigments never bleed outside colonyMask
    float colonyMask = smoothstep(0.018, 0.055, b + h);

    vec3 N_base = normalize(vec3(-(gradDome + gradCocci * u_cocciMicroClusterContrast * colonyMask), 1.0));
    // Smooth mucoid capsule clearcoat normal (blurs out micro-cocci pebbles under wet slime)
    vec3 N_clearcoat = normalize(vec3(-gradDome * 1.15, 1.0));

    // 3. Chromatic Phase Coordinate (Driven by Quorum-Sensing Pigment q & Dome Elevation)
    float qsRipple = 0.06 * sin(q * u_quorumWaveFrequency - u_time * 1.1);
    float rawCoord = clamp(q * 0.65 + domeC * 0.32 + qsRipple, 0.0, 1.0);

    // Anti-aliased Flat-Color Posterization for Screen-Print Topographic Domes
    float colorCoord = rawCoord;
    if (u_enableFlatColorBands) {
        float scaled = rawCoord * u_flatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.25, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_flatBandCount;
        colorCoord = mix(rawCoord, stepped, u_flatEdgeSharpness);
    }

    // 4. Resolve Intracellular Chromogenic Albedo + Beer-Lambert Volumetric Depth
    vec3 basePigment;
    if (u_useKimmyLut) {
        basePigment = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        // Transition from unpigmented juvenile margin -> vibrant QS pigment -> apex crest
        vec3 juvenileToMature = mix(u_juvenileMarginColor, u_primaryPigmentColor, smoothstep(0.05, 0.55, colorCoord));
        basePigment = mix(juvenileToMature, u_apexCrestColor, smoothstep(0.72, 0.98, colorCoord));
    }

    // Beer-Lambert Volumetric Absorption: T(d) = exp(-sigma_a * opticalDepth)
    vec3 V = vec3(0.0, 0.0, 1.0);
    float NdotV = max(dot(N_base, V), 0.08);
    float opticalDepth = (domeC * q * u_beerLambertAbsorption) / (0.35 + 0.65 * NdotV);
    float transmittance = exp(-opticalDepth);
    vec3 volumetricAlbedo = mix(u_deepCoreAbsorptionColor, basePigment, clamp(transmittance, 0.12, 1.0));

    // 5. Dual-Lobe PBR Lighting: Butyrous Subsurface Scattering + Mucoid Clearcoat
    vec3 L1 = normalize(vec3(cos(u_time * 0.20) * 0.55, sin(u_time * 0.20) * 0.55, 0.80));
    vec3 L2 = normalize(vec3(-0.62, -0.38, 0.68));
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N_base, L1), 0.0);
    float NdotL2 = max(dot(N_base, L2), 0.0);

    // Creamy / Waxy Subsurface Scattering (multi-wrap approximation)
    float sssBroad = max(0.0, (dot(N_base, L1) + 0.75) / 1.75);
    float rimThinness = exp(-domeC * 1.35) * (0.5 + 0.8 * b);
    vec3 sssGlow = basePigment * sssBroad * u_subsurfaceScatterRadius * (0.45 + 0.90 * rimThinness);

    // Lobe 1: Butyrous / Cellular Base Specular (tinted slightly by pigment for metallic indigoidine/carotenoids)
    float specBase = distributionGGX(N_base, H1, u_surfaceRoughness) * 0.45
                   + distributionGGX(N_base, H2, u_surfaceRoughness * 1.2) * 0.20;

    // Lobe 2: Wet Polysaccharide Capsule Clearcoat (razor-sharp cabochon dome reflection)
    float clearcoatRough = mix(0.22, 0.03, u_mucoidClearcoat);
    float specCoat1 = distributionGGX(N_clearcoat, H1, clearcoatRough) * u_mucoidClearcoat;
    float specCoat2 = distributionGGX(N_clearcoat, H2, clearcoatRough * 1.3) * 0.35 * u_mucoidClearcoat;

    // Fresnel from Dome IOR (lipid/protein membrane + capsule)
    float f0 = pow((u_domeIOR - 1.0) / (u_domeIOR + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    // Contact shadow at the steep colony-agar boundary (pulvinate cushion AO)
    float cushionContactAO = smoothstep(0.0, 0.14, b + h) * 0.35 + 0.65;

    vec3 specularColor = mix(vec3(1.0, 0.99, 0.97), u_apexCrestColor, 0.25);
    vec3 litColony = volumetricAlbedo * (0.24 + 0.64 * NdotL1 + 0.22 * NdotL2) * cushionContactAO
                   + sssGlow
                   + u_apexCrestColor * specBase * fresnel
                   + specularColor * (specCoat1 + specCoat2) * (0.35 + 0.65 * fresnel);

    // 6. Surrounding Agar Medium (Strictly unstained—only subtle contact shadow around dome)
    float outerShadow = smoothstep(0.0, 0.04, b + h) * (1.0 - colonyMask);
    vec3 agarBackground = u_agarVoidColor * (1.0 - 0.45 * outerShadow);

    vec3 finalRGB = mix(agarBackground, litColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 03
 * ============================================================================
 */
export function bindChromogenicPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: ChromogenicSpeciesPreset
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
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dq"), m.Dq);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_compactnessExpK"), m.compactnessExpK);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_verticalizationMu"), m.verticalizationMu);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_kpzLateralLambda"), m.kpzLateralLambda);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_qsSecretionAlpha"), m.qsSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_qsThresholdCrit"), m.qsThresholdCrit);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_marginPinningNoise"), m.marginPinningNoise);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_elevationCode"), t.elevationCode);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_surfaceRoughness"), t.surfaceRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_mucoidClearcoat"), t.mucoidClearcoat);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_domeIOR"), t.domeIOR);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_beerLambertAbsorption"), t.beerLambertAbsorption);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_subsurfaceScatterRadius"), t.subsurfaceScatterRadius);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_cocciMicroClusterContrast"), t.cocciMicroClusterContrast);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_cocciGrainScale"), t.cocciGrainScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_domeHeightScale"), t.domeHeightScale);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarVoidColor"), hexToVec3(p.agarVoidHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_juvenileMarginColor"), hexToVec3(p.juvenileMarginHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_primaryPigmentColor"), hexToVec3(p.primaryPigmentHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_deepCoreAbsorptionColor"), hexToVec3(p.deepCoreAbsorptionHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_apexCrestColor"), hexToVec3(p.apexCrestHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableFlatColorBands"), p.enableFlatColorBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatBandCount"), p.flatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatEdgeSharpness"), p.flatEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_quorumWaveFrequency"), p.quorumWaveFrequency);
}