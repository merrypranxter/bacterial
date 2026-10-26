/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 07: MYCELIAL ACTINOMYCETES & EXUDATE BEADS
 * ============================================================================
 * Biophysical & Microbiological References (Synthesized from Research Notebooks):
 * 1. Flärdh & Buttner (2009) / Streptomyces developmental biology:
 *    Complex life cycle transitioning from vegetative substrate mycelium to
 *    hydrophobic aerial hyphae, culminating in chains of dry, chalky spores.
 * 2. Willey et al. (1991) / Chaplins & Hydrophobins:
 *    Aerial hyphae coat themselves in chaplin proteins, becoming extremely
 *    hydrophobic. This breaks the surface tension of water, allowing them to
 *    grow into the air, creating a dry, powdery, "matte" macroscopic texture.
 * 3. Secondary Metabolite Exudate Beads:
 *    Under nutrient stress, Streptomyces hyper-produce secondary metabolites
 *    (antibiotics like actinorhodin, undecylprodigiosin). Because the aerial
 *    surface is highly water-repellent, these pigmented aqueous solutions
 *    coalesce into distinct, macroscopic, jewel-like liquid droplets resting
 *    on top of the colony (exudate beads).
 * ============================================================================
 */

export type MycelialSpeciesId =
  | "streptomyces_coelicolor_exudate"
  | "streptomyces_venezuelae_chloramphenicol"
  | "streptomyces_rimosus_oxytetracycline"
  | "micromonospora_echinospora";

export interface MycelialPBRTextureProfile {
  /** The roughness of the dry, chalky aerial spore layer (usually close to 1.0) */
  sporeChalkiness: number;
  /** Size/frequency of the micro-fractures in the dry mycelial crust */
  crustFractureScale: number;
  /** How heavily the dry spores scatter light (powder/fuzz effect) */
  sporeSubsurfaceScatter: number;
  /** The refractive index of the liquid exudate droplets (~1.33 to 1.38) */
  exudateLiquidIOR: number;
  /** Roundness/plumpness of the liquid exudate beads */
  exudateContactAngle: number;
  /** Macroscopic 3D height multiplier for the fungal-like mycelial mound */
  mycelialElevationScale: number;
}

export interface MycelialPsychedelicProfile {
  agarVoidHex: string;
  /** Color of the young, vegetative substrate mycelium */
  vegetativeBaseHex: string;
  /** Color of the mature, dry aerial spores (often white, grey, or pastel) */
  aerialSporeHex: string;
  /** Base color of the liquid exudate droplet */
  exudatePrimaryHex: string;
  /** Core absorption/deep color of the liquid exudate droplet */
  exudateDeepHex: string;
  /** Enable Kimmy's flat color bands specifically on the dry spore mound */
  enableFlatSporeBands: boolean;
  flatBandCount: number;
  flatEdgeSharpness: number;
  /** Causes the liquid droplets to slowly pulse with psychedelic hues */
  exudatePulseFrequency: number;
}

export interface MycelialSpeciesPreset {
  id: MycelialSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  metaboliteName: string;
  bergeyForm: "Irregular-Mycelial" | "Circular-Crusted";
  bergeyElevation: "Raised-Cratered" | "Convex-Powdery";
  bergeyMargin: "Filamentous" | "Erose";
  description: string;

  /** Coupled PDE Biophysical Parameters */
  math: {
    /** Diffusivity of the vegetative substrate mycelium (very slow) */
    Db: number;
    /** Diffusivity of nutrients in the agar */
    Dn: number;
    /** Rate at which vegetative cells differentiate into aerial spores (triggered by starvation) */
    sporulationRateMu: number;
    /** Rate of exudate liquid secretion during the stress/sporulation phase */
    exudateSecretionAlpha: number;
    /** Droplet condensation strength (Turing-like short-range activation to form beads) */
    dropletCohesionGamma: number;
    /** Maximal growth rate of the vegetative mycelium kappa_g */
    growthRateKappa: number;
    /** Nutrient consumption rate gamma_n */
    nutrientConsumption: number;
    /** Spore hydrophobicity (repels the liquid exudate into tighter spheres) */
    sporeHydrophobicity: number;
  };

