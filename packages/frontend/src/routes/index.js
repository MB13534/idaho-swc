/* eslint-disable import/first */
import React from "react";
import { CRUD_MODELS, ROUTES } from "../constants";
import { useAuth0 } from "@auth0/auth0-react";

import async from "../components/Async";

import {
  Archive,
  Database,
  FileText,
  Home,
  Monitor,
  Users,
  Map,
  Share2,
  Folder,
  Briefcase,
  Heart,
} from "react-feather";

import AuthGuard from "../components/AuthGuard";
import AdminGuard from "../components/AdminGuard";
import AdminVisibilityFilter from "../components/AdminVisibilityFilter";

import Blank from "../pages/pages/Blank";
import Landing from "../pages/presentation/Landing";
import ProtectedPage from "../pages/protected/ProtectedPage";
import * as inflector from "inflected";
import Default from "../pages/dashboards/Default";
import { CrudProvider } from "../CrudProvider";

// TODO MAYBE LAZY IMPORT
import PublicMap from "../pages/publicMap";
import UserVisibilityFilter from "../components/UserVisibilityFilter";
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

const dataManagementRoutes = {
  header: "Data Management",
  id: "A Table",
  icon: <Database />,
  path: "/data-management/rolodex",
  name: "A Table",
  component: Blank,
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

const dataAccessRoutes = {
  header: "Data Access",
  id: "Time Series",
  icon: <Share2 />,
  children: [
    {
      path: "/data-access/time-series/time-series-comparison",
      name: "Time Series Comparisons",
      component: TimeSeriesComparison,
    },
  ],
};

const reportsRoutes = {
  id: "Reports",
  icon: <FileText />,
  children: [
    {
      path: "/data-access/reports/sentinel-wells",
      name: "Sentinel Wells",
      component: SentinelWells,
    },
    {
      path: "/data-access/reports/data-points-details",
      name: "Data Points Details",
      component: DataPointsDetails,
    },
  ],
};

const publicMapRoutes = {
  header: "Resources",
  id: "Interactive Map",
  icon: <Map />,
  path: ROUTES.PUBLIC_MAP,
  name: "Interactive Map",
  component: PublicMap,
};

const publicFilesRoutes = {
  id: "Files",
  header: "Documents",
  icon: <Archive />,
  path: "/documents/files",
  name: "Files",
  component: Blank,
};

const userDocsRoutes = {
  id: "User Docs",
  icon: <Folder />,
  path: "/documents/user-docs",
  name: "User Docs",
  component: Blank,
  guard: AuthGuard,
  visibilityFilter: UserVisibilityFilter,
};

const adminDocsRoutes = {
  id: "Admin Docs",
  icon: <Briefcase />,
  path: "/documents/admin-docs",
  name: "Admin Docs",
  component: Blank,
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

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

const mainRoutes = {
  header: "Dashboards",
  id: "A Dashboard",
  path: "/dashboard",
  icon: <Home />,
  component: Default,
  children: null,
  containsHome: true,
  // guard: AuthGuard,
  // visibilityFilter: UserVisibilityFilter,
};

const hydrologicHealthRoute = {
  id: "Hydrologic Health",
  path: "/hydrologic-health",
  icon: <Heart />,
  component: HydrologicHealth,
  children: null,
  // guard: AuthGuard,
  // visibilityFilter: UserVisibilityFilter,
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
  hydrologicHealthRoute,
  dataManagementRoutes,
  dataAccessRoutes,
  reportsRoutes,
  publicFilesRoutes,
  userDocsRoutes,
  adminDocsRoutes,
  accountRoutes,
];

export const dashboardMaxContentLayoutRoutes = [
  ...crudSidebarMenu,
  ...modelCrudRoutes,
  publicMapRoutes,
];

// Routes using the Auth layout
export const authLayoutRoutes = [accountRoutes];

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
  dataManagementRoutes,
  dataAccessRoutes,
  reportsRoutes,
  hydrologicHealthRoute,
  publicMapRoutes,
  publicFilesRoutes,
  userDocsRoutes,
  adminDocsRoutes,
];
