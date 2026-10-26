/**
 * ============================================================================
 * BACTERIAL TABULA — GROUP 09: EXOTIC EXTREMOPHILES
 * ============================================================================
 * Biophysical & Microbiological References:
 * 1. Aliivibrio fischeri (Bioluminescence): Symbiotic bacteria found in the 
 *    Hawaiian bobtail squid. They use Quorum Sensing (AHL autoinducers) to 
 *    measure their own population density. Below a threshold, they are dark. 
 *    Above the threshold, the 'lux' operon is activated, emitting intense 
 *    490nm (cyan/blue) light.
 * 2. Myxococcus xanthus (Fruiting Bodies & Rippling): "Wolf-pack" predators.
 *    Upon starvation, they coordinate via C-signaling to form rippling waves.
 *    Ultimately, they aggregate into massive 3D towers (fruiting bodies) to 
 *    survive desiccation.
 * 3. Magnetospirillum (Magnetotaxis): Contain magnetosomes (iron-rich crystals)
 *    that act as compass needles, forcing their motility to align perfectly 
 *    with magnetic field lines, resulting in highly directional, sweeping growth.
 * ============================================================================
 */

export type ExoticSpeciesId = 
  | "aliivibrio_fischeri_glow"
  | "myxococcus_fruiting_towers"
  | "magnetospirillum_dipole";

export interface ExoticPBRTextureProfile {
  baseRoughness: number;
  /** Height multiplier for the 3D fruiting bodies / towers */
  towerElevationScale: number;
  /** 0.0 = Standard PBR, 1.0 = Pure unlit HDR emission (Bioluminescence) */
  emissionIntensity: number;
  /** Translucency for the towers */
  subsurfaceScatter: number;
}

export interface ExoticPsychedelicProfile {
  agarVoidHex: string;
  colonyBaseHex: string;
  /** The color of the emitted light (e.g. Neon Cyan) */
  bioluminescenceHex: string;
  /** The color of the mature 3D fruiting towers */
  fruitingBodyHex: string;
  /** Frequency of the predatory rippling waves */
  rippleWaveFrequency: number;
}

export interface ExoticSpeciesPreset {
  id: ExoticSpeciesId;
  scientificName: string;
  commonMorphotypeName: string;
  description: string;

  math: {
    Db: number;
    Dn: number;
    /** Autoinducer (for bioluminescence) or C-Signal (for rippling) diffusivity */
    Ds: number;
    growthRateKappa: number;
    nutrientConsumption: number;
    
    /** Quorum Sensing threshold required to trigger bioluminescence */
    luxQuorumThreshold: number;
    
    /** Strength of aggregation to form 3D Fruiting Towers */
    aggregationStrength: number;
    
    /** Alignment strength to the external magnetic field */
    magneticAnisotropy: number;
  };

  texture: ExoticPBRTextureProfile;
  psychedelic: ExoticPsychedelicProfile;
}

/**
 * ============================================================================
 * 1. CURATED SPECIES & MORPHOTYPE PRESETS (GROUP 09)
 * ============================================================================
 */
