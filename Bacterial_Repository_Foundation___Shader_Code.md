# `bacterial` — Biophysical Morphogenesis & Psychedelic Shader Art Engine

> **Part of the Math-Art Suite**  
> A real-time GPU simulation and physically based rendering (PBR) art engine that blends mathematically rigorous bacterial morphogenesis with ultra-high-definition biological textures and dynamic, psychedelic color injection.

---

## 1. Core Vision & Architecture

`bacterial` bridges two worlds that rarely meet in generative software:
1. **Biophysical & Mathematical Realism**: Rather than relying on generic procedural noise, colony growth over the timeline is driven by coupled partial differential equations (PDEs) derived from microbiology and statistical physics—capturing nutrient depletion, nonlinear lubricating fluid motility, chemotaxis, active nematic alignment, and 3D mechanical wrinkling.
2. **Psychedelic Visuals & Ultra-HD PBR Texturing**: The underlying mathematical fields drive both a **Physically Based Rendering (PBR)** pipeline (subsurface scattering, mucoid specular highlights, agar refraction, and *Flavobacterium* photonic-crystal iridescence) and a **Psychedelic Art Injector** capable of blending hyper-realistic wet biofilm topography with bold, high-contrast flat color bands and hot-swappable custom palettes.

### Proposed Repository Structure

```text
bacterial/
├── README.md                          # Architecture, math docs, and taxonomy reference
├── package.json                       # Vite + TypeScript + WebGL2 / WebGPU setup
├── src/
│   ├── main.ts                        # App entry & timeline controller
│   ├── core/
│   │   ├── SimulationEngine.ts        # Ping-pong FBO / compute shader manager
│   │   ├── TimelineDirector.ts        # Keyframes growth phases (monolayer -> branching -> 3D buckling)
│   │   └── PresetTaxonomy.ts          # Biological species presets (Bergey's Manual mappings)
│   ├── palettes/                      # ---> KIMMY'S MODULE <---
│   │   ├── kimmy_palette_schema.json  # JSON specification for custom swappable palettes
│   │   ├── PaletteManager.ts          # Generates 1D LUT textures & cosine uniforms on the fly
│   │   └── presets/                   # Curated psychedelic & chromogenic palettes
│   └── shaders/
│       ├── common.glsl                # Shared math, Laplacian kernels, and noise functions
│       ├── simulation.frag.glsl       # Multi-channel Reaction-Diffusion + Chemotaxis solver
│       └── pbr_psychedelic.frag.glsl  # Ultra-HD PBR lighting + flat/gradient color injection
```

---

## 2. Mathematical & Biophysical Simulation Engine

To make the app a true member of your math-art suite, the simulation packs **four coupled biophysical fields** into a single floating-point GPU texture (`RGBA32F` or `RGBA16F`), updated multiple substeps per frame via ping-pong framebuffers:

* **Channel `R` ($b$)**: **Active Bacterial Density** (motile, dividing cells at the advancing front).
* **Channel `G` ($n$)**: **Nutrient / Substrate Concentration** in the agar medium, plus water-soluble diffusible pigment concentration.
* **Channel `B` ($c$)**: **Chemoattractant / Extracellular Lubricating Fluid** (surfactants like surfactin or A-signal molecules).
* **Channel `A` ($h$)**: **Inactive Biomass / 3D Colony Elevation & Sporulation** (drives 3D topography, wrinkling, and normal maps).

### 2.1 Unified Coupled PDE System

Across the timeline, the engine evolves the state vector $\mathbf{S}(\mathbf{x}, t) = (b, n, c, h)^T$ using a unified reaction-diffusion-advection framework:

$$
\frac{\partial b}{\partial t} = \underbrace{\nabla \cdot \left[ D_b(b, n, c) D_{\text{aniso}}(\theta) \nabla b \right]}_{\text{Nonlinear & Chiral Motility}} - \underbrace{\nabla \cdot \left( \chi(b) \nabla c \right)}_{\text{Keller-Segel Chemotaxis}} + \underbrace{\kappa_g b \, f(n)}_{\text{Growth}} - \underbrace{\mu(n, b) b}_{\text{Inactivation}}
$$

