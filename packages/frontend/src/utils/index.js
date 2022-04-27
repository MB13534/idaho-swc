import copy from "copy-to-clipboard";
import Papa from "papaparse";
import moment from "moment";
import React from "react";
import styled from "styled-components/macro";
import { Chip as MuiChip, darken, lighten } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import html2canvas from "html2canvas";
import { add } from "date-fns";

export const scrollWindowToTop = (smooth = true) => {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
};

/**
 * Utility function used to implement
 * copy to clipboard functionality
 * @param {array} data
 * @param {array} columns
 * @param {function} callback
 */
export const copyToClipboard = (data, columns, callback) => {
  const columnOrder = columns.map((d) => d.field);
  copy(
    Papa.unparse(data, {
      delimiter: "\t",
      columns: columnOrder,
    }),
    {
      format: "text/plain",
    }
  );
  callback();
};

/**
 * Utility method for extracting the date in "YYYY-MM-DD" format
 * Ideal for extracting the date for a Material-UI date picker
 * @param {*} date
 */
export const extractDate = (date) => {
  if (date) {
    const properDate = new Date(date);
    const year = properDate.getFullYear();
    const month =
      properDate.getMonth() + 1 < 10
        ? `0${properDate.getMonth() + 1}`
        : properDate.getMonth() + 1;
    const day =
      properDate.getDate() < 10
        ? `0${properDate.getDate()}`
        : properDate.getDate();
    return `${year}-${month}-${day}`;
  }
  return "";
};

export const formatBooleanTrueFalse = (value) => {
  if (typeof value !== "boolean") {
    return value;
  }
  if (value === true) {
    return "Yes";
  }
  return "No";
};

export const downloadChartImage = (title, extension, ref) => {
  const base64 = ref.current.toBase64Image();
  const downloadLink = document.createElement("a");
  downloadLink.href = base64;
  downloadLink.download = `${title} ${dateFormatter(
    new Date(),
    "MM/DD/YYYY, h:mm A"
  )}.${extension}`;
  downloadLink.click();
};

export const downloadRef = (title, extension, ref) => {
  html2canvas(ref.current).then(function (canvas) {
    let link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = canvas.toDataURL();
      link.download = `${title} ${dateFormatter(
        new Date(),
        "MM/DD/YYYY, h:mm A"
      )}.${extension}`;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(link.href);
    }
  });
};

// const saveAs = (uri, filename) => {
//   let link = document.createElement("a");
//
//   if (typeof link.download === "string") {
//     link.href = uri;
//     link.download = filename;
//
//     //Firefox requires the link to be in the body
//     document.body.appendChild(link);
//
//     //simulate click
//     link.click();
//
//     //remove the link when done
//     document.body.removeChild(link);
//   } else {
//     window.open(uri);
//   }
// };
//
// export const handleDownloadDiv = (newSaveRef) => {
//   html2canvas(newSaveRef.current).then((canvas) => {
//     saveAs(canvas.toDataURL(), "file-name.png");
//   });
// };

