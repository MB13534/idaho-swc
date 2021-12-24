import { Paper } from "@material-ui/core";
import styled from "styled-components/macro";

const Container = styled(Paper)`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: ${(props) => props.theme.spacing(4)}px;
  z-index: 1;
`;

const ZoomInfo = ({ zoomLevel = 0 }) => {
  return <Container>Current Zoom Level: {zoomLevel.toFixed(1)} </Container>;
};

export default ZoomInfo;
