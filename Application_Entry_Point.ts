/**
 * ============================================================================
 * BACTERIAL TABULA — MAIN ENTRY POINT
 * ============================================================================
 * Orchestrates the WebGL2 context, Simulation Engine, PBR Rendering, and User 
 * Interaction. This acts as the bridge connecting the biophysical presets 
 * to the GPU pipeline.
 * ============================================================================
 */

import { SimulationEngine } from './core/SimulationEngine';
import { PetriDishInoculator } from './core/PetriDishInoculator';
import { MacroLensPostProcessor } from './core/MacroLensPostProcessor';
import { TimelineDirector } from './core/TimelineDirector';
import { PaletteManager, KIMMY_PRESETS } from './taxonomy/08_KimmyPsychedelicPalettePack';

// Example: Importing Group 03 (Chromogenic Domes) as our starter configuration
import { 
  CHROMOGENIC_SPECIES_PRESETS, 
  CHROMOGENIC_DOME_SIM_GLSL, 
  CHROMOGENIC_PBR_TEXTURE_GLSL,
  bindChromogenicPresetUniforms
} from './taxonomy/03_ChromogenicInsolubleDomes';

class BacterialApp {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  
  // Core Engines
  private simEngine!: SimulationEngine;
  private inoculator!: PetriDishInoculator;
  private postProcessor!: MacroLensPostProcessor;
  private paletteManager!: PaletteManager;
  private timeline!: TimelineDirector;

  // Shaders
  private simProgram!: WebGLProgram;
  private renderProgram!: WebGLProgram;

  // Render Target for Post-Processing
  private pbrFramebuffer!: WebGLFramebuffer;
  private pbrTexture!: WebGLTexture;

  // Screen/Sim Dimensions
  private simWidth = 1024;
  private simHeight = 1024;

  // Interaction State
  private isPointerDown = false;
  private pointerX = 0;
  private pointerY = 0;

  // Timing
  private lastTime = 0;
  private pdeSubsteps = 8; // Multiple small steps per frame keeps PDE math stable

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
    // Request WebGL2 with a high-performance profile
    this.gl = this.canvas.getContext('webgl2', { 
      antialias: false, // We handle AA in post-processing
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    })!;

    if (!this.gl) {
      throw new Error("WebGL2 not supported. Please use a modern browser.");
    }