export const EXOTIC_SPECIES_PRESETS: Record<ExoticSpeciesId, ExoticSpeciesPreset> = {
  aliivibrio_fischeri_glow: {
    id: "aliivibrio_fischeri_glow",
    scientificName: "Aliivibrio fischeri",
    commonMorphotypeName: "Quorum-Sensing Bioluminescence",
    description: "Grows invisibly in the dark until the colony reaches critical mass. Once the autoinducer concentration crosses the quorum threshold, the entire colony bursts into blinding neon-cyan light.",
    math: {
      Db: 0.15,
      Dn: 0.85,
      Ds: 0.40, // Autoinducer diffuses moderately
      growthRateKappa: 0.85,
      nutrientConsumption: 0.55,
      luxQuorumThreshold: 0.65, // Needs high density to glow
      aggregationStrength: 0.0,
      magneticAnisotropy: 0.0,
    },
    texture: {
      baseRoughness: 0.25,
      towerElevationScale: 0.5, // Flat colony
      emissionIntensity: 2.5, // Overdriven HDR emission
      subsurfaceScatter: 0.5,
    },
    psychedelic: {
      agarVoidHex: "#020205", // Pitch black ocean
      colonyBaseHex: "#11141c", // Barely visible when dark
      bioluminescenceHex: "#00f5d4", // Intense neon cyan
      fruitingBodyHex: "#000000",
      rippleWaveFrequency: 0.0,
    }
  },

  myxococcus_fruiting_towers: {
    id: "myxococcus_fruiting_towers",
    scientificName: "Myxococcus xanthus",
    commonMorphotypeName: "Predatory Ripples & Fruiting Towers",
    description: "Starving cells organize into rippling wave fronts. As starvation peaks, the waves collapse into intense points of aggregation, building towering 3D fruiting bodies that cast deep shadows.",
    math: {
      Db: 0.12,
      Dn: 0.90,
      Ds: 0.25, // C-Signal diffuses slowly, maintaining waves
      growthRateKappa: 0.70,
      nutrientConsumption: 0.85, // Starves quickly to trigger fruiting
      luxQuorumThreshold: 99.0, // No bioluminescence
      aggregationStrength: 1.8, // Strong Keller-Segel collapse into towers
      magneticAnisotropy: 0.0,
    },
    texture: {
      baseRoughness: 0.85, // Dry, tough spores
      towerElevationScale: 3.5, // Massive 3D spikes
      emissionIntensity: 0.0,
      subsurfaceScatter: 0.2,
    },
    psychedelic: {
      agarVoidHex: "#1a0b00",
      colonyBaseHex: "#e85d04",
      bioluminescenceHex: "#000000",
      fruitingBodyHex: "#ffba08", // Golden yellow towers
      rippleWaveFrequency: 18.0, // High frequency sync waves
    }
  },

  magnetospirillum_dipole: {
    id: "magnetospirillum_dipole",
    scientificName: "Magnetospirillum magneticum",
    commonMorphotypeName: "Magnetic Flux Line Alignment",
    description: "Bacteria contain iron-oxide compass needles (magnetosomes). Their growth and movement are heavily biased along a simulated magnetic dipole field, creating sweeping, fibrous, anisotropic fractal arcs.",
    math: {
      Db: 0.08,
      Dn: 0.80,
      Ds: 0.0,
      growthRateKappa: 0.80,
      nutrientConsumption: 0.60,
      luxQuorumThreshold: 99.0,
      aggregationStrength: 0.0,
      magneticAnisotropy: 0.95, // Extreme directional bias
    },
    texture: {
      baseRoughness: 0.45,
      towerElevationScale: 0.8,
      emissionIntensity: 0.0,
      subsurfaceScatter: 0.4,
    },
    psychedelic: {
      agarVoidHex: "#050505",
      colonyBaseHex: "#5c6b73",
      bioluminescenceHex: "#000000",
      fruitingBodyHex: "#000000",
      rippleWaveFrequency: 0.0,
    }
  }
};

/**
 * ============================================================================
 * 2. GLSL SIMULATION SHADER (BIOLUMINESCENCE, TOWERS & MAGNETICS)
 * ============================================================================
 * State Texture Channels (RGBA32F):
 *   R (b) = Biomass
 *   G (n) = Nutrient
 *   B (s) = Signaling Molecule (Autoinducer for Lux, C-Signal for Myxo)
 *   A (h) = 3D Elevation (Fruiting Towers)
 */
export const EXOTIC_SIM_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_dt;
uniform float u_time;

