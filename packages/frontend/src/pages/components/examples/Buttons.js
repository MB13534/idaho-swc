import React from "react";
import styled from "styled-components/macro";
import {
  Box,
  Button as MuiButton,
  IconButton,
  Divider,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  KeyboardVoice as KeyboardVoiceIcon,
  Save as SaveIcon,
  Send as SendIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@material-ui/icons";

const Button = styled(MuiButton)`
  margin-right: ${(props) => props.theme.spacing(4)}px;
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
`;

export default function Buttons() {
  return (
    <React.Fragment>
      <Box mb={2}>
        <Button variant="contained">Default</Button>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="contained" disabled>
          Disabled
        </Button>
        <Button variant="contained" color="primary" href="#contained-buttons">
          Link
        </Button>
      </Box>

      <Box mb={2}>
        <Button variant="outlined">Default</Button>
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
        <Button variant="outlined" color="primary" href="#outlined-buttons">
          Link
        </Button>
      </Box>

      <Box>
        <Button>Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <Button href="#text-buttons" color="primary">
          Link
        </Button>
      </Box>

      <Divider />

      <Box my={4}>
        <div>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div>
          <Button variant="outlined" size="small" color="primary">
            Small
          </Button>
          <Button variant="outlined" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="outlined" size="large" color="primary">
            Large
          </Button>
        </div>
        <div>
          <Button variant="contained" size="small" color="primary">
            Small
          </Button>
          <Button variant="contained" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="contained" size="large" color="primary">
            Large
          </Button>
        </div>
        <div>
          <IconButton aria-label="delete" size="small">
            <ArrowDownwardIcon fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon fontSize="large" />
          </IconButton>
        </div>
      </Box>

      <Divider />

      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button variant="contained" color="primary" endIcon={<SendIcon />}>
          Send
        </Button>
        <Button
          variant="contained"
          color="default"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          disabled
          color="secondary"
          startIcon={<KeyboardVoiceIcon />}
        >
          Talk
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </Box>
    </React.Fragment>
  );
}