$$
\frac{\partial n}{\partial t} = D_n \nabla^2 n - \gamma_n b \, f(n) + F_{\text{feed}}(1 - n)
$$

$$
\frac{\partial c}{\partial t} = D_c \nabla^2 c + \alpha_c b - \beta_c c
$$

$$
\frac{\partial h}{\partial t} = \mu(n, b) b + \lambda_{\text{KPZ}} |\nabla h|^2 + D_h \nabla^2 h + \sigma_{\text{buckle}} \mathcal{W}(b, h)
$$

#### Key Mathematical Ingredients (Synthesized from Research)

1. **Michaelis-Menten Nutrient Uptake**:
   Cellular division depends on local substrate availability $n$ relative to the characteristic half-saturation constant $c_{\text{half}}$:
   $$f(n) = \frac{n}{c_{\text{half}} + n}$$

2. **Ben-Jacob Lubricating Nonlinear Diffusion**:
   On hard agar, bacteria cannot swim freely; they excrete a lubricating fluid or require a critical crowd density to shove outward. Setting the effective bacterial diffusivity to:
   $$D_b(b, n, c) = D_{b0} \, b^k \, n^m$$
   (typically $k = 1$, $m = 0$ or $1$) creates sharp, compact colony boundaries and triggers tip-splitting **Diffusion-Limited Aggregation (DLA)** and **Dense Branching Morphology (DBM)**.

3. **Morphological Phase Diagram & Branching Parameter ($\beta$)**:
   By sweeping initial nutrient concentration $n_0$ and agar hardness (inversely proportional to $D_{b0}$), the math naturally reproduces the five classic *Bacillus subtilis* growth regimes:
   * **Regime A (DLA Fractal)**: Low nutrient $n_0$, hard agar (low $D_{b0}$).
   * **Regime B (Dense Branching / DBM)**: High nutrient $n_0$, hard agar. Controlled by the dimensionless branching parameter $\beta = \frac{\kappa_g \rho_0}{\phi n_0}$.
   * **Regime C (Concentric Rings)**: Intermediate agar softness with hysteretic motility switching between a random swimming phase and a high-density swarming phase. The ring period $T$ obeys:
     $$T = D_0 (W_{\max} - W_{\min}) \left( \frac{1}{\lambda - D_0 c_s} - \frac{1}{\lambda - D_0 c_g} \right)$$
   * **Regime D (Homogeneous Disk)**: Soft agar, high motility; expands at the Fisher-Kolmogorov wave speed $v_F = 2\sqrt{D_{b0} \kappa_g}$.
   * **Regime E (Compact Eden-like / KPZ Rough Front)**: High nutrient, intermediate agar; front roughness obeys the Kardar-Parisi-Zhang (KPZ) scaling exponents ($\alpha = \frac{1}{2}$, $\beta = \frac{1}{3}$, $z = \frac{3}{2}$).

4. **Chiral Twist & Active Nematic Microdomains**:
   For strains like *Paenibacillus dendritiformis* (chiral morphotype), the diffusion tensor $D_{\text{aniso}}(\theta)$ rotates the flux vector by a chiral torsion angle $\theta_c$, while steric alignment vs. extensile growth stress creates a mosaic of aligned rod microdomains with characteristic length scale $l_d \propto \sqrt{\frac{K_{\text{orient}}}{\sigma_{\text{active}}}}$.

