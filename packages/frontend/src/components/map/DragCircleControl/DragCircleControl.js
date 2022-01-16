// Control implemented as ES6 class

class DragCircleControl {
  constructor(draw) {
    this.draw = draw;
  }
  onAdd() {
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    const icon = document.createElement("button");
    icon.type = "button";
    icon.className = "material-icons";
    icon.style.verticalAlign = "middle";
    icon.style.cursor = "pointer";
    icon.textContent = "trip_origin";
    this._container.appendChild(icon);
    this._container.addEventListener("click", () => {
      this.draw.changeMode("draw_circle");
    });
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}

export default DragCircleControl;