    this.init();
    this.setupEvents();
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  private init() {
    // 1. Initialize Engines
    this.simEngine = new SimulationEngine(this.gl, this.simWidth, this.simHeight);
    
    // Share the fullscreen quad VAO from the SimEngine with the Inoculator
    const sharedQuadVAO = (this.simEngine as any).quadVAO; 
    this.inoculator = new PetriDishInoculator(this.gl, sharedQuadVAO);
    this.postProcessor = new MacroLensPostProcessor(this.gl);
    this.paletteManager = new PaletteManager(this.gl);
    this.timeline = new TimelineDirector();

    // 2. Compile Core Shaders (Using Group 03 as default)
    this.simProgram = this.compileShader(this.getPassthroughVS(), CHROMOGENIC_DOME_SIM_GLSL);
    this.renderProgram = this.compileShader(this.getPassthroughVS(), CHROMOGENIC_PBR_TEXTURE_GLSL);

    // 3. Setup PBR Render Target (We render PBR here first, then send to Post-Processor)
    this.pbrTexture = this.gl.createTexture()!;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pbrTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, this.simWidth, this.simHeight, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    
    this.pbrFramebuffer = this.gl.createFramebuffer()!;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pbrFramebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.pbrTexture, 0);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    // 4. Load initial Kimmy Palette
    this.paletteManager.applyPalette(KIMMY_PRESETS.vaporwave_bioluminescence);
  }

  private compileShader(vsSource: string, fsSource: string): WebGLProgram {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.error("VS Error:", gl.getShaderInfoLog(vs));

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.error("FS Error:", gl.getShaderInfoLog(fs));

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error("Link Error:", gl.getProgramInfoLog(prog));

    return prog;
  }

  private getPassthroughVS(): string {
    return `#version 300 es
    layout(location = 0) in vec2 a_position;
    out vec2 v_uv;
    void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }`;
  }

  private setupEvents() {
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      // Map screen coordinates to simulation texture coordinates
      this.pointerX = ((clientX - rect.left) / rect.width) * this.simWidth;
      this.pointerY = ((clientY - rect.top) / rect.height) * this.simHeight;
    };

    this.canvas.addEventListener('mousedown', (e) => { this.isPointerDown = true; handlePointer(e); });
    this.canvas.addEventListener('mousemove', (e) => { if (this.isPointerDown) handlePointer(e); });
    this.canvas.addEventListener('mouseup', () => { this.isPointerDown = false; });
    this.canvas.addEventListener('mouseleave', () => { this.isPointerDown = false; });
    
    this.canvas.addEventListener('touchstart', (e) => { this.isPointerDown = true; handlePointer(e); }, { passive: true });
    this.canvas.addEventListener('touchmove', (e) => { if (this.isPointerDown) handlePointer(e); }, { passive: true });
    this.canvas.addEventListener('touchend', () => { this.isPointerDown = false; });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private renderLoop(time: number) {
    const dtSeconds = Math.min((time - this.lastTime) / 1000.0, 0.033); // Cap at ~30fps equivalent to prevent spiral of death
    this.lastTime = time;
    const timeSec = time * 0.001;

    // 1. Advance Biological Timeline
    this.timeline.update(dtSeconds);

    // 2. Handle User Inoculation (Painting bacteria onto the dish)
    if (this.isPointerDown) {
      const targetFBO = this.simEngine.getWriteFramebuffer();
      this.inoculator.inoculate(targetFBO, this.pointerX, this.pointerY, this.simWidth, this.simHeight);
    }

    // 3. Bind biological parameters and run PDE simulation steps
    const activePreset = CHROMOGENIC_SPECIES_PRESETS.chromobacterium_violaceum_pulvinate;
    bindChromogenicPresetUniforms(this.gl, this.simProgram, this.renderProgram, activePreset);
    
    // Inject Timeline Multipliers (e.g. scale quorum-sensing by age)
    this.gl.useProgram(this.simProgram);
    this.gl.uniform1f(this.gl.getUniformLocation(this.simProgram, "u_qsSecretionAlpha"), 
      activePreset.math.qsSecretionAlpha * this.timeline.getChromogenesisMultiplier());

    // Reaction-Diffusion math requires small delta-times to remain stable
    const simDt = 0.015; 
    for (let i = 0; i < this.pdeSubsteps; i++) {
      this.simEngine.step(this.simProgram, simDt, timeSec);
    }

    // 4. Render PBR Layer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pbrFramebuffer);
    this.gl.viewport(0, 0, this.simWidth, this.simHeight);
    
    this.gl.useProgram(this.renderProgram);
    
    // Bind Sim State Texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.simEngine.getCurrentStateTexture());
    this.gl.uniform1i(this.gl.getUniformLocation(this.renderProgram, "u_stateTex"), 0);

    // Bind Kimmy's Custom LUT
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.paletteManager.getTexture());
    this.gl.uniform1i(this.gl.getUniformLocation(this.renderProgram, "u_kimmyLutTex"), 1);
    this.gl.uniform1i(this.gl.getUniformLocation(this.renderProgram, "u_useKimmyLut"), 1); // 1 = true

    this.gl.uniform2f(this.gl.getUniformLocation(this.renderProgram, "u_resolution"), this.simWidth, this.simHeight);
    this.gl.uniform1f(this.gl.getUniformLocation(this.renderProgram, "u_time"), timeSec);

    const quadVAO = (this.simEngine as any).quadVAO;
    this.gl.bindVertexArray(quadVAO);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // 5. Macro Lens Post-Processing (Renders to Screen)
    this.postProcessor.render(quadVAO, this.pbrTexture, this.canvas.width, this.canvas.height, timeSec);

    requestAnimationFrame(this.renderLoop.bind(this));
  }
}

// Bootstrap the application when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Assumes you have a <canvas id="bacterial-canvas"></canvas> in your index.html
  new BacterialApp('bacterial-canvas');
});