import { useTheme } from "@material-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import darcula from "react-syntax-highlighter/dist/cjs/styles/hljs/darcula";
import React from "react";

export function DebugJson({ data }) {
  const theme = useTheme();

  const customStyles = {
    fontSize: "11px",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    overflow: "auto",
  };

  return (
    <SyntaxHighlighter
      language="json"
      style={darcula}
      customStyle={customStyles}
    >
      {JSON.stringify(data, true, 2)}
    </SyntaxHighlighter>
  );
}
