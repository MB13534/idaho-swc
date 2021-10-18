import React from "react";
import styled from "styled-components/macro";

import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Base = styled(SyntaxHighlighter)`
  border-radius: 3px;
  padding: ${(props) => props.theme.spacing(3)}px !important;
  background-color: ${(props) => props.theme.sidebar.background} !important;
`;

const Code = ({ children }) => {
  return (
    <Base language="javascript" style={darcula}>
      {children}
    </Base>
  );
};

export default Code;
