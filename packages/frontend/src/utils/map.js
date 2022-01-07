import area from "@turf/area";
import { lineColors } from "./index";

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const getElevation = async (long, lat) => {
  // Construct the API request.
  const query = await fetch(
    `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${long},${lat}.json?layers=contour&limit=50&access_token=${mapboxToken}`,
    { method: "GET" }
  );
  if (query.status !== 200) return;
  const data = await query.json();

  const allFeatures = data.features;

  const elevations = allFeatures.map((feature) => feature.properties.ele);

  return Math.max(...elevations) * 3.28084;
};

export const handleCopyCoords = (value) => {
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = value;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

export const DUMMY_BASEMAP_LAYERS = [
  { url: "streets-v11", icon: "commute" },
  { url: "outdoors-v11", icon: "park" },
  { url: "satellite-streets-v11", icon: "satellite_alt" },
];

export function updateArea(
  geojson,
  type,
  polygonRef,
  radiusRef,
  pointRef,
  measurementsContainerRef,
  draw
) {
  const data = draw.getAll();
  measurementsContainerRef.current.style.display = "block";

  const answerArea = polygonRef.current;
  const answerRadius = radiusRef.current;
  const answerPoint = pointRef.current;

  if (geojson.properties.circleRadius && type !== "draw.delete") {
    const exactRadiusKm = geojson.properties.circleRadius;
    const exactRadiusFeet = exactRadiusKm * 3280.84;
    const roundedRadius = exactRadiusFeet.toFixed(2);
    answerRadius.innerHTML = roundedRadius + " ft";
  }

  if (geojson.geometry.type === "Point" && type !== "draw.delete") {
    answerPoint.innerHTML = `<strong>lat:</strong> ${geojson.geometry.coordinates[1]} <br /><strong>long:</strong> ${geojson.geometry.coordinates[0]}`;
  }

  if (
    data.features.filter((item) => item.geometry.type === "Point").length === 0
  ) {
    answerPoint.innerHTML = "--";
  }
  if (
    data.features.filter((item) => item.properties.circleRadius).length === 0
  ) {
    answerRadius.innerHTML = "--";
  }

  if (data.features.length > 0) {
    const exactAreaMeters = area(data);
    const exactAreaFeet = exactAreaMeters * 10.7639;
    const roundedArea = exactAreaFeet.toFixed(2);
    answerArea.innerHTML = roundedArea + " sq ft";
  } else {
    answerArea.innerHTML = "";
    answerRadius.innerHTML = "";
    answerPoint.innerHTML = "";
    measurementsContainerRef.current.style.display = "none";
    // if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
  }
}

export function onPointClickSetCoordinateRefs(
  coordinatesContainerRef,
  longRef,
  latRef,
  eleRef,
  featureLat,
  featureLong
) {
  coordinatesContainerRef.current.style.display = "block";
  longRef.current.innerHTML = featureLong;
  latRef.current.innerHTML = featureLat;
  (async function () {
    eleRef.current.innerHTML = await getElevation(featureLong, featureLat);
  })();
}

export const locationsLayer = {
  id: "locations",
  type: "circle",
  source: "locations",
  paint: {
    "circle-radius": 8,
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "clicked"], false],
      lineColors.yellow,
      ["boolean", ["get", "is_well_owner"], false],
      lineColors.orange,
      lineColors.lightBlue,
    ],
    "circle-stroke-width": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      2,
      1,
    ],
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      lineColors.yellow,
      "black",
    ],
  },
};

export const locationsLabelsLayer = {
  id: "locations-labels",
  type: "symbol",
  source: "locations",
  minzoom: 12,
  layout: {
    "text-field": ["get", "cuwcd_well_number"],
    "text-offset": [0, -2],
    "text-size": 14,
  },
  paint: {
    "text-halo-color": "#ffffff",
    "text-halo-width": 0.5,
  },
};

export const locationsRowTitles = {
  cuwcd_well_number: "CUWCD Well #",
  exempt: "Exempt?",
  well_name: "Well Name",
  state_well_number: "State Well #",
  well_status: "Well Status",
  source_aquifer: "Source Aquifer",
  well_depth_ft: "Well Depth (ft)",
  elevation_ftabmsl: "Elevation (ft msl)",
  screen_top_depth_ft: "Screen Top Depth (ft)",
  screen_bottom_depth_ft: "Screen Bottom Depth (ft)",
  primary_use: "Primary Use",
  secondary_use: "Secondary Use",
  agg_system_name: "Aggregation System",
  permit_number: "Permit #",
  well_owner: "Well Owner",
  well_owner_address: "Well Owner Address",
  well_owner_phone: "Well Owner Phone",
  well_owner_email: "Well Owner Email",
  well_contact: "Well Contact",
  well_contact_address: "Well Contact Address",
  well_contact_phone: "Well Contact Phone",
  well_contact_email: "Well Contact Email",
  driller: "Driller",
  date_drilled: "Date Drilled",
  drillers_log: "Drillers Log?",
  general_notes: "General Notes",
  well_remarks: "Well Remarks",
  count_production: "Count of Production Entries",
  count_waterlevels: "Count of Water Levels Entries",
  count_wqdata: "Count of WQ Data Entries",
  longitude_dd: "Longitude (dd)",
  latitude_dd: "Latitude (dd)",
  registration_notes: "Registration Notes",
  registration_date: "Registration Date",
  editor_name: "Editor",
  last_edited_date: "Last Edited Date",
  list_of_attachments: "List of Attachments",
  authorized_users: "Authorized Users",
  id: "Location ID",
  is_permitted: "Is Permitted?",
  is_exempt: "Is Exempt?",
  is_monitoring: "Is Monitoring?",
  has_production: "Has Production?",
  has_waterlevels: "Has Water Levels?",
  has_wqdata: "Has Water Quality Data?",
  well_ndx: "Location Index",
  location_geometry: "Geometry",
  is_well_owner: "Well Owner?",
  well_type: "Well Type",
  tableData: "Material Table Id",
};
