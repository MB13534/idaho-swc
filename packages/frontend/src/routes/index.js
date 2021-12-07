/* eslint-disable import/first */
import React from "react";
import { CRUD_MODELS, ROUTES } from "../constants";
import { useAuth0 } from "@auth0/auth0-react";

import async from "../components/Async";

import {
  Activity,
  Archive,
  BookOpen,
  Briefcase,
  Database,
  FileText,
  Folder,
  Grid,
  Home,
  List,
  Monitor,
  Users,
  Map,
} from "react-feather";

import AuthGuard from "../components/AuthGuard";
import AdminGuard from "../components/AdminGuard";
import AdminVisibilityFilter from "../components/AdminVisibilityFilter";

import Blank from "../pages/pages/Blank";
import Changelog from "../pages/docs/Changelog";
import Landing from "../pages/presentation/Landing";
import ProtectedPage from "../pages/protected/ProtectedPage";
import Introduction from "../pages/docs/Introduction";
import Support from "../pages/docs/Support";
import { All, EXAMPLE_COMPONENTS } from "../pages/components/All";
import { DocumentationProvider } from "../pages/docs/DocumentationProvider";
import * as inflector from "inflected";
import { dasherize, underscore } from "inflected";
import GettingStarted from "../pages/docs/GettingStarted";
import Default from "../pages/dashboards/Default";
import { CrudProvider } from "../CrudProvider";
import CRUD from "../pages/docs/CRUD";
import Deploy from "../pages/docs/Deploy";
import UserVisibilityFilter from "../components/UserVisibilityFilter";
import UserGuard from "../components/UserGuard";
import UiPermitsExpiringsReport from "../pages/dataAccess/reports/UiPermitsExpiringsReport";
import FullMap from "../components/map/FullMap";
// TODO MAYBE LAZY IMPORT
import PublicMap from "../pages/publicMap";
const Account = async(() => import("../pages/pages/Account"));
const Profile = async(() => import("../pages/pages/Profile"));

const CrudIndexPage = async(() => import("../components/crud/CrudIndexPage"));
const CrudViewPage = async(() => import("../components/crud/CrudViewPage"));

