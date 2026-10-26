/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 06: RUGOSE BIOFILMS, 3D BUCKLING & WRINKLING
 * ============================================================================
 * Biophysical & Microbiological References (Synthesized from Research Notebooks):
 * 1. Asally et al. (2012) / Chai et al. (2011):
 *    Localized cell death and extracellular matrix (EPS) production in Bacillus
 *    subtilis biofilms lead to mechanical buckling. Compressive stress generated
 *    by peripheral growth against a rigid, stationary center forces the colony
 *    to buckle out of plane, forming labyrinthine "brain-coral" wrinkles.
 * 2. Yan et al. (2019) / Vibrio cholerae:
 *    Radial "starburst" wrinkling and blistering. Differences in friction
 *    between the EPS matrix and the agar substrate dictate whether wrinkles
 *    form as radial spokes, concentric rings, or disordered labyrinths.
 * 3. Pseudomonas aeruginosa RSCV (Rugose Small Colony Variants):
 *    Hyper-biofilm producing mutants that hyper-secrete Pel/Psl exopolysaccharides,
 *    resulting in extremely compact, deeply wrinkled/corrugated miniature colonies.
 * ============================================================================
 */

export type RugoseSpeciesId =
  | "bacillus_subtilis_labyrinth"
  | "vibrio_cholerae_starburst"
  | "pseudomonas_rscv_corrugated"
  | "mycobacterium_waxy_cords";

export interface RugosePBRTextureProfile {
  /** The stiffness/rigidity of the EPS matrix (0 = liquid slime, 1 = hard crust). Affects specular response. */
  matrixStiffness: number;
  /** Intensity of Deep Ambient Occlusion (AO) generated inside the wrinkle valleys */
  valleyDarkeningAO: number;
  /** Micro-roughness on the surface of the macroscopic wrinkles */
  microRugosity: number;
  /** Subsurface scattering glow concentrated at the high peaks of the wrinkles */
  peakSubsurfaceScatter: number;
  /** Global 3D height scale for the buckled wrinkles */
  bucklingElevationScale: number;
  /** How heavily the physical wrinkling dictates the normal map shadows */
  shadowContrast: number;
}

export interface RugosePsychedelicProfile {
  agarBaseHex: string;
  /** Color of the flat, young, actively growing peripheral margin */
  peripheralMarginHex: string;
  /** Color of the deep valleys/crevices in the wrinkled interior */
  wrinkleValleyHex: string;
  /** Color of the high elevation peaks/ridges */
  wrinklePeakHex: string;
  /** Applies Kimmy's flat colors as topographical contour lines mapping to the 3D height */
  enableTopographicContours: boolean;
  /** Number of topographic contour bands */
  contourBandCount: number;
  /** 0.0 = smooth elevation gradient, 1.0 = razor-sharp topographic map lines */
  contourEdgeSharpness: number;
  /** Animates the colors flowing along the wrinkle ridges */
  ridgeFlowFrequency: number;
}

export interface RugoseSpeciesPreset {
  id: RugoseSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  bucklingMechanism: "Labyrinthine" | "Radial-Starburst" | "Concentric-Rings" | "Corrugated-Compact";
  bergeyForm: "Circular" | "Irregular";
  bergeyElevation: "Rugose" | "Contoured" | "Wrinkled";
  bergeyMargin: "Undulate" | "Lobate";
  description: string;

  /** Coupled PDE & Mechanical Buckling Parameters */
  math: {
    Db: number;
    Dn: number;
    growthRateKappa: number;
    nutrientConsumption: number;
    /** Rate at which stationary cells secrete EPS matrix (rigidifies the colony) */
    epsSecretionRate: number;
    /** Accumulation of compressive mechanical stress from peripheral growth pushing on the center */
    stressAccumulation: number;
    /** The characteristic wavelength/thickness of the wrinkles (determined by matrix stiffness vs agar friction) */
    wrinkleWavelength: number;
    /** Radial anisotropy: 0.0 = random labyrinth wrinkles, 1.0 = strict radial starburst spokes */
    radialAnisotropy: number;
    /** Base rate at which flat biomass buckles upwards into the 3D height field */
    bucklingRate: number;
  };