5. **Timeline Evolution (2D Monolayer $\rightarrow$ 3D Biofilm Wrinkling)**:
   * **Hours $0\text{--}5$**: Exponential monolayer expansion; nematic microdomains form.
   * **Hours $5\text{--}24$**: Interior nutrient depletion ($n \rightarrow 0$ in core); active growth restricts to a peripheral ring ($\sim 20\ \mu\text{m}$ scale).
   * **Hours $24\text{--}65+$**: Compressive mechanical stress in the expanding biofilm triggers the buckling operator $\mathcal{W}(b, h)$, forming radial wrinkles, *Vibrio cholerae* starburst blisters, and 3D "broccoli-like" roughening.

---

## 3. Biological Taxonomy, Morphology & Chromogenesis Matrix

To ground the presets in real bacteriology (*Bergey's Manual of Determinative Bacteriology*), the app maps clinical colony morphology descriptors and natural bacterial pigments directly to shader parameters.

### 3.1 Colony Morphology Descriptors $\rightarrow$ Shader Mappings

| Taxonomic Descriptor | Microbiological Varieties | Shader / Math Implementation |
| :--- | :--- | :--- |
| **Form** (Macro Outline) | Circular, Irregular, Filamentous, Rhizoid, Punctiform | Controlled by $D_{b0}$, nonlinear exponent $k$, and quenched agar noise $\eta(\mathbf{x})$. |
| **Elevation** (Side Profile) | Flat, Raised, Convex, Pulvinate, Umbonate, Crateriform | Shaped by shaping function on Channel `A` ($h$): e.g., umbonate adds a central Gaussian dome; crateriform subtracts interior height upon core starvation. |
| **Margin** (Colony Edge) | Entire (smooth), Undulate, Lobate, Erose, Filiform, Curled | Driven by front instability wavelength $\lambda^*$ and chemotactic sensitivity $\chi(b)$. |
| **Surface & Texture** | Smooth/Glistening, Rough/Granular, Rugose (wrinkled), Mucoid, Butyrous | Modulates PBR Roughness map, clearcoat layer (mucoid slime), and high-frequency normal perturbation. |
| **Opacity & Hemolysis** | Opaque, Translucent, Iridescent; $\alpha$-, $\beta$-, $\gamma$-hemolysis | Controls Subsurface Scattering (SSS) radius and an outer agar halo zone derived from nutrient depletion $1 - n$. |

### 3.2 Real-World Bacterial Pigments & Structural Color Presets

| Species Preset | Natural Pigment / Mechanism | Biological Color & Solubility | Visual & Psychedelic Behavior in App |
| :--- | :--- | :--- | :--- |
| ***Serratia marcescens*** | **Prodigiosin** (Pyrrole) | Vivid Crimson / Bright Red (**Water-Insoluble**) | High-saturation red locked strictly inside the colony body ($b + h$), zero bleed into surrounding agar. |
| ***Pseudomonas aeruginosa*** | **Pyocyanin** + **Pyoverdin** (Phenazine / Siderophore) | Blue-Green + UV Fluorescent Yellow-Green (**Water-Soluble**) | Diffuses into the agar medium ahead of the colony front, creating glowing psychedelic halos and green/cyan agar stains. |
| ***Chromobacterium violaceum*** | **Violacein** (Indole derivative) | Deep Psychedelic Blue-Violet (**Water-Insoluble**) | Ultra-rich velvet violet-purple convex domes with high subsurface absorption and glossy mucoid coat. |
| ***Flavobacterium IR1*** / ***Cellulophaga lytica*** | **2D Hexagonal Photonic Crystal Lattice** (*moeA* pathway) | Metallic Angle-Dependent Iridescence (**Structural Color**) | Glitter-like thin-film interference shader: shifts from emerald green at the core to ruby red and ultraviolet at the periphery based on camera viewing angle. |
| ***Staphylococcus aureus*** / ***Micrococcus luteus*** | **Staphyloxanthin** / **Zeaxanthin** (Carotenoids) | Golden-Yellow to Electric Lemon (**Water-Insoluble**) | Butyrous, high-opacity cushion-shaped (pulvinate) colonies with warm metallic-gold rim lighting. |
| ***Streptomyces coelicolor*** | **Actinorhodin** (Polyketide) | pH-Responsive Deep Blue $\leftrightarrow$ Red (**Water-Soluble**) | Color shifts dynamically across the timeline as metabolic waste alters local agar pH! |

---

## 4. Kimmy's Custom Palette & Psychedelic Injection System

To make sure **Kimmy** can design, test, and hot-swap color palettes without touching the core PDE math, the rendering pipeline decouples **Biophysical State** from **Chromatic Mapping**.

### 4.1 How Psychedelic Color Injection Works

The renderer supports three blendable color modes that can be mixed per-layer:
1. **Continuous Cosine / LUT Gradients**: Smooth, multi-stop psychedelic gradients mapped to active growth ($b$), elevation ($h$), or chemical phase angle $\operatorname{atan2}(b - \bar{b}, c - \bar{c})$.
2. **Hard-Edge "Flat Color" Posterization**: Quantizes continuous biological fields into razor-sharp, screen-printed flat color bands using anti-aliased `fwidth()` step thresholds. You can inject flat pop-art colors into the agar rings or active branch tips while keeping the 3D specular wet highlights and normal-mapped shadows on top!
3. **Structural Iridescence Override**: Layers *Flavobacterium* photonic-crystal view-angle color shifts over Kimmy's base palette.

### 4.2 `src/palettes/kimmy_palette_schema.json`

Give this JSON schema to Kimmy—every palette file in `src/palettes/presets/` follows this structure and can be dragged-and-dropped into the app at runtime:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "paletteId": "psychedelic_pseudomonas_01",
  "name": "Acid Pyocyanin & Flat Magenta Spores",
  "author": "Kimmy",
  "mode": "hybrid_flat_and_pbr",
  "agarBackground": "#070312",
  "solubleHaloColor": "#00ffcc",
  "solubleHaloGlow": 1.45,
  "cosineGradient": {
    "offset": [0.50, 0.50, 0.50],
    "amplitude": [0.50, 0.50, 0.50],
    "frequency": [1.00, 1.00, 1.00],
    "phase": [0.00, 0.33, 0.67]
  },
  "colorStops": [
    { "position": 0.0, "hex": "#070312", "role": "agar_void", "flatBand": true },
    { "position": 0.22, "hex": "#00f5d4", "role": "soluble_bleed", "flatBand": false },
    { "position": 0.48, "hex": "#7b2cbf", "role": "mature_biofilm", "flatBand": true },
    { "position": 0.76, "hex": "#ff007f", "role": "active_branch_tips", "flatBand": true },
    { "position": 0.95, "hex": "#ffee32", "role": "sporulation_crests", "flatBand": true }
  ],
  "flatColorSettings": {
    "enabled": true,
    "bandCount": 5,
    "edgeSharpness": 0.92,
    "preservePBRSpecular": true,
    "preserveSubsurfaceGlow": true
  },
  "iridescence": {
    "enabled": true,
    "latticeSpacingNm": 420.0,
    "intensity": 0.65
  }
}
```

### 4.3 `src/palettes/PaletteManager.ts` (Kimmy's Swapper Module)

```typescript
export interface ColorStop {
  position: number; // [0.0, 1.0]
  hex: string;      // e.g. "#ff007f"
  role?: string;
  flatBand?: boolean;
}