  texture: MycelialPBRTextureProfile;
  psychedelic: MycelialPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 07)
 * ============================================================================
 */
export const MYCELIAL_SPECIES_PRESETS: Record<MycelialSpeciesId, MycelialSpeciesPreset> = {
  streptomyces_coelicolor_exudate: {
    id: "streptomyces_coelicolor_exudate",
    scientificName: "Streptomyces coelicolor A3(2)",
    commonMorphotypeName: "Grey Aerial Spores with Blue/Red Exudate",
    metaboliteName: "Actinorhodin / Undecylprodigiosin",
    bergeyForm: "Irregular-Mycelial",
    bergeyElevation: "Convex-Powdery",
    bergeyMargin: "Filamentous",
    description:
      "The model actinomycete. Grows a dense, leathery vegetative mycelium that erupts into a fuzzy, chalky-grey layer of aerial spores. Stressed by starvation, it hyper-produces vibrant blue (actinorhodin) and red (prodiginine) antibiotics that pool into perfectly spherical, jewel-like liquid droplets resting on the dry hydrophobic spores.",
    math: {
      Db: 0.03, // Very slow, rigid growth
      Dn: 0.85,
      sporulationRateMu: 0.45,
      exudateSecretionAlpha: 0.55,
      dropletCohesionGamma: 1.25, // Strong Turing condensation for distinct beads
      growthRateKappa: 0.65,
      nutrientConsumption: 0.55,
      sporeHydrophobicity: 0.90,
    },
    texture: {
      sporeChalkiness: 0.95, // Ultra-matte powdery finish
      crustFractureScale: 2.5,
      sporeSubsurfaceScatter: 0.65, // Fuzziness
      exudateLiquidIOR: 1.34, // Aqueous solution
      exudateContactAngle: 1.8, // Plump, high spherical beads
      mycelialElevationScale: 1.4,
    },
    psychedelic: {
      agarVoidHex: "#0a0a0c",
      vegetativeBaseHex: "#2b2d42",
      aerialSporeHex: "#edf2f4", // Chalky white/grey
      exudatePrimaryHex: "#00f5d4", // Cyan/Blue jewel highlights
      exudateDeepHex: "#d90429", // Deep red/blue absorption core
      enableFlatSporeBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.85,
      exudatePulseFrequency: 1.5,
    },
  },

  streptomyces_venezuelae_chloramphenicol: {
    id: "streptomyces_venezuelae_chloramphenicol",
    scientificName: "Streptomyces venezuelae",
    commonMorphotypeName: "Chartreuse Droplets on Olive Crust",
    metaboliteName: "Chloramphenicol / Jadomycin",
    bergeyForm: "Circular-Crusted",
    bergeyElevation: "Raised-Cratered",
    bergeyMargin: "Erose",
    description:
      "A prolific antibiotic producer. The colony forms a heavily crusted, wrinkled, pale-olive surface. As jadomycin and chloramphenicol are synthesized, the colony sweats out viscous, golden-chartreuse liquid beads that slowly merge and drip along the colony's microscopic ridges.",
    math: {
      Db: 0.04,
      Dn: 0.80,
      sporulationRateMu: 0.38,
      exudateSecretionAlpha: 0.60,
      dropletCohesionGamma: 0.85, // Weaker cohesion = more irregular, merging puddles
      growthRateKappa: 0.68,
      nutrientConsumption: 0.60,
      sporeHydrophobicity: 0.70,
    },
    texture: {
      sporeChalkiness: 0.85,
      crustFractureScale: 1.8,
      sporeSubsurfaceScatter: 0.45,
      exudateLiquidIOR: 1.38, // Slightly more viscous/oily
      exudateContactAngle: 1.2, // Flatter puddles
      mycelialElevationScale: 1.6,
    },
    psychedelic: {
      agarVoidHex: "#0d0f0a",
      vegetativeBaseHex: "#386641",
      aerialSporeHex: "#a7c957", // Pale olive/pistachio spores
      exudatePrimaryHex: "#f2e8cf",
      exudateDeepHex: "#bc4749",
      enableFlatSporeBands: true,
      flatBandCount: 4,
      flatEdgeSharpness: 0.75,
      exudatePulseFrequency: 2.2,
    },
  },

  streptomyces_rimosus_oxytetracycline: {
    id: "streptomyces_rimosus_oxytetracycline",
    scientificName: "Streptomyces rimosus",
    commonMorphotypeName: "Cracked Golden-Earth Mycelium",
    metaboliteName: "Oxytetracycline",
    bergeyForm: "Irregular-Mycelial",
    bergeyElevation: "Convex-Powdery",
    bergeyMargin: "Erose",
    description:
      "Named 'rimosus' for its heavily cracked, fissured macroscopic appearance. Produces the golden-yellow antibiotic oxytetracycline. The surface looks like parched desert earth, with tiny, incredibly bright golden liquid beads emerging directly from the deep fissures.",
    math: {
      Db: 0.02, // Highly rigid, immobile structure
      Dn: 0.75,
      sporulationRateMu: 0.55, // Rapid crusting
      exudateSecretionAlpha: 0.40,
      dropletCohesionGamma: 1.45, // Tiny, tight beads
      growthRateKappa: 0.60,
      nutrientConsumption: 0.50,
      sporeHydrophobicity: 0.95, // Highly repellent
    },
    texture: {
      sporeChalkiness: 1.0, // Totally matte, cracked earth
      crustFractureScale: 3.5, // High frequency fissures
      sporeSubsurfaceScatter: 0.20,
      exudateLiquidIOR: 1.35,
      exudateContactAngle: 2.0, // Almost full spheres
      mycelialElevationScale: 1.2,
    },
    psychedelic: {
      agarVoidHex: "#140a00",
      vegetativeBaseHex: "#603808",
      aerialSporeHex: "#dda15e",
      exudatePrimaryHex: "#ffe6a7",
      exudateDeepHex: "#ff9f1c", // Glowing golden oxytetracycline
      enableFlatSporeBands: false, // Let the natural cracks show
      flatBandCount: 6,
      flatEdgeSharpness: 0.6,
      exudatePulseFrequency: 1.0,
    },
  },

  micromonospora_echinospora: {
    id: "micromonospora_echinospora",
    scientificName: "Micromonospora echinospora",
    commonMorphotypeName: "Dark Orange Lobate Crust with Black Beads",
    metaboliteName: "Gentamicin / Calicheamicin",
    bergeyForm: "Circular-Crusted",
    bergeyElevation: "Raised-Cratered",
    bergeyMargin: "Lobate",
    description:
      "Unlike Streptomyces, Micromonospora species often lack true aerial mycelium, instead forming a tough, leathery, dark orange-to-black crust on the agar surface. They exude extremely dark, viscous liquid beads rich in potent aminoglycoside antibiotics.",
    math: {
      Db: 0.05,
      Dn: 0.82,
      sporulationRateMu: 0.25, // Forms a crust rather than fuzzy spores
      exudateSecretionAlpha: 0.75, // Heavy exudate producer
      dropletCohesionGamma: 1.10,
      growthRateKappa: 0.72,
      nutrientConsumption: 0.65,
      sporeHydrophobicity: 0.65,
    },
    texture: {
      sporeChalkiness: 0.65, // More leathery than chalky
      crustFractureScale: 1.2,
      sporeSubsurfaceScatter: 0.35,
      exudateLiquidIOR: 1.45, // Thick, tar-like exudate
      exudateContactAngle: 1.4,
      mycelialElevationScale: 1.5,
    },
    psychedelic: {
      agarVoidHex: "#000000",
      vegetativeBaseHex: "#370617",
      aerialSporeHex: "#e85d04", // Vivid dark orange crust
      exudatePrimaryHex: "#ffba08",
      exudateDeepHex: "#03071e", // Tar-black core
      enableFlatSporeBands: true,
      flatBandCount: 5,
      flatEdgeSharpness: 0.88,
      exudatePulseFrequency: 3.0,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (MYCELIAL GROWTH & EXUDATE CONDENSATION)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (v) = Vegetative Substrate Mycelium
 *   G (n) = Nutrient Substrate Concentration
 *   B (a) = Aerial Spores / Dry Chalky Crust (3D Fungal Biomass)
 *   A (e) = Liquid Exudate (Secondary Metabolites / Antibiotics)
 */
export const MYCELIAL_SIM_GLSL = /* glsl */ `#version 300 es
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
uniform float u_sporulationRateMu;
uniform float u_exudateSecretionAlpha;
uniform float u_dropletCohesionGamma;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_sporeHydrophobicity;

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float v = center.r; // Vegetative Mycelium
    float n = center.g; // Nutrient
    float a = center.b; // Aerial Spores / Crust
    float e = center.a; // Liquid Exudate

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
             
    vec2 gradV = 0.5 * vec2(E.r - W.r, N.r - S.r);
    vec2 gradA = 0.5 * vec2(E.b - W.b, N.b - S.b);

    // 1. Vegetative Mycelial Growth (Slow, compact, invasive into agar)
    float f_n = n / (0.15 + n);
    float division = u_growthRateKappa * v * f_n;

    // 2. Starvation-Induced Differentiation (Vegetative -> Aerial Spores)
    // As nutrient 'n' drops, vegetative cells push upward to form aerial hyphae 'a'
    float starvation = 1.0 - f_n;
    float sporulation = u_sporulationRateMu * v * starvation * (0.1 + 0.9 * a); // Auto-catalytic aerial growth

    // 3. Secondary Metabolite Secretion (Exudate 'e')
    // Secreted during the stress/sporulation phase
    float exudateProduction = u_exudateSecretionAlpha * v * starvation;

    // 4. Liquid Droplet Condensation (Turing-like Instability)
    // The exudate is a liquid that wants to pool together due to surface tension.
    // The hydrophobicity of the aerial spores ('a') forces the liquid into tighter beads.
    float localRepulsion = u_sporeHydrophobicity * a * e; 
    // A cross-activator/inhibitor model to form distinct droplets
    float dropletInstability = u_dropletCohesionGamma * e * (1.0 - e/2.0) - (0.5 * lap.a) - localRepulsion;
    
    // Diffusion of liquid on the surface is hindered by the dry spore crust
    float liquidDiffusion = (0.25 / (1.0 + 5.0 * a)) * lap.a;

    // 5. Time Integration
    float dv = (u_Db * lap.r) + division - sporulation - 0.01 * v;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float da = (0.02 * lap.b) + sporulation + 0.15 * dot(gradV, gradA); // Aerial hyphae build on top of vegetative
    float de = liquidDiffusion + dropletInstability + exudateProduction - 0.05 * e; // Exudate evaporates slowly

    out_state = vec4(
        clamp(v + u_dt * dv, 0.0, 2.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(a + u_dt * da, 0.0, 3.5),
        clamp(e + u_dt * de, 0.0, 2.0)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 07)
 * ============================================================================
 * Visualizes:
 * - The hyper-matte, chalky, powdery texture of the aerial Streptomyces spores.
 * - Procedural micro-fissures/cracking in the dry crust.
 * - Perfectly spherical, highly reflective, jewel-like liquid exudate droplets resting on the surface.
 * - Dual-BRDF: Powdery Oren-Nayar style base vs. Liquid GGX Microfacet beads.
 */
export const MYCELIAL_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Vegetative (v), G: Nutrient (n), B: Aerial Spores (a), A: Exudate Liquid (e)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform float u_sporeChalkiness;
uniform float u_crustFractureScale;
uniform float u_sporeSubsurfaceScatter;
uniform float u_exudateLiquidIOR;
uniform float u_exudateContactAngle;
uniform float u_mycelialElevationScale;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarVoidColor;
uniform vec3 u_vegetativeBaseColor;
uniform vec3 u_aerialSporeColor;
uniform vec3 u_exudatePrimaryColor;
uniform vec3 u_exudateDeepColor;
uniform bool u_enableFlatSporeBands;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform float u_exudatePulseFrequency;

// Cellular noise for the dry, cracked mycelial crust
vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float mycelialCrustFissures(vec2 uv, float scale) {
    vec2 p = uv * u_resolution * 0.1 * scale;
    vec2 n = floor(p);
    vec2 f = fract(p);
    float min_dist = 1.0;
    
    for(int j=-1; j<=1; j++) {
        for(int i=-1; i<=1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash22(n + g);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < min_dist) {
                min_dist = d;
            }
        }
    }
    // Invert and sharpen to create deep cracks
    return smoothstep(0.0, 0.25, min_dist);
}

// GGX Microfacet Specular Distribution (used for the liquid droplets)
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
    float v = s.r; // Vegetative base
    float a = s.b; // Aerial Spores (Elevation)
    float e = s.a; // Liquid Exudate

    // 1. Reconstruct Base Mycelial Elevation (Powdery Crust)
    float hC = a * u_mycelialElevationScale;
    float hE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).b * u_mycelialElevationScale;
    float hW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).b * u_mycelialElevationScale;
    float hN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).b * u_mycelialElevationScale;
    float hS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).b * u_mycelialElevationScale;

    // Add high-frequency crust fissures to the dry aerial spores
    float crust = mycelialCrustFissures(v_uv, u_crustFractureScale);
    float crustE = mycelialCrustFissures(v_uv + vec2(texel.x, 0.0), u_crustFractureScale);
    float crustN = mycelialCrustFissures(v_uv + vec2(0.0, texel.y), u_crustFractureScale);
    
    vec2 gradCrust = vec2(crustE - crust, crustN - crust) * 2.0 * a; // Cracks only appear where spores 'a' exist
    vec2 gradBaseH = vec2(hE - hW, hN - hS) * 25.0;
    
    vec3 N_base = normalize(vec3(-(gradBaseH + gradCrust), 1.0));

    // 2. Reconstruct Exudate Droplet Elevation (Liquid Spheres resting on top)
    // Droplets are defined by steep local gradients in the 'e' channel
    float eE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).a;
    float eW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).a;
    float eN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).a;
    float eS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).a;

    // We isolate the distinct droplets using a smoothstep threshold on the 'e' channel
    float dropletMask = smoothstep(0.15, 0.45, e);
    
    // The droplet normal is highly spherical, amplified by the contact angle
    vec2 gradDroplet = vec2(eE - eW, eN - eS) * 45.0 * u_exudateContactAngle;
    vec3 N_droplet = normalize(vec3(-gradDroplet, 1.0));

    // Final blended normal: perfectly smooth liquid where dropletMask is 1.0, rough crust where 0.0
    vec3 N = normalize(mix(N_base, N_droplet, dropletMask));

    float colonyMask = smoothstep(0.02, 0.08, v + a);

    // 3. Psychedelic / Flat-Color Mapping for the Mycelial Base
    float baseCoord = clamp(a * 0.4 + v * 0.6, 0.0, 1.0);
    float colorCoord = baseCoord;
    if (u_enableFlatSporeBands) {
        float scaled = baseCoord * u_flatBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.5, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_flatBandCount;
        colorCoord = mix(baseCoord, stepped, u_flatEdgeSharpness);
    }

    vec3 myceliumAlbedo;
    if (u_useKimmyLut) {
        myceliumAlbedo = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        myceliumAlbedo = mix(u_vegetativeBaseColor, u_aerialSporeColor, smoothstep(0.1, 0.7, colorCoord));
    }
    // Darken inside the crust cracks
    myceliumAlbedo *= mix(0.4, 1.0, crust);

    // 4. Liquid Droplet Color (Beer-Lambert Volumetric Absorption)
    float pulse = 0.5 + 0.5 * sin(u_time * u_exudatePulseFrequency + e * 10.0);
    vec3 activeExudatePrimary = mix(u_exudatePrimaryColor, u_exudatePrimaryColor * 1.5, pulse);
    
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float NdotV_drop = max(dot(N_droplet, viewDir), 0.01);
    // Deep absorption in the thick center of the bead
    float opticalDepth = (e * 2.5) / NdotV_drop;
    vec3 dropletColor = mix(u_exudateDeepColor, activeExudatePrimary, exp(-opticalDepth));

    // 5. Dual-BRDF PBR Lighting
    vec3 L1 = normalize(vec3(cos(u_time * 0.15) * 0.6, sin(u_time * 0.15) * 0.6, 0.8));
    vec3 L2 = normalize(vec3(-0.6, -0.4, 0.5));
    vec3 H1 = normalize(viewDir + L1);
    vec3 H2 = normalize(viewDir + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, viewDir), 0.0);

    // --- Lobe A: Chalky/Powdery Base ---
    // High roughness, diffuse wrapping, and subsurface fuzz
    float sssWrap = max(0.0, (dot(N_base, L1) + 0.7) / 1.7);
    vec3 sporeFuzz = myceliumAlbedo * sssWrap * u_sporeSubsurfaceScatter * a;
    vec3 litBase = myceliumAlbedo * (0.2 + 0.8 * NdotL1 + 0.3 * NdotL2) + sporeFuzz;
    // Add a tiny bit of broad, matte specular for the crust
    litBase += vec3(1.0) * distributionGGX(N_base, H1, mix(0.6, 1.0, u_sporeChalkiness)) * 0.1;

    // --- Lobe B: Jewel-like Liquid Droplets ---
    // Near-zero roughness, high IOR Fresnel, completely masks the chalky base
    float dropRoughness = 0.02; // Very wet and smooth
    float specDrop1 = distributionGGX(N_droplet, H1, dropRoughness);
    float specDrop2 = distributionGGX(N_droplet, H2, dropRoughness * 1.5) * 0.4;
    
    float f0 = pow((u_exudateLiquidIOR - 1.0) / (u_exudateLiquidIOR + 1.0), 2.0);
    float fresnelDrop = f0 + (1.0 - f0) * pow(1.0 - NdotV_drop, 5.0);

    vec3 litDroplet = dropletColor * (0.3 + 0.7 * NdotL1) 
                    + vec3(1.0, 0.99, 0.98) * (specDrop1 + specDrop2) * (0.2 + 0.8 * fresnelDrop);

    // 6. Final Composite
    vec3 finalColony = mix(litBase, litDroplet, dropletMask);
    
    // Add contact ambient occlusion where the droplet meets the chalky crust
    float dropletAO = smoothstep(0.0, 0.2, e) * (1.0 - dropletMask);
    finalColony *= (1.0 - 0.5 * dropletAO);

    vec3 finalRGB = mix(u_agarVoidColor, finalColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 07
 * ============================================================================
 */
export function bindMycelialPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: MycelialSpeciesPreset
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
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_sporulationRateMu"), m.sporulationRateMu);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_exudateSecretionAlpha"), m.exudateSecretionAlpha);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_dropletCohesionGamma"), m.dropletCohesionGamma);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_sporeHydrophobicity"), m.sporeHydrophobicity);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_sporeChalkiness"), t.sporeChalkiness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_crustFractureScale"), t.crustFractureScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_sporeSubsurfaceScatter"), t.sporeSubsurfaceScatter);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_exudateLiquidIOR"), t.exudateLiquidIOR);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_exudateContactAngle"), t.exudateContactAngle);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_mycelialElevationScale"), t.mycelialElevationScale);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarVoidColor"), hexToVec3(p.agarVoidHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_vegetativeBaseColor"), hexToVec3(p.vegetativeBaseHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_aerialSporeColor"), hexToVec3(p.aerialSporeHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_exudatePrimaryColor"), hexToVec3(p.exudatePrimaryHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_exudateDeepColor"), hexToVec3(p.exudateDeepHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableFlatSporeBands"), p.enableFlatSporeBands ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatBandCount"), p.flatBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_flatEdgeSharpness"), p.flatEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_exudatePulseFrequency"), p.exudatePulseFrequency);
}