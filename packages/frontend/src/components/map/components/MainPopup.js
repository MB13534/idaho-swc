import React from "react";
import styled from "styled-components/macro";

import parse from "html-react-parser";

import { formatBooleanTrueFalse } from "../../../utils";
import { isNullOrUndef } from "chart.js/helpers";
import { locationsRowTitles } from "../../../utils/map";

const PopupWrap = styled.div`
  max-height: 200px;
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

const MainPopup = ({ excludeFields, feature, currentUser }) => {
  return (
    <>
      <PopupWrap>
        <h3>Properties</h3>
        <PopupTable>
          <tbody>
            {!currentUser.isUser && (
              <PopupRow>
                <PopupCell>
                  <strong>Edit Well</strong>
                </PopupCell>
                <PopupCell>
                  <a href={`/models/dm-wells/${feature.id}`}>Link</a>
                </PopupCell>
              </PopupRow>
            )}
            {Object.entries(feature).map(([k, v]) => {
              //excludes 'excludedFields' and all values of "", null, or undefined
              if (excludeFields.includes(k) || v === "" || isNullOrUndef(v))
                return null;
              return (
                <PopupRow key={k}>
                  <PopupCell>
                    <strong>{locationsRowTitles[k]}</strong>
                  </PopupCell>
                  <PopupCell>
                    {/*parses html if value starts with <a otherwise value*/}
                    {typeof v === "string" && v.startsWith("<a ") ? (
                      <PopupUl>
                        {v.split(",").map((item) => (
                          <li key={item}>{parse(item)}</li>
                        ))}
                      </PopupUl>
                    ) : (
                      formatBooleanTrueFalse(v)
                    )}
                  </PopupCell>
                </PopupRow>
              );
            })}
          </tbody>
        </PopupTable>
      </PopupWrap>
    </>
  );
};

export default MainPopup;