export interface KimmyPalette {
  paletteId: string;
  name: string;
  agarBackground: string;
  solubleHaloColor: string;
  solubleHaloGlow: number;
  cosineGradient: {
    offset: [number, number, number];
    amplitude: [number, number, number];
    frequency: [number, number, number];
    phase: [number, number, number];
  };
  colorStops: ColorStop[];
  flatColorSettings: {
    enabled: boolean;
    bandCount: number;
    edgeSharpness: number; // 0.0 = smooth gradient, 1.0 = razor-sharp flat color
    preservePBRSpecular: boolean;
    preserveSubsurfaceGlow: boolean;
  };
  iridescence: {
    enabled: boolean;
    latticeSpacingNm: number;
    intensity: number;
  };
}

export class PaletteManager {
  private gl: WebGL2RenderingContext;
  private lutTexture: WebGLTexture;
  private lutWidth = 512;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error("Failed to allocate 1D Palette LUT texture");
    this.lutTexture = tex;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  /**
   * Builds a 512x1 RGBA8 texture from Kimmy's colorStops.
   * Channel RGB = Color, Channel A = Flat-band flag (255 = snap to flat color, 0 = smooth).
   */
  public applyPalette(palette: KimmyPalette): WebGLTexture {
    const { gl, lutWidth } = this;
    const data = new Uint8Array(lutWidth * 4);
    const stops = [...palette.colorStops].sort((a, b) => a.position - b.position);

    for (let i = 0; i < lutWidth; i++) {
      const t = i / (lutWidth - 1);
      let left = stops[0];
      let right = stops[stops.length - 1];

      for (let s = 0; s < stops.length - 1; s++) {
        if (t >= stops[s].position && t <= stops[s + 1].position) {
          left = stops[s];
          right = stops[s + 1];
          break;
        }
      }

      const span = Math.max(0.0001, right.position - left.position);
      const localT = Math.min(1.0, Math.max(0.0, (t - left.position) / span));

      // If left stop is marked as a flatBand, hold its exact flat color across the band
      const mixFactor = left.flatBand
        ? Math.pow(localT, 1.0 / Math.max(0.01, 1.0 - palette.flatColorSettings.edgeSharpness))
        : localT;

      const rgbL = this.hexToRgb(left.hex);
      const rgbR = this.hexToRgb(right.hex);

      const idx = i * 4;
      data[idx + 0] = Math.round(rgbL[0] + (rgbR[0] - rgbL[0]) * mixFactor);
      data[idx + 1] = Math.round(rgbL[1] + (rgbR[1] - rgbL[1]) * mixFactor);
      data[idx + 2] = Math.round(rgbL[2] + (rgbR[2] - rgbL[2]) * mixFactor);
      data[idx + 3] = left.flatBand ? 255 : 0;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.lutTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, lutWidth, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return this.lutTexture;
  }
}
```

---

## 5. Core Shader Snippets

### 5.1 `src/shaders/simulation.frag.glsl`
This fragment shader runs the coupled **Reaction-Diffusion + Nonlinear Lubricating Growth + Chemotaxis + 3D Biofilm Buckling** equations on the GPU.

```glsl
#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_state;

uniform sampler2D u_stateTex;     // R: Active Bacteria (b), G: Nutrient (n), B: Chemo/Lubricant (c), A: Elevation/Biofilm (h)
uniform vec2 u_resolution;
uniform float u_dt;
uniform float u_time;

// Biophysical parameters (driven by Species Preset & Timeline)
uniform float u_Db0;              // Base bacterial motility / agar softness
uniform float u_Dn;               // Nutrient diffusivity
uniform float u_Dc;               // Chemoattractant / surfactant diffusivity
uniform float u_nonlinearExp;     // Nonlinear lubricating exponent k (e.g. 1.0 for branching, 0.0 for disk)
uniform float u_growthRate;       // Maximal growth rate kappa_g
uniform float u_consumptionRate;  // Nutrient uptake rate gamma_n
uniform float u_inactivationRate; // Sporulation / transition to stationary elevation (mu)
uniform float u_chemotaxisChi;    // Keller-Segel chemotactic sensitivity
uniform float u_chiralAngle;      // Chiral branch twist angle (radians)
uniform float u_buckleStrength;   // 3D mechanical wrinkling instability strength

// Quenched agar substrate heterogeneity noise
float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 center = texture(u_stateTex, v_uv);
    float b = center.r;
    float n = center.g;
    float c = center.b;
    float h = center.a;

