import React from "react";

const mapStyles = {
  height: "calc(100vh - 64px - 78px - 62px)",
  overflow: "none",
  position: "relative",
  width: "100%",
};

const Map = React.forwardRef(function Map({ children }, ref) {
  return (
    <section id="public-map" ref={ref} style={mapStyles}>
      {children}
    </section>
  );
});

export default Map;
