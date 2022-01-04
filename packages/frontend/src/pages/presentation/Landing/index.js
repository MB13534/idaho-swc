import React from "react";

import styled from "styled-components/macro";

import AppBar from "./AppBar";
import Introduction from "./Introduction";
import JoinUs from "./JoinUs";
import Footer from "../../../components/Footer";

const FillContainer = styled.div`
  height: calc(100vh - 450px - 356px - 60px);
  // min-height: 200px;
`;

function Presentation() {
  return (
    <React.Fragment>
      <AppBar />
      <Introduction />
      <JoinUs />
      <FillContainer />
      <Footer />
    </React.Fragment>
  );
}

export default Presentation;