    // Sample 8-neighborhood for 9-point isotropic Laplacian and central-difference gradients
    vec4 N  = texture(u_stateTex, v_uv + vec2( 0.0,      texel.y));
    vec4 S  = texture(u_stateTex, v_uv + vec2( 0.0,     -texel.y));
    vec4 E  = texture(u_stateTex, v_uv + vec2( texel.x,  0.0));
    vec4 W  = texture(u_stateTex, v_uv + vec2(-texel.x,  0.0));
    vec4 NE = texture(u_stateTex, v_uv + vec2( texel.x,  texel.y));
    vec4 NW = texture(u_stateTex, v_uv + vec2(-texel.x,  texel.y));
    vec4 SE = texture(u_stateTex, v_uv + vec2( texel.x, -texel.y));
    vec4 SW = texture(u_stateTex, v_uv + vec2(-texel.x, -texel.y));

    vec4 laplacian = -1.0 * center
                   + 0.20 * (N + S + E + W)
                   + 0.05 * (NE + NW + SE + SW);

    vec2 gradB = 0.5 * vec2(E.r - W.r, N.r - S.r);
    vec2 gradC = 0.5 * vec2(E.b - W.b, N.b - S.b);
    vec2 gradH = 0.5 * vec2(E.a - W.a, N.a - S.a);

