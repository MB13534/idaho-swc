import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { THEMES } from "../../constants";
import { Helmet } from "react-helmet-async";

import "../../vendor/roundedBarCharts";

import { blue, green, grey, orange, red } from "@material-ui/core/colors";

import moment from "moment";
import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Link,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { Code } from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)(spacing);

const CardContent = styled(MuiCardContent)`
  position: relative;
`;

const RoleChip = styled(MuiChip)`
  ${spacing};
  background: ${(props) => props.theme.palette.action.hover};
`;

const VerifiedEmailChip = styled(MuiChip)`
  ${spacing};
  color: ${(props) => props.theme.palette.success.main};
`;

const UnverifiedEmailChip = styled(MuiChip)`
  ${spacing};
  color: ${(props) => props.theme.palette.warning.main};
  border-color: ${(props) => props.theme.palette.warning.main};
`;

const Divider = styled(MuiDivider)(spacing);

const Grid = styled(MuiGrid)(spacing);

const Spacer = styled.div(spacing);

const Centered = styled.div`
  text-align: center;
`;

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 128px;
  width: 128px;
`;

const TypeChip = styled(Chip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) => props.rgbcolor};
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
`;

const MetaDataWell = styled.div`
  display: block;
  margin-right: auto;
  background: ${(props) => props.theme.palette.action.hover};
  color: ${(props) => props.theme.palette.text.secondary};
  border-radius: 3px;
  padding: ${(props) => props.theme.spacing(2)}px;
  margin-bottom: 0;
  ${(props) => props.theme.shadows[1]};
`;

const StyledDeveloperIcon = styled(Code)`
  margin-right: 8px;

  &:hover {
    color: black;

    ${(props) =>
      props.theme === THEMES.DARK &&
      `
        color: white;
      `}
  }
`;

const PeriodChip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)}px;

  span {
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

function Details() {
  const { user } = useAuth0();

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>

        <Spacer mb={4} />

        <Centered>
          <Avatar alt={user.name} src={user.picture} />
          <Typography variant="body2" component="div" gutterBottom>
            <Box fontWeight="fontWeightBold">{user.name}</Box>
            <Box fontWeight="fontWeightRegular">{user.email}</Box>
            {user.email_verified && (
              <Tooltip title="Email address has been verified.">
                <VerifiedEmailChip
                  mt={1}
                  variant="outlined"
                  label="verified"
                  size="small"
                />
              </Tooltip>
            )}
            {!user.email_verified && (
              <Tooltip title="Email address has not been verified.">
                <UnverifiedEmailChip
                  mt={1}
                  variant="outlined"
                  label="unverified"
                  size="small"
                />
              </Tooltip>
            )}
          </Typography>
        </Centered>
      </CardContent>
    </Card>
  );
}

const UserMetadata = () => {
  const { user } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  const theme = useSelector((state) => state.themeReducer);

  useEffect(() => {
    setDataIsLoading(true);
    setUserMetadata(
      Object.assign(userMetadata || {}, {
        theme: localStorage.getItem("theme"),
      })
    );
    setDataIsLoading(false);
  }, [theme.currentTheme]); // eslint-disable-line

  return (
    <Card mb={6}>
      <CardContent>
        <Grid container justify="flex-start">
          <Grid item>
            <Tooltip title="This panel is only visible to Developers.">
              <StyledDeveloperIcon
                color="disabled"
                theme={theme.currentTheme}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              User Metadata
            </Typography>
          </Grid>
        </Grid>

        <Spacer mb={4} />

        <MetaDataWell>
          <Centered>
            <Typography
              variant="caption"
              color="textSecondary"
              title="Auth0 User ID"
            >
              {user.sub}
            </Typography>
            <Divider my={2} />
          </Centered>
          {userMetadata ? (
            <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
          ) : dataIsLoading ? (
            <>
              <Typography variant="caption">
                <Skeleton />
              </Typography>
              <Divider my={2} />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            "No user metadata defined"
          )}
        </MetaDataWell>
      </CardContent>
    </Card>
  );
};

function Roles({ roles, loading }) {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Roles
        </Typography>

        <Spacer mb={4} />

        {roles ? (
          roles.map((role) => (
            <RoleChip key={role} size="small" mr={1} mb={1} label={role} />
          ))
        ) : loading ? (
          <>
            <Box display="flex">
              <Skeleton width="50px" style={{ marginRight: "5px" }} />
              <Skeleton width="50px" style={{ marginRight: "5px" }} />
              <Skeleton width="50px" style={{ marginRight: "5px" }} />
              <Skeleton width="50px" style={{ marginRight: "5px" }} />
            </Box>
          </>
        ) : (
          "No roles defined"
        )}
      </CardContent>
    </Card>
  );
}