uniform float u_Db;
uniform float u_Dn;
uniform float u_Ds;
uniform float u_growthRateKappa;
uniform float u_nutrientConsumption;
uniform float u_luxQuorumThreshold;
uniform float u_aggregationStrength;
uniform float u_magneticAnisotropy;

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r;
    float n = center.g;
    float s = center.b;
    float h = center.a;

    vec4 N  = texture(u_stateTex, v_uv + vec2( 0.0,      texel.y));
    vec4 S  = texture(u_stateTex, v_uv + vec2( 0.0,     -texel.y));
    vec4 E  = texture(u_stateTex, v_uv + vec2( texel.x,  0.0));
    vec4 W  = texture(u_stateTex, v_uv + vec2(-texel.x,  0.0));
    vec4 NE = texture(u_stateTex, v_uv + vec2( texel.x,  texel.y));
    vec4 NW = texture(u_stateTex, v_uv + vec2(-texel.x,  texel.y));
    vec4 SE = texture(u_stateTex, v_uv + vec2( texel.x, -texel.y));
    vec4 SW = texture(u_stateTex, v_uv + vec2(-texel.x, -texel.y));

    vec4 lap = -1.0 * center + 0.20 * (N + S + E + W) + 0.05 * (NE + NW + SE + SW);
    vec2 gradB = 0.5 * vec2(E.r - W.r, N.r - S.r);
    vec2 gradS = 0.5 * vec2(E.b - W.b, N.b - S.b);

    // 1. Magnetic Anisotropy (Magnetospirillum)
    // Create a simulated magnetic dipole field curling across the screen
    vec2 magDipole = vec2(sin(v_uv.y * 3.14), cos(v_uv.x * 3.14)); 
    float magneticFlux = dot(gradB, magDipole) * u_magneticAnisotropy;

    // 2. Growth & Starvation
    float f_n = n / (0.1 + n);
    float division = u_growthRateKappa * b * f_n;
    float starvation = 1.0 - f_n;

    // 3. Signaling (QS or C-Signal)
    // Secreted based on density. Decays over time.
    float signalSecretion = 0.5 * b;
    
    // 4. Fruiting Body Aggregation (Myxococcus)
    // When starving, cells chemotax UP the signal gradient to form towers
    float aggregation = u_aggregationStrength * starvation * dot(gradB, gradS);

    float db = (u_Db * lap.r) + magneticFlux - aggregation + division - 0.01 * b;
    float dn = (u_Dn * lap.g) - (u_nutrientConsumption * division);
    float ds = (u_Ds * lap.b) + signalSecretion - 0.1 * s;
    
    // Elevation grows from active aggregation
    float dh = max(0.0, aggregation) + (0.01 * division) + (0.05 * lap.a);

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 2.0),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(s + u_dt * ds, 0.0, 2.5),
        clamp(h + u_dt * dh, 0.0, 4.0)
    );
}
`;

/**
 * ============================================================================
 * 3. ULTRA-HD PBR TEXTURE SHADER (EXOTIC EXTREMOPHILES)
 * ============================================================================
 */
export const EXOTIC_PBR_TEXTURE_GLSL = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_baseRoughness;
uniform float u_towerElevationScale;
uniform float u_emissionIntensity;
uniform float u_subsurfaceScatter;
uniform float u_luxQuorumThreshold;
uniform float u_rippleWaveFrequency;

uniform vec3 u_agarVoidColor;
uniform vec3 u_colonyBaseColor;
uniform vec3 u_bioluminescenceColor;
uniform vec3 u_fruitingBodyColor;

float distributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float denom = (NdotH * NdotH * (a2 - 1.0) + 1.0);
    return a2 / max(3.14159265 * denom * denom, 1e-5);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 state  = texture(u_stateTex, v_uv);
    float b = state.r;
    float s = state.b;
    float h = state.a;

    // 1. 3D Elevation & Normals (Fruiting Towers)
    float hC = h * u_towerElevationScale;
    float hE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).a * u_towerElevationScale;
    float hW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).a * u_towerElevationScale;
    float hN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).a * u_towerElevationScale;
    float hS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).a * u_towerElevationScale;

    vec2 gradH = vec2(hE - hW, hN - hS) * 20.0;
    
    // Myxococcus rippling waves perturbation
    float ripple = 0.0;
    if (u_rippleWaveFrequency > 0.0) {
        ripple = sin(s * u_rippleWaveFrequency - u_time * 5.0) * 0.15 * b;
        gradH += vec2(ripple, ripple);
    }
    
    vec3 N = normalize(vec3(-gradH, 1.0));
    float colonyMask = smoothstep(0.02, 0.1, b + h);

    // 2. Bioluminescence (Quorum Sensing Trigger)
    // Glows ONLY if the signal 's' crosses the quorum threshold
    float luxActive = smoothstep(u_luxQuorumThreshold - 0.1, u_luxQuorumThreshold + 0.1, s);
    vec3 emission = u_bioluminescenceColor * luxActive * u_emissionIntensity;

    // 3. Base Albedo (Towers vs Flat Colony)
    float towerMask = smoothstep(0.1, 1.0, h);
    vec3 albedo = mix(u_colonyBaseColor, u_fruitingBodyColor, towerMask);

    // 4. PBR Lighting
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(cos(u_time * 0.2) * 0.6, sin(u_time * 0.2) * 0.6, 0.8));
    vec3 L2 = normalize(vec3(-0.6, -0.4, 0.6));
    vec3 H1 = normalize(V + L1);

    float NdotL1 = max(dot(N, L1), 0.0);
    float NdotL2 = max(dot(N, L2), 0.0);

    float sss = max(0.0, (dot(N, L1) + 0.5) / 1.5) * u_subsurfaceScatter * (0.5 + 0.5 * towerMask);
    float spec = distributionGGX(N, H1, u_baseRoughness);

    // Ambient occlusion in the valleys of the fruiting bodies
    float ao = 1.0 - smoothstep(0.0, 0.3, length(gradH)) * 0.5;

    vec3 litColony = albedo * (0.2 + 0.7 * NdotL1 + 0.1 * NdotL2) * ao
                   + (albedo * sss)
                   + vec3(1.0) * spec * 0.2
                   + emission; // Additive HDR glow

    vec3 finalRGB = mix(u_agarVoidColor, litColony, colonyMask);
    out_color = vec4(finalRGB, 1.0);
}
`;

