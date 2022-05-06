/* eslint-disable import/first */
import React from "react";
import { CRUD_MODELS, ROUTES } from "../constants";
import { useAuth0 } from "@auth0/auth0-react";

import async from "../components/Async";

import {
  Database,
  FileText,
  Home,
  Monitor,
  Users,
  Map,
  Share2,
  Folder,
  Heart,
  Clipboard,
  Droplet,
} from "react-feather";

import AuthGuard from "../components/AuthGuard";

import Blank from "../pages/pages/Blank";
import Landing from "../pages/presentation/Landing";
import ProtectedPage from "../pages/protected/ProtectedPage";
import * as inflector from "inflected";
import Default from "../pages/dashboards/Default";
import { CrudProvider } from "../CrudProvider";

// TODO MAYBE LAZY IMPORT
import PublicMap from "../pages/publicMap";
import TimeSeriesComparison from "../pages/dataAccess/timeSeries/TimeSeriesComparison";
import SentinelWells from "../pages/dataAccess/reports/SentinelWells";
import DataPointsDetails from "../pages/dataAccess/reports/DataPointsDetails";
import HydrologicHealth from "../pages/dashboards/HydrologicHealth/HydrologicHealth";

const Account = async(() => import("../pages/pages/Account"));
const Profile = async(() => import("../pages/pages/Profile"));

const CrudIndexPage = async(() => import("../components/crud/CrudIndexPage"));
const CrudViewPage = async(() => import("../components/crud/CrudViewPage"));

const getSidebarMenu = (list) => {
  return list.map((item) => {
    const slug = inflector.dasherize(inflector.underscore(item.name));
    return {
      id: item.sidebarName ?? inflector.titleize(item.name),
      path: `/models/${slug}`,
      model: inflector.singularize(item.name),
      icon: item.icon || <Database />,
      component: CrudIndexPage,
      config: require(`../pages/models/${item.name}Config`),
      provider: CrudProvider,
      children: item.children,
      header: item.header,
      guard: item.guard,
      visibilityFilter: item.visibilityFilter,
    };
  });
};

const getCrudRoutes = (list) => {
  return list.map((item) => {
    const config = require(`../pages/models/${item.name}Config`);
    const slug = inflector.dasherize(inflector.underscore(item.name));

    return {
      id: inflector.titleize(item.name),
      path: `/models/${slug}`,
      model: inflector.singularize(item.name),
      component: CrudIndexPage,
      provider: CrudProvider,
      config,
      crud: [
        {
          path: `/models/${slug}/:id`,
          name: `View ${inflector.titleize(inflector.singularize(item.name))}`,
          component: CrudViewPage,
          provider: CrudProvider,
          model: inflector.singularize(item.name),
          config,
        },
        {
          path: `/models/${slug}/add`,
          name: `Add ${inflector.titleize(inflector.singularize(item.name))}`,
          component: CrudViewPage,
          provider: CrudProvider,
          model: inflector.singularize(item.name),
          config,
        },
      ],
    };
  });
};

const crudSidebarMenu = [...getSidebarMenu(CRUD_MODELS)];
const modelCrudRoutes = [...getCrudRoutes(CRUD_MODELS)];

//MAIN DASH
const mainRoutes = {
  header: "Dashboards",
  id: "Landing Dashboard",
  path: "/dashboard",
  icon: <Home />,
  component: Default,
  children: null,
  containsHome: true,
};

//WATERSHED OVERVIEW
const publicMapRoute = {
  header: "Watershed Overview",
  id: "Map of Sites",
  icon: <Map />,
  path: "/watershed-overview/map-of-sites",
  name: "Map of Sites",
  component: PublicMap,
};

const siteSummaryTableRoute = {
  id: "Site Summary Table",
  icon: <Clipboard />,
  path: "/watershed-overview/site-summary-table",
  name: "Site Summary Table",
  component: DataPointsDetails,
};

//DATA ANALYSIS TOOLS
const timeSeriesComparisonsRoute = {
  header: "Data Analysis Tools",
  id: "Time Series Comparisons",
  icon: <Share2 />,
  path: "/data-analysis-tools/time-series-comparison",
  name: "Time Series Comparisons",
  component: TimeSeriesComparison,
};

const hydrologicHealthRoute = {
  id: "Hydrologic Health",
  icon: <Heart />,
  path: "/data-analysis-tools/hydrologic-health",
  name: "Hydrologic Health",
  component: HydrologicHealth,
};

const sentinelWellDashboardRoute = {
  id: "Sentinel Well Dashboard",
  icon: <Droplet />,
  path: "/data-analysis-tools/sentinel-well-dashboard",
  name: "Sentinel Well Dashboard",
  component: SentinelWells,
};

//RESOURCES
const summaryOfDatasetsRoute = {
  header: "Resources",
  id: "Summary of Datasets",
  icon: <FileText />,
  path: "/resources/summary-of-datasets",
  name: "Files",
  component: Blank,
};

//DOCUMENTS
const documentsRoutes = {
  header: "Documents",
  id: "Public Files",
  icon: <Folder />,
  path: "/documents/public-docs",
  name: "Public Files",
  component: Blank,
};

//OTHER
const accountRoutes = {
  id: "Account",
  path: "/account",
  name: "Account",
  header: "Pages",
  icon: <Users />,
  component: Account,
  children: [
    {
      path: ROUTES.USER_PROFILE,
      name: "Profile",
      component: Profile,
    },
    {
      path: "/auth/logout",
      name: "Logout",
      component: function Logout() {
        const { logout } = useAuth0();
        logout();
      },
    },
  ],
  guard: AuthGuard,
};

const landingRoutes = {
  id: "Landing Page",
  path: "/",
  header: "Docs",
  icon: <Monitor />,
  component: Landing,
  children: null,
};

// This route is only visible while signed in
const protectedPageRoutes = {
  id: "Private",
  path: "/private",
  icon: <Monitor />,
  component: ProtectedPage,
  children: null,
  guard: AuthGuard,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  mainRoutes,
  siteSummaryTableRoute,
  timeSeriesComparisonsRoute,
  hydrologicHealthRoute,
  sentinelWellDashboardRoute,
  summaryOfDatasetsRoute,
  documentsRoutes,
  accountRoutes,
];

export const dashboardMaxContentLayoutRoutes = [
  ...crudSidebarMenu,
  ...modelCrudRoutes,
  publicMapRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes = [];

// Routes using the Presentation layout
export const presentationLayoutRoutes = [landingRoutes];

// Routes using the full screen map layout
export const fullscreenMapRoutes = [];

// Routes that are protected
export const protectedRoutes = [protectedPageRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [
  mainRoutes,
  ...crudSidebarMenu,
  publicMapRoute,
  siteSummaryTableRoute,
  timeSeriesComparisonsRoute,
  hydrologicHealthRoute,
  sentinelWellDashboardRoute,
  summaryOfDatasetsRoute,
  documentsRoutes,
];