  texture: RugosePBRTextureProfile;
  psychedelic: RugosePsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 06)
 * ============================================================================
 */
export const RUGOSE_SPECIES_PRESETS: Record<RugoseSpeciesId, RugoseSpeciesPreset> = {
  bacillus_subtilis_labyrinth: {
    id: "bacillus_subtilis_labyrinth",
    scientificName: "Bacillus subtilis (NCIB 3610 Wild-Type)",
    commonMorphotypeName: "Labyrinthine Brain-Coral Biofilm",
    bucklingMechanism: "Labyrinthine",
    bergeyForm: "Circular",
    bergeyElevation: "Rugose",
    bergeyMargin: "Undulate",
    description:
      "A robust biofilm former. As the colony center starves, cells produce a stiff TasA amyloid and EPS matrix. Peripheral cell growth pushes inward, creating massive compressive stress that forces the colony to buckle into a complex, isotropic 'brain-coral' labyrinth of highly elevated ridges and deep valleys.",
    math: {
      Db: 0.08,
      Dn: 0.85,
      growthRateKappa: 0.90,
      nutrientConsumption: 0.65,
      epsSecretionRate: 0.45,
      stressAccumulation: 0.85,
      wrinkleWavelength: 1.2, // Medium-thick isotropic wrinkles
      radialAnisotropy: 0.1, // Mostly random/isotropic labyrinth
      bucklingRate: 0.75,
    },
    texture: {
      matrixStiffness: 0.85, // Stiff, dry, leathery amyloid surface
      valleyDarkeningAO: 0.95, // Deep, dark crevices
      microRugosity: 0.45,
      peakSubsurfaceScatter: 0.35,
      bucklingElevationScale: 1.8, // Very high ridges
      shadowContrast: 0.9,
    },
    psychedelic: {
      agarBaseHex: "#0a0a0c",
      peripheralMarginHex: "#ff006e", // Vibrant neon pink advancing front
      wrinkleValleyHex: "#3a0ca3", // Deep indigo valleys
      wrinklePeakHex: "#ffbe0b", // Glowing golden peaks
      enableTopographicContours: true,
      contourBandCount: 8,
      contourEdgeSharpness: 0.85,
      ridgeFlowFrequency: 2.5,
    },
  },

  vibrio_cholerae_starburst: {
    id: "vibrio_cholerae_starburst",
    scientificName: "Vibrio cholerae (Rugose Variant)",
    commonMorphotypeName: "Radial Starburst Blisters",
    bucklingMechanism: "Radial-Starburst",
    bergeyForm: "Circular",
    bergeyElevation: "Wrinkled",
    bergeyMargin: "Lobate",
    description:
      "Produces copious amounts of VPS (Vibrio polysaccharide). Because the colony maintains a specific frictional relationship with the agar, mechanical buckling relieves stress primarily along radial lines, creating striking 'starburst' spokes and central blister-like delaminations.",
    math: {
      Db: 0.12,
      Dn: 0.90,
      growthRateKappa: 0.88,
      nutrientConsumption: 0.55,
      epsSecretionRate: 0.60,
      stressAccumulation: 0.95, // High stress from fast peripheral growth
      wrinkleWavelength: 0.85, // Thinner, sharper spokes
      radialAnisotropy: 0.85, // Highly directed radial spokes
      bucklingRate: 0.88,
    },
    texture: {
      matrixStiffness: 0.65, // Slightly more mucoid/flexible than B. subtilis
      valleyDarkeningAO: 0.80,
      microRugosity: 0.20, // Slicker, glossier matrix
      peakSubsurfaceScatter: 0.65,
      bucklingElevationScale: 1.5,
      shadowContrast: 0.75,
    },
    psychedelic: {
      agarBaseHex: "#020408",
      peripheralMarginHex: "#00f5d4",
      wrinkleValleyHex: "#0077b6",
      wrinklePeakHex: "#ffffff",
      enableTopographicContours: true,
      contourBandCount: 6,
      contourEdgeSharpness: 0.95,
      ridgeFlowFrequency: 4.0,
    },
  },

  pseudomonas_rscv_corrugated: {
    id: "pseudomonas_rscv_corrugated",
    scientificName: "Pseudomonas aeruginosa (RSCV)",
    commonMorphotypeName: "Hyper-Compact Corrugated Nodule",
    bucklingMechanism: "Corrugated-Compact",
    bergeyForm: "Irregular",
    bergeyElevation: "Contoured",
    bergeyMargin: "Undulate",
    description:
      "Rugose Small Colony Variants (RSCVs) are mutants often isolated from chronic infections (like Cystic Fibrosis). They overproduce Pel and Psl exopolysaccharides, resulting in auto-aggregative, hyper-wrinkled, extremely compact micro-colonies that resemble tiny, hardened walnuts.",
    math: {
      Db: 0.03, // Extremely slow, compact expansion
      Dn: 0.75,
      growthRateKappa: 0.70,
      nutrientConsumption: 0.80, // Rapid localized depletion
      epsSecretionRate: 0.95, // Massive hyper-secretion
      stressAccumulation: 1.20, // Extreme localized stress
      wrinkleWavelength: 2.5, // High frequency, tight micro-corrugations (in shader math, higher = tighter)
      radialAnisotropy: 0.05,
      bucklingRate: 1.10, // Buckles almost immediately
    },
    texture: {
      matrixStiffness: 0.95, // Very rigid, auto-aggregated crust
      valleyDarkeningAO: 1.0, // Black, impenetrable crevices
      microRugosity: 0.85, // Rough, dry, friable
      peakSubsurfaceScatter: 0.15, // Opaque
      bucklingElevationScale: 2.2, // Very steep for its small size
      shadowContrast: 1.0,
    },
    psychedelic: {
      agarBaseHex: "#1a0b00",
      peripheralMarginHex: "#e85d04",
      wrinkleValleyHex: "#370617",
      wrinklePeakHex: "#ffba08",
      enableTopographicContours: false, // Too compact for contours, use organic gradients
      contourBandCount: 4,
      contourEdgeSharpness: 0.5,
      ridgeFlowFrequency: 1.5,
    },
  },

  mycobacterium_waxy_cords: {
    id: "mycobacterium_waxy_cords",
    scientificName: "Mycobacterium tuberculosis / smegmatis",
    commonMorphotypeName: "Serpentine Waxy Cords",
    bucklingMechanism: "Labyrinthine", // Modfied by high anisotropy
    bergeyForm: "Irregular",
    bergeyElevation: "Rugose",
    bergeyMargin: "Undulate",
    description:
      "Packed with hydrophobic mycolic acids, these colonies are incredibly waxy and tough. They form tightly woven, serpentine 'cords' that writhe and buckle over each other, creating a dense, hydrophobic macro-structure that aggressively repels water and drugs.",
    math: {
      Db: 0.05,
      Dn: 0.80,
      growthRateKappa: 0.65,
      nutrientConsumption: 0.60,
      epsSecretionRate: 0.85, // Mycolic acid / lipid accumulation
      stressAccumulation: 0.75,
      wrinkleWavelength: 1.5,
      radialAnisotropy: 0.65, // Directed serpentine bundling
      bucklingRate: 0.60,
    },
    texture: {
      matrixStiffness: 0.98, // Extreme waxy hardness
      valleyDarkeningAO: 0.85,
      microRugosity: 0.10, // Waxy, smooth micro-surface
      peakSubsurfaceScatter: 0.85, // High SSS through the lipid layers
      bucklingElevationScale: 1.6,
      shadowContrast: 0.85,
    },
    psychedelic: {
      agarBaseHex: "#001a14",
      peripheralMarginHex: "#4cc9f0",
      wrinkleValleyHex: "#023e8a",
      wrinklePeakHex: "#b5e2fa",
      enableTopographicContours: true,
      contourBandCount: 5,
      contourEdgeSharpness: 0.80,
      ridgeFlowFrequency: 5.0,
    },
  },
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (MECHANICAL BUCKLING & WRINKLING INSTABILITY)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Active dividing peripheral biomass
 *   G (n) = Nutrient substrate concentration
 *   B (e) = Extracellular Polymeric Substance (EPS) / Matrix rigidity
 *   A (h) = 3D Elevation (The buckled wrinkle height field)
 */
export const RUGOSE_BUCKLING_SIM_GLSL = /* glsl */ `#version 300 es
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
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_epsSecretionRate;
uniform float u_stressAccumulation;
uniform float u_wrinkleWavelength;
uniform float u_radialAnisotropy;
uniform float u_bucklingRate;

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r; // Active biomass
    float n = center.g; // Nutrient
    float e = center.b; // EPS Matrix
    float h = center.a; // Buckled Height

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

    vec2 gradH = 0.5 * vec2(E.a - W.a, N.a - S.a);
    vec2 gradB = 0.5 * vec2(E.r - W.r, N.r - S.r);

    // 1. Biological Growth & Matrix Secretion
    float f_n = n / (0.15 + n);
    float division = u_growthRateKappa * b * f_n;
    
    // EPS is secreted primarily by aging cells in the center (where nutrient drops)
    float epsProduction = u_epsSecretionRate * b * (1.0 - f_n) * (1.0 - e/2.0);

    // 2. Mechanical Stress Accumulation
    // Stress builds up where EPS is high, and is amplified by the outward shove of peripheral growth
    float compressiveStress = u_stressAccumulation * e * (0.2 + 0.8 * length(gradB));

    // 3. Phenomenological Buckling Instability (Turing-like pattern formation in the height field)
    // To avoid expensive 4th-order biharmonic operators (Del^4 h), we use a cross-activator/inhibitor approach
    // driving a Swift-Hohenberg-esque instability in the height field.
    
    // Radial Anisotropy breaks symmetry to form Vibrio-style starbursts
    vec2 radialDir = normalize(v_uv - vec2(0.5) + 1e-5);
    vec2 heightTangent = vec2(-gradH.y, gradH.x);
    float alignment = dot(radialDir, heightTangent);
    float anisotropicMod = mix(1.0, 1.0 + 1.5 * abs(alignment), u_radialAnisotropy);

    // The core wrinkling term: Laplacian promotes spreading, but stress creates a negative-diffusion buckling
    float buckleInstability = u_bucklingRate * compressiveStress * h * (1.0 - h/3.0) 
                            - (u_wrinkleWavelength * anisotropicMod * lap.a); 
                            
    // Base 2D spreading (KPZ-like)
    float kpzLateral = 0.15 * dot(gradH, gradH);

    // 4. Time Integration
    // Active cells shove outward, but get bogged down in thick EPS (e)
    float Db_eff = u_Db / (1.0 + 5.0 * e);
    
    float db = (Db_eff * lap.r) + division - 0.05 * b;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float de = (0.01 * lap.b) + epsProduction; // EPS diffuses very slowly
    
    // Height grows from biomass accumulation and mechanical buckling
    float dh = (0.05 * lap.a) + (0.1 * division) + buckleInstability + kpzLateral;

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 2.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(e + u_dt * de, 0.0, 2.0),
        clamp(h + u_dt * dh, 0.0, 3.5)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE & PSYCHEDELIC COLOR INJECTION SHADER (GROUP 06)
 * ============================================================================
 * Visualizes:
 * - Extreme macroscopic 3D topographical wrinkles (Brain-coral & Starbursts)
 * - Deep Ambient Occlusion (AO) generated dynamically in the wrinkle valleys.
 * - Subsurface Scattering mapping specifically to the highest ridge peaks.
 * - Kimmy's Topographic Contour Lines mapped exactly to the buckled height field.
 */
export const RUGOSE_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // R: Biomass (b), G: Nutrient (n), B: EPS (e), A: Height (h)
uniform sampler2D u_kimmyLutTex;    // Optional 512x1 custom LUT from PaletteManager
uniform bool u_useKimmyLut;
uniform vec2 u_resolution;
uniform float u_time;

// Texture Profile Uniforms
uniform float u_matrixStiffness;
uniform float u_valleyDarkeningAO;
uniform float u_microRugosity;
uniform float u_peakSubsurfaceScatter;
uniform float u_bucklingElevationScale;
uniform float u_shadowContrast;

// Psychedelic & Flat-Color Uniforms
uniform vec3 u_agarBaseColor;
uniform vec3 u_peripheralMarginColor;
uniform vec3 u_wrinkleValleyColor;
uniform vec3 u_wrinklePeakColor;
uniform bool u_enableTopographicContours;
uniform float u_contourBandCount;
uniform float u_contourEdgeSharpness;
uniform float u_ridgeFlowFrequency;

// GGX Microfacet Specular Distribution for waxy/leathery EPS matrix
float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float denom = (NdotH * NdotH * (a2 - 1.0) + 1.0);
    return a2 / max(3.14159265 * denom * denom, 1e-5);
}

// Procedural high-frequency micro-wrinkle noise based on matrix stiffness
float microWrinkleNoise(vec2 uv, float scale) {
    vec2 p = uv * u_resolution * scale;
    float n = sin(p.x * 2.1 + cos(p.y * 1.8)) + cos(p.y * 3.3 - sin(p.x * 2.5));
    return n * 0.25;
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 s  = texture(u_stateTex, v_uv);
    float b = s.r; // Active biomass at margin
    float e = s.b; // EPS Matrix
    float h = s.a; // Buckled Wrinkle Height

    // 1. Reconstruct Massive 3D Elevation & Normals
    vec4 sE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0));
    vec4 sW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0));
    vec4 sN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y));
    vec4 sS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y));

    float hC = h * u_bucklingElevationScale;
    float gradX = (sE.a - sW.a) * u_bucklingElevationScale * 25.0;
    float gradY = (sN.a - sS.a) * u_bucklingElevationScale * 25.0;
    vec2 gradH = vec2(gradX, gradY);
    
    // Add micro-rugosity texture to the rigid EPS matrix
    float micro = microWrinkleNoise(v_uv, mix(0.1, 0.5, u_matrixStiffness)) * u_microRugosity * clamp(e, 0.0, 1.0);
    float microE = microWrinkleNoise(v_uv + vec2(texel.x, 0.0), mix(0.1, 0.5, u_matrixStiffness)) * u_microRugosity * clamp(e, 0.0, 1.0);
    float microN = microWrinkleNoise(v_uv + vec2(0.0, texel.y), mix(0.1, 0.5, u_matrixStiffness)) * u_microRugosity * clamp(e, 0.0, 1.0);
    vec2 gradMicro = vec2(microE - micro, microN - micro) * 15.0;

    float colonyMask = smoothstep(0.02, 0.1, b + h);
    vec3 N = normalize(vec3(-(gradH + gradMicro), 1.0));

    // 2. Deep Valley Ambient Occlusion (AO)
    // Curvature approximation: Laplacian of height
    float lapH = (sE.a + sW.a + sN.a + sS.a - 4.0 * h); 
    // Valleys have positive laplacian, Peaks have negative laplacian
    float valleyMask = smoothstep(-0.01, 0.15, lapH);
    float peakMask = smoothstep(0.01, -0.15, lapH);
    
    float ao = 1.0 - (valleyMask * u_valleyDarkeningAO);

    // 3. Topographic Contour Color Mapping (Psychedelic Geometry)
    // The color coordinate moves from the flat margin (b), through the deep valleys, up to the high peaks.
    float baseCoord = clamp((h * 0.3) + (peakMask * 0.3) - (valleyMask * 0.2) + (sin(u_time * u_ridgeFlowFrequency) * 0.05), 0.0, 1.0);
    
    float colorCoord = baseCoord;
    if (u_enableTopographicContours) {
        float scaled = baseCoord * u_contourBandCount;
        float frac = fract(scaled);
        float fw = max(fwidth(scaled) * 1.5, 0.005);
        float stepped = (floor(scaled) + smoothstep(0.5 - fw, 0.5 + fw, frac)) / u_contourBandCount;
        colorCoord = mix(baseCoord, stepped, u_contourEdgeSharpness);
    }

    // 4. Resolve Base Albedo (Kimmy's LUT or Default Gradient)
    vec3 baseAlbedo;
    if (u_useKimmyLut) {
        baseAlbedo = texture(u_kimmyLutTex, vec2(colorCoord, 0.5)).rgb;
    } else {
        // Transition: Margin -> Valley -> Peak
        vec3 valleyMix = mix(u_peripheralMarginColor, u_wrinkleValleyColor, smoothstep(0.0, 0.35, colorCoord));
        baseAlbedo = mix(valleyMix, u_wrinklePeakColor, smoothstep(0.45, 1.0, colorCoord));
    }

    // 5. PBR Lighting: Waxy/Leathery Specular & Ridge Subsurface Glow
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(cos(u_time * 0.15) * 0.6, sin(u_time * 0.15) * 0.6, 0.7)); // Dynamic key light
    vec3 L2 = normalize(vec3(-0.5, -0.5, 0.5)); // Fill light
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);
    float NdotV  = max(dot(N, V), 0.0);

    // Subsurface Scattering glows brilliantly on the high, exposed ridges
    float sssWrap = max(0.0, (dot(N, L1) + 0.4) / 1.4);
    vec3 sssGlow = baseAlbedo * sssWrap * peakMask * u_peakSubsurfaceScatter * 1.5;

    // Specular response depends on matrix stiffness (waxy/hard vs mucoid)
    float baseRoughness = mix(0.4, 0.1, u_matrixStiffness); 
    float spec1 = distributionGGX(N, H1, baseRoughness);
    float spec2 = distributionGGX(N, H2, baseRoughness * 1.5) * 0.2;
    
    // Fresnel for the waxy EPS clearcoat
    float ior = mix(1.35, 1.5, u_matrixStiffness);
    float f0 = pow((ior - 1.0) / (ior + 1.0), 2.0);
    float fresnel = f0 + (1.0 - f0) * pow(1.0 - NdotV, 5.0);

    // Hard shadowing based on the extreme wrinkling gradients
    float selfShadow = mix(1.0, max(0.2, dot(N, L1)), u_shadowContrast);

    vec3 litColony = baseAlbedo * (0.15 + 0.65 * NdotL1 * selfShadow + 0.2 * NdotL2) * ao
                   + sssGlow
                   + vec3(1.0, 0.98, 0.95) * (spec1 + spec2) * (0.2 + 0.8 * fresnel) * ao;

    // 6. Background Agar
    vec3 finalRGB = mix(u_agarBaseColor, litColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 06
 * ============================================================================
 */
export function bindRugosePresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: RugoseSpeciesPreset
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
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_epsSecretionRate"), m.epsSecretionRate);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_stressAccumulation"), m.stressAccumulation);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_wrinkleWavelength"), m.wrinkleWavelength);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_radialAnisotropy"), m.radialAnisotropy);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_bucklingRate"), m.bucklingRate);

  // Bind PBR Texture & Psychedelic Uniforms
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_matrixStiffness"), t.matrixStiffness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_valleyDarkeningAO"), t.valleyDarkeningAO);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_microRugosity"), t.microRugosity);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_peakSubsurfaceScatter"), t.peakSubsurfaceScatter);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_bucklingElevationScale"), t.bucklingElevationScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_shadowContrast"), t.shadowContrast);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarBaseColor"), hexToVec3(p.agarBaseHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_peripheralMarginColor"), hexToVec3(p.peripheralMarginHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_wrinkleValleyColor"), hexToVec3(p.wrinkleValleyHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_wrinklePeakColor"), hexToVec3(p.wrinklePeakHex));
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_enableTopographicContours"), p.enableTopographicContours ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_contourBandCount"), p.contourBandCount);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_contourEdgeSharpness"), p.contourEdgeSharpness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_ridgeFlowFrequency"), p.ridgeFlowFrequency);
}