const getSidebarMenu = (list) => {
  return list.map((item) => {
    const slug = inflector.dasherize(inflector.underscore(item.name));
    return {
      id: item.sidebarName,
      path: `/models/${slug}`,
      model: inflector.singularize(item.name),
      icon: item.icon || <Database />,
      component: CrudIndexPage,
      config: require(`../pages/models/${item.name}Config`),
      provider: CrudProvider,
      children: item.children,
      header: item.header,
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

const reportsRoutes = {
  id: "Reports",
  header: "Data Access",
  icon: <FileText />,
  children: [
    {
      path: "/data-access/reports/expiring-permits",
      name: "Expiring Permits",
      component: UiPermitsExpiringsReport,
    },
    {
      path: "/data-access/reports/production",
      name: "Production",
      component: Blank,
    },
    {
      path: "/data-access/reports/permits",
      name: "Permits",
      component: Blank,
    },
    {
      path: "/data-access/reports/ect",
      name: "Ect...",
      component: Blank,
    },
  ],
};

const mapRoutes = {
  id: "Map",
  icon: <Map />,
  path: "/data-access/map",
  name: "Map",
  component: FullMap,
};

const publicMapRoutes = {
  id: "Public Map",
  path: ROUTES.PUBLIC_MAP,
  name: "Public Map",
  component: PublicMap,
};

const timeseriesRoutes = {
  id: "Time Series",
  icon: <Activity />,
  children: [
    {
      path: "/data-access/graphs/streamflow",
      name: "Streamflow",
      component: Blank,
    },
    {
      path: "/data-access/graphs/flow-vs-targets",
      name: "Flow vs Targets",
      component: Blank,
    },
    {
      path: "/data-access/graphs/temperature",
      name: "Temperature",
      component: Blank,
    },
  ],
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

const publicFilesRoutes = {
  id: "Public Files",
  header: "Documents",
  icon: <Archive />,
  path: "/data-access/documents/public-files",
  name: "Public Files",
  component: Blank,
};

const clientDocsRoutes = {
  id: "Client Docs",
  icon: <Folder />,
  path: "/data-access/documents/client-docs",
  name: "Client Documents",
  component: Blank,
  guard: UserGuard,
  visibilityFilter: UserVisibilityFilter,
};

const adminDocsRoutes = {
  id: "Admin Docs",
  icon: <Briefcase />,
  path: "/data-access/documents/admin-docs",
  name: "Admin Documents",
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
  id: "Dashboard",
  path: "/dashboard",
  icon: <Home />,
  component: Default,
  children: null,
  containsHome: true,
};

const pageRoutes = {
  id: "Pages",
  path: "/pages",
  icon: <Monitor />,
  component: Blank,
  children: [
    {
      path: "/dashboard/default",
      name: "Dashboard",
      component: Default,
    },
    {
      path: ROUTES.PAGE_ABOUT,
      name: "About LRE Water Unified Platform",
      component: Blank,
    },
    {
      path: ROUTES.PAGE_SUPPORT,
      name: "Support",
      component: Blank,
    },
    {
      path: ROUTES.PAGE_DOCUMENTATION,
      name: "Documentation",
      component: Blank,
    },
    {
      path: ROUTES.PAGE_BLANK,
      name: "Blank",
      component: Blank,
    },
  ],
};

const documentationRoutes = {
  id: "Documentation",
  path: ROUTES.PAGE_DOCUMENTATION,
  icon: <BookOpen />,
  provider: DocumentationProvider,
  children: [
    {
      path: ROUTES.PAGE_DOCS_INTRODUCTION,
      name: "Introduction",
      component: Introduction,
      guard: AdminGuard,
    },
    {
      path: ROUTES.PAGE_DOCS_GETTING_STARTED,
      name: "Getting Started",
      component: GettingStarted,
      guard: AdminGuard,
    },
    {
      path: ROUTES.PAGE_DOCS_CRUD,
      name: "CRUD",
      component: CRUD,
      guard: AdminGuard,
    },
    {
      path: ROUTES.PAGE_DOCS_DEPLOY,
      name: "Deploy",
      component: Deploy,
      guard: AdminGuard,
    },
    {
      path: ROUTES.PAGE_DOCS_SUPPORT,
      name: "Support",
      component: Support,
      guard: AdminGuard,
    },
    {
      path: ROUTES.PAGE_CHANGELOG,
      name: "Changelog",
      component: Changelog,
    },
  ],
  component: null,
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

const slugify = (str) => {
  return dasherize(underscore(str));
};

const componentsRoutes = {
  id: "Components",
  path: "/components",
  header: "UI Kit",
  icon: <Grid />,
  children: [
    {
      path: "/components/all",
      name: "All",
      component: All,
    },
    ...EXAMPLE_COMPONENTS.map((x) => ({
      name: x.title,
      path: `/components/${slugify(x.title)}`,
      component: () => All({ exampleComponent: x }),
    })),
  ],
  component: null,
  visibilityFilter: AdminVisibilityFilter,
};

const changelogRoutes = {
  id: "Changelog",
  path: "/changelog",
  badge: process.env.REACT_APP_VERSION || "v1.0.0",
  icon: <List />,
  component: Changelog,
  provider: DocumentationProvider,
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

const adminRoutes = {
  id: "Users",
  header: "Administration",
  path: "/admin/users",
  icon: <Users />,
  component: Blank,
  children: [
    {
      path: "/admin/users",
      name: "Users",
      component: Blank,
    },
    {
      path: "/admin/roles",
      name: "Roles",
      component: Blank,
    },
    {
      path: "/admin/permissions",
      name: "Permissions",
      component: Blank,
    },
  ],
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  pageRoutes,
  mainRoutes,
  changelogRoutes,
  reportsRoutes,
  mapRoutes,
  timeseriesRoutes,
  publicFilesRoutes,
  clientDocsRoutes,
  adminDocsRoutes,
  accountRoutes,
  documentationRoutes,
  componentsRoutes,
  adminRoutes,
];

export const dashboardMaxContentLayoutRoutes = [
  ...crudSidebarMenu,
  ...modelCrudRoutes,
];

// Routes using the Auth layout
export const authLayoutRoutes = [accountRoutes];

// Routes using the Presentation layout
export const presentationLayoutRoutes = [landingRoutes];

// Routes using the full screen map layout
export const fullscreenMapRoutes = [publicMapRoutes];

// Routes that are protected
export const protectedRoutes = [protectedPageRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [
  mainRoutes,
  ...crudSidebarMenu,
  reportsRoutes,
  mapRoutes,
  timeseriesRoutes,
  publicFilesRoutes,
  clientDocsRoutes,
  adminDocsRoutes,
  adminRoutes,
  componentsRoutes,
  documentationRoutes,
];
