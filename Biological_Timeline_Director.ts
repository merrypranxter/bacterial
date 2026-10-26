/**
 * ============================================================================
 * BACTERIAL TABULA — TIMELINE DIRECTOR
 * ============================================================================
 * Real bacterial biofilms develop through distinct morphological phases:
 * 1. Monolayer expansion (0 - 12 hours)
 * 2. 3D verticalization / Dome building (12 - 24 hours)
 * 3. Maturation, Wrinkling, and Sporulation (24 - 65+ hours)
 * 
 * This class maps app time to "biological hours" and provides dynamic multipliers
 * to smoothly transition the PDE parameters between these phases.
 * ============================================================================
 */

export class TimelineDirector {
  // How many biological hours pass per real-world second of simulation
  public hoursPerSecond: number = 2.0; 
  
  // The current age of the colony in biological hours
  public biologicalAgeHours: number = 0.0;
  
  // Whether the simulation is currently running or paused
  public isPlaying: boolean = true;

  constructor() {}

  /**
   * Advances the biological clock.
   * @param dt Real-world delta time in seconds
   */
  public update(dt: number) {
    if (this.isPlaying) {
      this.biologicalAgeHours += dt * this.hoursPerSecond;
    }
  }

  /**
   * Resets the Petri dish clock back to zero.
   */
  public reset() {
    this.biologicalAgeHours = 0.0;
  }

  /**
   * 3D Mechanical Buckling / Wrinkling (Group 06) requires a dense, mature
   * biofilm. This returns a multiplier (0.0 to 1.0) that ramps up after 24 hours.
   */
  public getBucklingMultiplier(): number {
    // Starts buckling at 24 hours, reaches maximum intensity at 48 hours
    const startHour = 24.0;
    const endHour = 48.0;
    
    if (this.biologicalAgeHours <= startHour) return 0.0;
    if (this.biologicalAgeHours >= endHour) return 1.0;
    
    // Smooth hermite interpolation
    const t = (this.biologicalAgeHours - startHour) / (endHour - startHour);
    return t * t * (3.0 - 2.0 * t);
  }

  /**
   * Exudate Bead Condensation / Sporulation (Group 07) occurs under starvation stress.
   * Returns a multiplier (0.0 to 1.0) that ramps up after 16 hours.
   */
  public getSporulationMultiplier(): number {
    const startHour = 16.0;
    const endHour = 32.0;
    
    if (this.biologicalAgeHours <= startHour) return 0.0;
    if (this.biologicalAgeHours >= endHour) return 1.0;
    
    const t = (this.biologicalAgeHours - startHour) / (endHour - startHour);
    return t * t * (3.0 - 2.0 * t);
  }

  /**
   * Quorum-Sensing Pigment Production (Group 03).
   * Bacteria wait until a critical mass is reached before spending energy on pigments.
   */
  public getChromogenesisMultiplier(): number {
    const startHour = 8.0; // Pigments start showing up relatively early
    const endHour = 18.0;
    
    if (this.biologicalAgeHours <= startHour) return 0.0;
    if (this.biologicalAgeHours >= endHour) return 1.0;
    
    const t = (this.biologicalAgeHours - startHour) / (endHour - startHour);
    return t * t * (3.0 - 2.0 * t);
  }
}