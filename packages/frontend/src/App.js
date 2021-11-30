import React from "react";
import { useSelector } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import DateFnsUtils from "@date-io/date-fns";
import { QueryClient, QueryClientProvider } from "react-query";

import { ThemeProvider } from "styled-components/macro";
import { create } from "jss";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  jssPreset,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

import createTheme from "./theme";
import Routes from "./routes/Routes";

const queryClient = new QueryClient();

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  const theme = useSelector((state) => state.themeReducer);

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Helmet titleTemplate="%s | CUWCD" defaultTitle="CUWCD Dashboard" />
          <StylesProvider jss={jss}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
                <ThemeProvider theme={createTheme(theme.currentTheme)}>
                  <Routes />
                </ThemeProvider>
              </MuiThemeProvider>
            </MuiPickersUtilsProvider>
          </StylesProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
