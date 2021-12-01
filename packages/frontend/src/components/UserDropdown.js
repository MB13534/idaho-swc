import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";

import {
  Badge,
  CardHeader as MuiCardHeader,
  Chip,
  IconButton as MuiIconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Tooltip,
} from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";
import { ROUTES } from "../constants";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const HitArea = styled("div")`
  cursor: pointer;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  margin-left: ${(props) => props.theme.spacing(2)}px;
  background: ${(props) => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const MenuItem = styled(MuiMenuItem)`
  min-width: 300px;
  min-height: 40px;
`;

const CardHeader = styled(MuiCardHeader)`
  padding: 8px 0;
`;

const UserAvatarBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const TinyUserAvatarBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1px solid ${(props) => props.theme.palette.common.white};
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }
`;

const TinyAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
`;

function UserDropdown({ children }) {
  const history = useHistory();
  const [anchorMenu, setAnchorMenu] = useState(null);
  const { user, isLoading, isAuthenticated, logout } = useAuth0();

  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  useEffect(() => {
    if (user) {
      setIsAdmin(
        user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(
          "Administrator"
        )
      );
    }
  }, [user]);

  if (isLoading || !isAuthenticated) return <React.Fragment />;

  return (
    <React.Fragment>
      {!children && (
        <Tooltip title="Account">
          <IconButton
            aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={toggleMenu}
            color="inherit"
          >
            <TinyUserAvatarBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <TinyAvatar alt={user.name} src={user.picture} />
            </TinyUserAvatarBadge>
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Account">
        <HitArea onClick={toggleMenu}>{children}</HitArea>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem>
          <CardHeader
            avatar={
              <UserAvatarBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar alt={user.name} src={user.picture} />
              </UserAvatarBadge>
            }
            title={user.name}
            subheader={user.email}
            onClick={() => {
              history.push(ROUTES.USER_PROFILE);
              closeMenu();
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            history.push(ROUTES.PAGE_ABOUT);
            closeMenu();
          }}
        >
          About LRE Water Unified Platform
        </MenuItem>
        {isAdmin && (
          <MenuItem
            onClick={() => {
              history.push(ROUTES.PAGE_DOCUMENTATION);
              closeMenu();
            }}
          >
            Documentation
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            history.push(ROUTES.PAGE_CHANGELOG);
            closeMenu();
          }}
        >
          Changelog{" "}
          <LinkBadge label={`v${process.env.REACT_APP_VERSION || "1.0.0"}`} />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            history.push(ROUTES.USER_ACCOUNT);
            closeMenu();
          }}
        >
          Your Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push(ROUTES.PAGE_DOCS_SUPPORT);
            closeMenu();
          }}
        >
          Support
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() =>
            logout({
              returnTo: window.location.origin,
            })
          }
        >
          Log out
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default UserDropdown;
