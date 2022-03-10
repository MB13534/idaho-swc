import React, { useEffect, useState } from "react";
// import "./styles.css";
import parse from "html-react-parser";
import styled from "styled-components/macro";
import { isNullOrUndef } from "chart.js/helpers";
import { formatBooleanTrueFalse } from "../../../utils";
import Button from "@material-ui/core/Button";
import { Pagination } from "@material-ui/lab";
import { titleize } from "inflected";

const PopupWrap = styled.div`
  height: 200px;
  overflow-y: scroll;
  width: 380px;
`;

const PopupTable = styled.table`
  border-radius: 5px;
  border-collapse: collapse;
  border: 1px solid #ccc;
  width: 100%;
`;

const PopupRow = styled.tr`
  border-radius: 5px;
  &:nth-child(even) {
    background-color: #eee;
  }
`;

const PopupCell = styled.td`
  padding: 3px 6px;
  margin: 0;
`;

const PopupUl = styled.ul`
  list-style-type: none;
  margin: 0 !important;
  padding: 3px 0;
`;

const Popup = ({
  setDataVizVisible,
  setDataVizWellNumber,
  setDataVizGraphType,
  features,
  layers,
}) => {
  const dataVizTypes = {
    count_production: "Production Graph",
    count_waterlevels: "Water Levels Graph",
    count_wqdata: "Water Quality Graph",
  };

  function getUniqueFeatures(array, comparatorProperty1, comparatorProperty2) {
    const existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    //concat two ids to make a unique id
    return array.filter((el) => {
      if (
        existingFeatureKeys[
          el[comparatorProperty1] + el.layer[comparatorProperty2]
        ]
      ) {
        return false;
      } else {
        existingFeatureKeys[
          el[comparatorProperty1] + el.layer[comparatorProperty2]
        ] = true;
        return true;
      }
    });
  }

  const uniqueFeatures = getUniqueFeatures(features, "id", "id");

  const [page, setPage] = useState(1);
  const [feature, setFeature] = useState(uniqueFeatures?.[0]);
  const [excludeFields, setExcludeFields] = useState([]);

  const handlePageChange = (e, p) => {
    setPage(p);
  };

  useEffect(() => {
    if (uniqueFeatures?.length) {
      setFeature(uniqueFeatures[page - 1]);
    }
  }, [uniqueFeatures, page]);

  useEffect(() => {
    const excludedFields = layers?.find(
      (layer) => layer?.id === feature?.layer?.id
    )?.lreProperties?.popup?.excludeFields;
    setExcludeFields(excludedFields || []);
  }, [feature, layers]);

  const addViewDataVizButtons = (key, value) => {
    if (value && Object.keys(dataVizTypes).includes(key)) {
      return (
        <>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {value + " "}
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                setDataVizVisible(true);
                setDataVizWellNumber(feature.properties.cuwcd_well_number);
                setDataVizGraphType(key);
              }}
            >
              {dataVizTypes[key]}
            </Button>
          </span>
        </>
      );
    }
    return value;
  };

  const popupData = excludeFields
    ? Object.entries(feature?.properties).reduce((acc, [key, value]) => {
        //MJB also removing entry if the value is an empty string, null, or undefined
        if (
          !excludeFields.includes(key) &&
          value !== "" &&
          !isNullOrUndef(value)
        ) {
          acc.push([key, value]);
        }
        return acc;
      }, [])
    : Object.entries(feature?.properties);
  if (!popupData) return null;
  return (
    <>
      <h2>{titleize(feature?.layer?.id)}</h2>
      <PopupWrap>
        <PopupTable>
          <tbody>
            {popupData?.map(([key, value]) => {
              return (
                <PopupRow key={key}>
                  <PopupCell>{titleize(key)}</PopupCell>
                  <PopupCell>
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
                    ) : typeof value === "string" && value.startsWith("<a ") ? (
                      <PopupUl>
                        {value.split(",").map((item) => (
                          <li key={item}>{parse(item)}</li>
                        ))}
                      </PopupUl>
                    ) : (
                      formatBooleanTrueFalse(addViewDataVizButtons(key, value))
                    )}
                  </PopupCell>
                </PopupRow>
              );
            })}
          </tbody>
        </PopupTable>
      </PopupWrap>
      <Pagination
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
        count={uniqueFeatures.length}
        size="medium"
        page={page}
        variant="outlined"
        shape="rounded"
        color="primary"
        onChange={handlePageChange}
      />
    </>
  );
};

export default Popup;
