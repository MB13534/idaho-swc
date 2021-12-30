import React from "react";
import { Box, Typography } from "@material-ui/core";
import "./styles.css";
import parse from "html-react-parser";

const Popup = ({ excludeFields, feature, titleField }) => {
  const popupData = excludeFields
    ? Object.entries(feature?.properties).reduce((acc, [key, value]) => {
        if (!excludeFields.includes(key)) {
          acc.push([key, value]);
        }
        return acc;
      }, [])
    : Object.entries(feature?.properties);
  if (!popupData) return null;
  return (
    <Box maxHeight={150}>
      {popupData?.map(([key, value]) => {
        return (
          <Box
            key={key}
            display="flex"
            gridColumnGap={24}
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle1">{key}</Typography>
            <Typography variant="subtitle1">
              {/*MJB temporary logic to render links
              PROP_ID from Bell CAD Parcels for external id
              list_of_attachments from Clearwater Wells to link attachments
              parse renders string html element into
              */}
              {key === "PROP_ID" ? (
                <a
                  target="_blank"
                  href={`https://esearch.bellcad.org/Property/View/${value}`}
                  rel="noreferrer"
                >
                  <>{value}</>
                </a>
              ) : key === "list_of_attachments" && value ? (
                <ul>
                  {value.split(",").map((item) => (
                    <li key={item}>{parse(item)}</li>
                  ))}
                </ul>
              ) : (
                <>{value}</>
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Popup;