    // 1. Quenched agar roughness (triggers natural tip-splitting in DLA / DBM regimes)
    float agarNoise = 0.85 + 0.30 * hash21(floor(v_uv * u_resolution * 0.5));

    // 2. Ben-Jacob Nonlinear Lubricating Diffusivity: D_b(b, n) = D_b0 * b^k * n
    float nonlinearB = pow(max(b, 0.0001), u_nonlinearExp);
    float Db_local = u_Db0 * nonlinearB * clamp(n + 0.15, 0.0, 1.0) * agarNoise;

    // 3. Chiral flux rotation (for Paenibacillus dendritiformis curling branches)
    float cosA = cos(u_chiralAngle);
    float sinA = sin(u_chiralAngle);
    vec2 rotatedGradB = mat2(cosA, -sinA, sinA, cosA) * gradB;
    float chiralTerm = dot(rotatedGradB, gradC) * 0.35;

    // 4. Keller-Segel Chemotaxis: div(chi(b) * grad(c))
    float chemoTerm = u_chemotaxisChi * (b * (1.0 - b) * laplacian.b + dot(gradB, gradC));

    // 5. Michaelis-Menten nutrient uptake f(n) = n / (c_half + n)
    float f_n = n / (0.18 + n);
    float division = u_growthRate * b * f_n;
    float sporulation = u_inactivationRate * b / (1.0 + 3.0 * n);

    // 6. 3D Biofilm Mechanical Buckling & KPZ Lateral Growth
    // When colony biomass h builds up and interior nutrients drop, radial/wrinkle waves form
    float wrinkleWave = sin(h * 18.0 - length(gradH) * 25.0) * b * (1.0 - n);
    float kpzLateral = 0.45 * dot(gradH, gradH);

    // Integrate coupled PDEs
    float db = (Db_local * laplacian.r) + chiralTerm - chemoTerm + division - sporulation;
    float dn = (u_Dn * laplacian.g) - (u_consumptionRate * division);
    float dc = (u_Dc * laplacian.b) + 0.12 * b - 0.06 * c;
    float dh = sporulation + kpzLateral + (0.04 * laplacian.a) + (u_buckleStrength * wrinkleWave);

    out_state = vec4(
        clamp(b + u_dt * db, 0.0, 1.5),
        clamp(n + u_dt * dn, 0.0, 1.0),
        clamp(c + u_dt * dc, 0.0, 1.5),
        clamp(h + u_dt * dh, 0.0, 3.0)
    );
}
```

### 5.2 `src/shaders/pbr_psychedelic.frag.glsl`
This shader blends **Ultra-HD PBR Biofilm Texturing** (micro-domain normals, subsurface scattering, mucoid clearcoat, and *Flavobacterium* photonic-crystal iridescence) with **Kimmy's Swappable Palette & Flat Color Posterization**.

```glsl
#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_stateTex;       // (b, n, c, h)
uniform sampler2D u_paletteLUT;     // Kimmy's 512x1 RGBA LUT (RGB = color, A = flatBand mask)
uniform vec2 u_resolution;
uniform float u_time;

