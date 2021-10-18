import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  authLayoutRoutes,
  dashboardLayoutRoutes,
  dashboardMaxContentLayoutRoutes,
  presentationLayoutRoutes,
  protectedRoutes,
} from "./index";

import Auth0ProviderWithHistory from "../auth/auth0-provider-with-history";
import {
  Dashboard as DashboardLayout,
  DashboardMaxContent as DashboardMaxContentLayout,
} from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import PresentationLayout from "../layouts/Presentation";
import Page404 from "../pages/auth/Page404";
import ProtectedRoute from "../auth/ProtectedRoute";
import ProtectedPage from "../pages/protected/ProtectedPage";
import { DevProvider } from "../DevProvider";
import { AppProvider } from "../AppProvider";
import ScrollToTop from "../hooks/ScrollToTop";

const ProviderStub = ({ children }) => <div>{children}</div>;

const ChildRoutes = (Layout, routes) => {
  return routes.map(
    (
      {
        component: Component,
        guard,
        auth,
        children,
        crud,
        model,
        config,
        path,
        provider,
      },
      index
    ) => {
      const Guard = guard || React.Fragment;
      const Provider = provider || ProviderStub;

      if (crud) children = crud;

      const getRoute = ({
        index,
        path,
        Guard,
        Component,
        model,
        Provider,
        config,
      }) => {
        return (
          <Route
            key={index}
            path={path}
            exact
            render={(props) => (
              <Layout>
                <Guard>
                  <Provider model={model}>
                    <Component {...props} modelName={model} config={config} />
                  </Provider>
                </Guard>
              </Layout>
            )}
          />
        );
      };

      const output = [];
      const results = children
        ? children.map((element, index) => {
            const Guard = element.guard || React.Fragment;
            const provider = element.provider || Provider;
            const Component = element.component || React.Fragment;

            return getRoute({
              index,
              path: element.path,
              Guard,
              Component,
              model: element.model,
              config: element.config || config,
              Provider: provider,
            });
          })
        : null;

      if (results) {
        output.push(results);
      }

      if (Component) {
        output.push(
          getRoute({ index, path, Guard, Component, model, Provider, config })
        );
      }

      return output;
    }
  );
};

const Routes = () => {
  return (
    <Router>
      <Auth0ProviderWithHistory>
        <AppProvider>
          <DevProvider>
            <ScrollToTop />
            <Switch>
              {ChildRoutes(DashboardLayout, dashboardLayoutRoutes)}
              {ChildRoutes(
                DashboardMaxContentLayout,
                dashboardMaxContentLayoutRoutes
              )}
              {ChildRoutes(DashboardLayout, protectedRoutes)}
              {ChildRoutes(AuthLayout, authLayoutRoutes)}
              {ChildRoutes(PresentationLayout, presentationLayoutRoutes)}
              <ProtectedRoute path="/secret" component={ProtectedPage} />
              <Route
                render={() => (
                  <AuthLayout>
                    <Page404 />
                  </AuthLayout>
                )}
              />
            </Switch>
          </DevProvider>
        </AppProvider>
      </Auth0ProviderWithHistory>
    </Router>
  );
};

export default Routes;
