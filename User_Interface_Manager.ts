/**
 * ============================================================================
 * BACTERIAL TABULA — UI MANAGER (TWEAKPANE)
 * ============================================================================
 * A sleek, floating control panel for the app. This allows the user to
 * hot-swap Kimmy's palettes, adjust the inoculation brush, and dial in the
 * cinematic post-processing without recompiling the code.
 * ============================================================================
 */

import { Pane } from 'tweakpane';
import { KIMMY_PRESETS, KimmyPalette } from '../taxonomy/08_KimmyPsychedelicPalettePack';
import { PetriDishInoculator } from '../core/PetriDishInoculator';
import { MacroLensPostProcessor } from '../core/MacroLensPostProcessor';
import { TimelineDirector } from '../core/TimelineDirector';

export class UIManager {
  private pane: Pane;
  
  // We keep a local state object that Tweakpane binds to.
  // When these values change, Tweakpane automatically fires events.
  private state = {
    // Inoculator settings
    brushSize: 0.015,
    intensity: 0.8,
    
    // Palette selection (Defaults to vaporwave)
    activePaletteId: 'vaporwave_bioluminescence',
    
    // Post-Processing
    bloom: 0.8,
    aberration: 1.2,
    vignette: 0.6,
    grain: 0.04,

    // Timeline actions
    timeSpeed: 2.0,
  };

  constructor(
    private inoculator: PetriDishInoculator,
    private postProcessor: MacroLensPostProcessor,
    private timeline: TimelineDirector,
    private onPaletteChange: (palette: KimmyPalette) => void,
    private onClearDish: () => void
  ) {
    // Initialize the Tweakpane floating UI
    this.pane = new Pane({ title: 'BACTERIAL TABULA' });

    this.buildInoculatorControls();
    this.buildPaletteControls();
    this.buildPostProcessingControls();
    this.buildTimelineControls();
  }

  private buildInoculatorControls() {
    const folder = this.pane.addFolder({ title: 'Inoculation (Brush)', expanded: true });
    
    folder.addBinding(this.state, 'brushSize', { min: 0.001, max: 0.1, step: 0.001, label: 'Size' })
      .on('change', (ev) => { this.inoculator.brushSize = ev.value; });
      
    folder.addBinding(this.state, 'intensity', { min: 0.1, max: 5.0, step: 0.1, label: 'Density' })
      .on('change', (ev) => { this.inoculator.intensity = ev.value; });

    folder.addButton({ title: 'Sterilize Dish (Clear)' })
      .on('click', () => { this.onClearDish(); });
  }

  private buildPaletteControls() {
    const folder = this.pane.addFolder({ title: 'Kimmy\'s Palettes', expanded: true });
    
    // Dynamically build the dropdown options from the KIMMY_PRESETS object
    const paletteOptions = Object.keys(KIMMY_PRESETS).map(key => ({
      text: KIMMY_PRESETS[key].name,
      value: key
    }));

    folder.addBinding(this.state, 'activePaletteId', {
      options: paletteOptions,
      label: 'Preset'
    }).on('change', (ev) => {
      const selectedPalette = KIMMY_PRESETS[ev.value];
      if (selectedPalette) {
        this.onPaletteChange(selectedPalette);
      }
    });
  }

  private buildPostProcessingControls() {
    const folder = this.pane.addFolder({ title: 'Macro Lens (Post)', expanded: false });
    
    folder.addBinding(this.state, 'bloom', { min: 0.0, max: 3.0, label: 'Bloom' })
      .on('change', (ev) => { this.postProcessor.bloomIntensity = ev.value; });
      
    folder.addBinding(this.state, 'aberration', { min: 0.0, max: 5.0, label: 'Aberration' })
      .on('change', (ev) => { this.postProcessor.chromaticAberration = ev.value; });
      
    folder.addBinding(this.state, 'vignette', { min: 0.0, max: 1.0, label: 'Vignette' })
      .on('change', (ev) => { this.postProcessor.vignetteStrength = ev.value; });
      
    folder.addBinding(this.state, 'grain', { min: 0.0, max: 0.2, label: 'Film Grain' })
      .on('change', (ev) => { this.postProcessor.grainStrength = ev.value; });
  }

  private buildTimelineControls() {
    const folder = this.pane.addFolder({ title: 'Biology Timeline', expanded: false });
    
    folder.addBinding(this.state, 'timeSpeed', { min: 0.0, max: 10.0, label: 'Speed Multiplier' })
      .on('change', (ev) => { this.timeline.hoursPerSecond = ev.value; });
      
    folder.addButton({ title: 'Pause / Resume' })
      .on('click', () => { this.timeline.isPlaying = !this.timeline.isPlaying; });
  }
}