// Psychedelic & Palette Uniforms
uniform vec3 u_agarColor;
uniform vec3 u_solubleHaloColor;
uniform float u_solubleHaloGlow;
uniform bool u_flatColorsEnabled;
uniform float u_flatBandCount;
uniform float u_flatEdgeSharpness;
uniform bool u_preservePBR;

// PBR & Structural Iridescence Uniforms
uniform float u_mucoidWetness;      // 0.0 = dry/friable (Streptomyces), 1.0 = ultra-glossy mucoid (Klebsiella)
uniform float u_sssIntensity;       // Subsurface scattering translucency
uniform float u_iridescenceStrength;// Flavobacterium IR1 photonic crystal strength
uniform float u_latticeNm;          // Nanometer cell spacing (380 - 620 nm)

// Procedural micro-nematic rod texture (simulates aligned bacterial cell domains at high zoom)
float nematicMicroDomains(vec2 uv, vec2 flowDir) {
    vec2 p = uv * u_resolution * 0.35;
    float angle = atan(flowDir.y, flowDir.x);
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    p = rot * p;
    return 0.5 + 0.5 * sin(p.x * 3.5 + sin(p.y * 1.2) * 2.0);
}

// Thin-film / Photonic Crystal structural color (Flavobacterium IR1 model)
vec3 structuralIridescence(float cosTheta, float latticeNm) {
    // Optical path difference phase shift across R, G, B wavelengths
    vec3 wavelengths = vec3(650.0, 530.0, 450.0);
    vec3 phase = 2.0 * 3.14159265 * (latticeNm * cosTheta) / wavelengths;
    return 0.5 + 0.5 * cos(phase);
}

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec4 state = texture(u_stateTex, v_uv);
    float b = state.r; // Active front
    float n = state.g; // Nutrient remaining
    float c = state.b; // Lubricant / chemoattractant
    float h = state.a; // 3D Colony elevation

    float totalBiomass = clamp(b * 0.85 + h * 0.65, 0.0, 1.0);

    // 1. Reconstruct Ultra-HD Surface Normal from Elevation (h) + Active Front (b) + Nematic Micro-Domains
    float hE = texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).a + texture(u_stateTex, v_uv + vec2( texel.x, 0.0)).r * 0.5;
    float hW = texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).a + texture(u_stateTex, v_uv + vec2(-texel.x, 0.0)).r * 0.5;
    float hN = texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).a + texture(u_stateTex, v_uv + vec2(0.0,  texel.y)).r * 0.5;
    float hS = texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).a + texture(u_stateTex, v_uv + vec2(0.0, -texel.y)).r * 0.5;

    vec2 macroGrad = vec2(hE - hW, hN - hS) * 18.0;
    float microRods = nematicMicroDomains(v_uv, macroGrad);
    vec3 normal = normalize(vec3(-macroGrad - (microRods - 0.5) * 0.35 * step(0.05, totalBiomass), 1.0));

    // 2. Compute Palette Lookup Index (combines elevation, active ring, and chemical phase)
    float rawIndex = clamp(h * 0.45 + b * 0.75 + 0.12 * sin(c * 6.2831), 0.0, 1.0);

    // 3. Apply Psychedelic Flat-Color Posterization if enabled
    float paletteCoord = rawIndex;
    if (u_flatColorsEnabled) {
        float scaled = rawIndex * u_flatBandCount;
        floatquantized = floor(scaled) / u_flatBandCount;
        float frac = fract(scaled);
        float aaWidth = fwidth(scaled) * 1.5;
        float edge = smoothstep(0.5 - aaWidth, 0.5 + aaWidth, frac);
        float steppedIndex = (floor(scaled) + edge) / u_flatBandCount;
        paletteCoord = mix(rawIndex, steppedIndex, u_flatEdgeSharpness);
    }

    vec4 lutSample = texture(u_paletteLUT, vec2(paletteCoord, 0.5));
    vec3 colonyAlbedo = lutSample.rgb;

    // 4. Water-Soluble Diffusible Pigment Halo (e.g., Pseudomonas pyocyanin / pyoverdin bleed into agar)
    float nutrientDepletionHalo = clamp((1.0 - n) * (1.0 - smoothstep(0.02, 0.15, totalBiomass)), 0.0, 1.0);
    vec3 agarWithHalo = mix(u_agarColor, u_solubleHaloColor * u_solubleHaloGlow, pow(nutrientDepletionHalo, 1.6));

    // 5. Physically Based Lighting (Subsurface Scattering + Mucoid Specular + Structural Iridescence)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir1 = normalize(vec3(cos(u_time * 0.3) * 0.6, sin(u_time * 0.3) * 0.6, 0.8));
    vec3 lightDir2 = normalize(vec3(-0.5, 0.4, 0.6));
    vec3 halfVec1 = normalize(lightDir1 + viewDir);

    float NdotL = max(dot(normal, lightDir1), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);

    // Subsurface Scattering (translucent glow through thin colony edges and active tips)
    float thickness = clamp(h * 0.8 + 0.1, 0.1, 1.0);
    float sssWrap = max(0.0, (dot(normal, lightDir1) + 0.6) / 1.6);
    vec3 sssGlow = colonyAlbedo * sssWrap * exp(-thickness * 2.2) * u_sssIntensity * (0.6 + 1.2 * b);

    // Mucoid Clearcoat Specular (Blinn-Phong / GGX approximation)
    float shininess = mix(12.0, 180.0, u_mucoidWetness);
    float spec = pow(max(dot(normal, halfVec1), 0.0), shininess) * u_mucoidWetness;
    float rimFresnel = pow(1.0 - NdotV, 3.5);

    // Flavobacterium IR1 Structural Iridescence
    vec3 iridColor = structuralIridescence(NdotV * 0.7 + 0.3 * microRods, u_latticeNm - b * 80.0);
    colonyAlbedo = mix(colonyAlbedo, iridColor, u_iridescenceStrength * (0.4 + 0.6 * rimFresnel));

    // Combine Flat Psychedelic Color with 3D PBR Shading
    vec3 shadedColony = colonyAlbedo * (0.28 + 0.72 * NdotL) + sssGlow + vec3(1.0, 0.98, 0.95) * spec * 0.9;
    vec3 finalColony = u_preservePBR ? shadedColony : colonyAlbedo;

    // Anti-aliased colony margin mask
    float colonyMask = smoothstep(0.015, 0.045, totalBiomass);
    vec3 finalRGB = mix(agarWithHalo, finalColony, colonyMask);

    out_color = vec4(finalRGB, 1.0);
}
```

---

## 6. Recommended Roadmap to Get the Repo Rolling

1. **Commit this `README.md` & Folder Skeleton**: Initialize your `bacterial` repository with Vite + TypeScript so you and Kimmy have a clean module boundary right away.
2. **Hook Up Kimmy's Live Palette Dropzone**: Add a simple drag-and-drop listener on the window that parses any `.json` matching `kimmy_palette_schema.json` and calls `paletteManager.applyPalette(json)`—giving instant hot-reloading of flat and gradient palettes without restarting the bacterial growth timeline.
3. **Wire the Timeline Scrubbing Bar**: Use the 4-channel state buffer to cache snapshots every $N$ simulation steps so users can scrub backward and forward across the 65-hour growth timeline while swapping palettes and toggling between **Pure PBR Microscopy** and **Flat Psychedelic Poster Art**.