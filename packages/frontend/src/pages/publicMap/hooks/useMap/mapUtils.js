/**
 * Utility that can be used to log out map events
 * Useful for debugging and getting visibility into different
 * parts of the map lifecycle
 */
class MapLogger {
  constructor({ enabled = false, prefix }) {
    this.prefix = prefix;
    this.enabled = enabled;
  }

  log(event) {
    if (this.enabled) {
      console.log(`${this.prefix} - ${event}`);
    }
  }
}

export { MapLogger };
