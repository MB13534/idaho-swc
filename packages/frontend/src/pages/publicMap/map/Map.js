import React from "react";

const Map = React.forwardRef(function Map(props, ref) {
  return (
    <div
      id="map"
      style={{ width: "100%", height: "calc(100vh - 64px)" }}
      ref={ref}
    />
  );
});

export default Map;
