import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from "react-redux";

import App from "./App";
import "./mocks";
import store from "./redux/store/index";

const version = require("./vendor/version") || "1.0.0";
process.env.REACT_APP_VERSION = version;

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
