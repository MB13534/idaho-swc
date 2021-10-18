import React from "react";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { themeSelected } from "../redux/actions/themeActions";
import { THEMES } from "../constants";

import { IconButton as MuiIconButton, Tooltip } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import {
  Brightness2 as MuiLightIcon,
  Brightness7 as MuiDarkIcon,
} from "@material-ui/icons";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const ThemeButtonInner = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: absolute;

  ${(props) => props.selectedtheme === THEMES.DARK && `background: #23303f;`}
  ${(props) =>
    props.selectedtheme === THEMES.LIGHT && `background: ${grey[100]};`}
`;

const LightIcon = styled(MuiLightIcon)`
  z-index: 1;
  width: 16px !important;
  height: 16px !important;
  color: ${(props) => props.theme.palette.primary.main};
`;

const DarkIcon = styled(MuiDarkIcon)`
  z-index: 1;
  width: 16px !important;
  height: 16px !important;
  color: ${grey[100]};
`;

function ThemesToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeReducer);

  const toggleTheme = () => {
    if (theme.currentTheme === THEMES.LIGHT) onThemeSelect(THEMES.DARK);
    else if (theme.currentTheme === THEMES.DARK) onThemeSelect(THEMES.LIGHT);
  };

  const onThemeSelect = (theme) => {
    dispatch(themeSelected(theme));
  };

  const getOppositeColorName = () => {
    if (theme.currentTheme === THEMES.LIGHT) return "Dark";
    else if (theme.currentTheme === THEMES.DARK) return "Light";
  };

  return (
    <React.Fragment>
      <Tooltip title={`Switch to ${getOppositeColorName()} Mode`}>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme.currentTheme === THEMES.LIGHT && <LightIcon />}
          {theme.currentTheme === THEMES.DARK && <DarkIcon />}
          <ThemeButtonInner selectedtheme={theme.currentTheme} />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

export default ThemesToggle;
