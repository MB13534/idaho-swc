// Control implemented as ES6 class
import { json } from "d3-request";

class ToggleBasemapControl {
  constructor(base, icon) {
    this.base = base;
    this.icon = icon;
  }
  onAdd(map) {
    this.styleId = this.base;
    function swapStyle(styleID) {
      var currentStyle = map.getStyle();

      json(
        `https://api.mapbox.com/styles/v1/mapbox/${styleID}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
        (newStyle) => {
          newStyle.sources = Object.assign(
            {},
            currentStyle.sources,
            newStyle.sources
          ); // ensure any sources from the current style are copied across to the new style
          var labelIndex = newStyle.layers.findIndex((el) => {
            // find the index of where to insert our layers to retain in the new style
            return el.id === "locations";
          });
          var appLayers = currentStyle.layers.filter((el) => {
            // app layers are the layers to retain, and these are any layers which  have a different source set
            return (
              el.source &&
              el.source !== "mapbox://mapbox.satellite" &&
              el.source !== "composite"
            );
          });
          appLayers.forEach((layer) => {
            newStyle.layers.splice(labelIndex, 0, layer); // inset these layers to retain into the new style
          });
          map.setStyle(newStyle); // now setStyle
        }
      );
    }

    // <button
    //   className="mapboxgl-ctrl-geolocate"
    //   type="button"
    //   title="Find my location"
    //   aria-label="Find my location"
    //   aria-pressed="false"
    // >
    //   <span className="mapboxgl-ctrl-icon" aria-hidden="true"></span>
    // </button>;

    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    const icon = document.createElement("button");
    icon.className = "material-icons";
    icon.style.verticalAlign = "middle";
    icon.style.cursor = "pointer";
    icon.textContent = this.icon;
    this._container.appendChild(icon);
    this._container.addEventListener("click", () => {
      swapStyle(this.base);
    });
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default ToggleBasemapControl;