export const lineColors = {
  red: "#e6194b",
  green: "#3cb44b",
  orange: "#f58231",
  blue: "#4363d8",
  purple: "#911eb4",
  cyan: "#2CF5F7",
  pink: "#f032e6",
  yellow: "#ffe119",
  neon: "#bcf60c",
  peach: "#fabebe",
  aqua: "#008080",
  lavender: "#e6beff",
  brown: "#9a6324",
  cream: "#fffac8",
  maroon: "#800000",
  turquoise: "#aaffc3",
  olive: "#808000",
  tan: "#ffd8b1",
  royalBlue: "#000075",

  lightenRed: lighten("#e6194b", 0.5),
  lightenGreen: lighten("#3cb44b", 0.5),
  lightenOrange: lighten("#f58231", 0.5),
  lightenBlue: lighten("#4363d8", 0.5),
  lightenPurple: lighten("#911eb4", 0.5),
  lightenCyan: lighten("#2CF5F7", 0.5),
  lightenPink: lighten("#f032e6", 0.5),
  lightenYellow: lighten("#ffe119", 0.5),
  lightenNeon: lighten("#bcf60c", 0.5),
  lightenPeach: lighten("#fabebe", 0.5),
  lightenAqua: lighten("#008080", 0.5),
  lightenLavender: lighten("#e6beff", 0.5),
  lightenBrown: lighten("#9a6324", 0.5),
  lightenCream: lighten("#fffac8", 0.5),
  lightenMaroon: lighten("#800000", 0.5),
  lightenTurquoise: lighten("#aaffc3", 0.5),
  lightenOlive: lighten("#808000", 0.5),
  lightenTan: lighten("#ffd8b1", 0.5),
  lightenRoyalBlue: lighten("#000075", 0.5),

  darkenRed: darken("#e6194b", 0.5),
  darkenGreen: darken("#3cb44b", 0.5),
  darkenOrange: darken("#f58231", 0.5),
  darkenBlue: darken("#4363d8", 0.5),
  darkenPurple: darken("#911eb4", 0.5),
  darkenCyan: darken("#2CF5F7", 0.5),
  darkenPink: darken("#f032e6", 0.5),
  darkenYellow: darken("#ffe119", 0.5),
  darkenNeon: darken("#bcf60c", 0.5),
  darkenPeach: darken("#fabebe", 0.5),
  darkenAqua: darken("#008080", 0.5),
  darkenLavender: darken("#e6beff", 0.5),
  darkenBrown: darken("#9a6324", 0.5),
  darkenCream: darken("#fffac8", 0.5),
  darkenMaroon: darken("#800000", 0.5),
  darkenTurquoise: darken("#aaffc3", 0.5),
  darkenOlive: darken("#808000", 0.5),
  darkenTan: darken("#ffd8b1", 0.5),
  darkenRoyalBlue: darken("#000075", 0.5),

  lightBlue: "#74E0FF",
  gray: "#8D9093",
  lightGray: "#eee",
  darkGray: "#222",
  white: "#fff",
  black: "#000000",
};

export const dateFormatter = (date, format) => {
  return moment(date).format(format);
};

export const renderStatusChip = (status, colors) => {
  const Chip = styled(MuiChip)`
    ${spacing}
    height: 20px;
    margin-top: 1px;
    margin-bottom: 1px;
    padding: 4px 0;
    font-size: 90%;
    background-color: ${(props) => props.rgbcolor};
    color: ${(props) => props.theme.palette.common.white};
  `;

  return typeof status === "string" ? (
    status.split(",").map((word, i) => {
      let wordColor;
      if (!isNaN(new Date(word.split(" ")[1]).getTime())) {
        wordColor = new Date(word.split(" ")[1]) - new Date() < 2592000000;
      } else {
        wordColor = word.split(" ")[0];
      }
      return <Chip label={word} rgbcolor={colors[wordColor]} key={i} mr={1} />;
    })
  ) : (
    <Chip label="Unavailable" rgbcolor={lineColors.orange} />
  );
};

// export const filterDataByUser = (data, user) => {
//   return data
//     ? data.filter((item) => !item.exclude_auth0_user_id.includes(user?.sub))
//     : [];
// };

export const groupByValue = (array, key) => {
  return Object.values(
    array.reduce((acc, curr) => {
      if (!acc[curr[key]]) acc[curr[key]] = [];
      acc[curr[key]].push(curr);
      return acc;
    }, {})
  );
};

export const applyInflectorOverrides = (str) => {
  const myStr = str ? str : "";
  return myStr.replace("Curf", "Curve");
};

export const firstOfYear = new Date(new Date().getFullYear(), 0, 1);

export const lastOfJanuary = new Date(new Date().getFullYear(), 1, 0);

export const lastOfCurrentMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
);

export const lastOfYear = new Date(new Date().getFullYear(), 11, 31);

export const oneYearAgo = add(new Date(), { years: -1 });

export const oneWeekAgo = add(new Date(), { weeks: -1 });

export const filterDataForWellOwner = (data, user) => {
  return data
    ? data.filter((item) => item.authorized_users?.includes(user?.sub))
    : [];
};

export const isTouchScreenDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints ||
    navigator.msMaxTouchPoints
  );
};

export const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