/**
 * ============================================================================
 * 4. RUNTIME UNIFORM BINDER FOR GROUP 09
 * ============================================================================
 */
export function bindExoticPresetUniforms(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  renderProgram: WebGLProgram,
  preset: ExoticSpeciesPreset
): void {
  const hexToVec3 = (hex: string): [number, number, number] => {
    const clean = hex.replace("#", "");
    const n = parseInt(clean, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  // Bind Simulation
  gl.useProgram(simProgram);
  const m = preset.math;
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Db"), m.Db);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Dn"), m.Dn);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_Ds"), m.Ds);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_growthRateKappa"), m.growthRateKappa);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_nutrientConsumption"), m.nutrientConsumption);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_luxQuorumThreshold"), m.luxQuorumThreshold);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_aggregationStrength"), m.aggregationStrength);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_magneticAnisotropy"), m.magneticAnisotropy);

  // Bind Render
  gl.useProgram(renderProgram);
  const t = preset.texture;
  const p = preset.psychedelic;
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_baseRoughness"), t.baseRoughness);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_towerElevationScale"), t.towerElevationScale);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_emissionIntensity"), t.emissionIntensity);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_subsurfaceScatter"), t.subsurfaceScatter);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_luxQuorumThreshold"), m.luxQuorumThreshold);
  gl.uniform1f(gl.getUniformLocation(renderProgram, "u_rippleWaveFrequency"), p.rippleWaveFrequency);

  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_agarVoidColor"), hexToVec3(p.agarVoidHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_colonyBaseColor"), hexToVec3(p.colonyBaseHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_bioluminescenceColor"), hexToVec3(p.bioluminescenceHex));
  gl.uniform3fv(gl.getUniformLocation(renderProgram, "u_fruitingBodyColor"), hexToVec3(p.fruitingBodyHex));
}