function UserLogs() {
  const [userLogs, setUserLogs] = useState(null);

  const auth0EventKeys = [
    "s",
    "sce",
    "scp",
    "scu",
    "slo",
    "ss",
    "sv",
    "f",
    "fu",
    "fs",
    "gd_otp_rate_limit_exceed",
    "gd_recovery_failed",
    "gd_recovery_succeed",
    "limit_mu",
    "limit_wc",
    "limit_sul",
  ];

  const getLabelForEventType = (type) => {
    if (type === "s") return "Success Login";
    if (type === "sce") return "Success Change Email";
    if (type === "scp") return "Success Change Password";
    if (type === "scu") return "Success Change Username";
    if (type === "slo") return "Success Logout";
    if (type === "ss") return "Success Signup";
    if (type === "sv") return "Success Email Verification";
    if (type === "f") return "Failed Login";
    if (type === "fu") return "Failed Login";
    if (type === "fs") return "Failed Signup";
    if (type === "gd_otp_rate_limit_exceed") return "Too Many Login Failures";
    if (type === "gd_recovery_failed") return "Recovery Failed";
    if (type === "gd_recovery_succeed") return "Recovery Success";
    if (type === "limit_mu") return "Blocked Account";
    if (type === "limit_wc") return "Blocked Account";
    if (type === "limit_sul") return "Blocked Account";
  };

  const getColorForEventType = (type) => {
    if (type === "s") return blue[500];
    if (type === "sce") return green[500];
    if (type === "scp") return green[500];
    if (type === "scu") return green[500];
    if (type === "slo") return blue[500];
    if (type === "ss") return green[500];
    if (type === "sv") return green[500];
    if (type === "f") return red[500];
    if (type === "fu") return red[500];
    if (type === "fs") return red[500];
    if (type === "gd_otp_rate_limit_exceed") return red[500];
    if (type === "gd_recovery_failed") return orange[500];
    if (type === "gd_recovery_succeed") return green[500];
    if (type === "limit_mu") return orange[500];
    if (type === "limit_wc") return orange[500];
    if (type === "limit_sul") return orange[500];

    return grey[500];
  };

  const [userLogsIsLoading, setUserLogsIsLoading] = useState(true);
  useEffect(() => {
    setUserLogsIsLoading(true);
    setTimeout(() => {
      setUserLogs(null);
      setUserLogsIsLoading(false);
    }, 500);
  }, []); // eslint-disable-line

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Authentication Logs
        </Typography>

        <PeriodChip label="Last 24 Hours" />

        <Spacer mb={4} />

        {userLogs ? (
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userLogs
                  .filter((x) => auth0EventKeys.includes(x.type))
                  .map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>
                        <TypeChip
                          size="small"
                          label={getLabelForEventType(row.type)}
                          rgbcolor={getColorForEventType(row.type)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <span title={row.date}>
                          {moment(row.date).fromNow()}
                        </span>
                      </TableCell>
                      <TableCell>{row.ip}</TableCell>
                      <TableCell>{row.location_info?.city_name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableWrapper>
        ) : userLogsIsLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          "No user logs defined"
        )}
      </CardContent>
    </Card>
  );
}

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [toastOpen, setToastOpen] = useState(false);

  const [roles, setRoles] = useState(null);
  const [rolesIsLoading, setRolesIsLoading] = useState(true);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    if (user) {
      setRolesIsLoading(false);

      const myRoles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
      setRoles(myRoles);

      if (myRoles && myRoles.filter((x) => x === "Developer").length > 0) {
        setIsDeveloper(true);
      }
    }
  }, [user]); // eslint-disable-line

  const handlePasswordChangeClick = () => {
    const changePassword = async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const query = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/user/password-change`,
          { headers }
        );

        if (query.status === 200) {
          setToastOpen(true);
        }
      } catch (e) {
        console.log(e.message);
      }
    };

    changePassword();
  };

  return (
    <React.Fragment>
      <Helmet title="Profile" />

      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>

      <Grid container justify="space-between">
        <Grid item>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Dashboard
            </Link>
            <Link component={NavLink} exact to="/account">
              Account
            </Link>
            <Typography>Profile</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item>
          <Tooltip title={`Email password reset link to ${user.email}`}>
            <Button variant="outlined" onClick={handlePasswordChangeClick}>
              Reset Password
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={3}>
          <Details />
          <Roles roles={roles} loading={rolesIsLoading} />
          {isDeveloper && <UserMetadata />}
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
          <UserLogs />
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Password reset request has been emailed successfully."
      />
    </React.Fragment>
  );
}

export default Profile;
