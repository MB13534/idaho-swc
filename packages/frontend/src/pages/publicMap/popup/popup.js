import React from "react";
// import "./styles.css";
import parse from "html-react-parser";
import styled from "styled-components/macro";
import { isNullOrUndef } from "chart.js/helpers";
import { formatBooleanTrueFalse } from "../../../utils";

const PopupWrap = styled.div`
  max-height: 250px;
  overflow-y: scroll;
`;

const PopupTable = styled.table`
  border-radius: 5px;
  border-collapse: collapse;
  border: 1px solid #ccc;
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

const Popup = ({ excludeFields, feature, titleField }) => {
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
    <PopupWrap>
      <h3>Properties</h3>
      <PopupTable>
        <tbody>
          {popupData?.map(([key, value]) => {
            return (
              <PopupRow key={key}>
                <PopupCell>{key}</PopupCell>
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
                    formatBooleanTrueFalse(value)
                  )}
                </PopupCell>
              </PopupRow>
            );
          })}
        </tbody>
      </PopupTable>
    </PopupWrap>
  );
};

export default Popup;
