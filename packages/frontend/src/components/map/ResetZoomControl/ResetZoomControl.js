// Control implemented as ES6 class
import { DEFAULT_MAP_CENTER } from "../../../pages/publicMap/constants";

class ResetZoomControl {
  onAdd(map) {
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    const icon = document.createElement("button");
    icon.type = "button";
    icon.className = "material-icons";
    icon.style.verticalAlign = "middle";
    icon.style.cursor = "pointer";
    icon.textContent = "explore";
    this._container.appendChild(icon);
    this._container.addEventListener("click", () => {
      map.flyTo({
        center: DEFAULT_MAP_CENTER,
        zoom: 7,
        padding: { bottom: 0 },
      });
    });
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}

export default ResetZoomControl;
