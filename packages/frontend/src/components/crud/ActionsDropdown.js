import { useApp } from "../../AppProvider";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  DELETE_BUTTON_LABEL,
  DELETE_CRUD_TABLES_DISABLED,
  // CONTENT_NODE_STATUS_IDS,
  DIALOG_TYPES,
  EDIT_CRUD_TABLES_DISABLED,
} from "../../constants";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {
  // CloudOff as UnpublishIcon,
  // CloudUpload as PublishIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  // FileCopy as DuplicateIcon,
  MoreVert as MoreVertIcon,
  // Restore as DevolveIcon,
  // Update as EvolveIcon,
} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import { MenuItem as MuiMenuItem, Typography } from "@material-ui/core";
// import {
//   publishRecord,
//   unpublishRecord,
// } from "../../redux/actions/crudActions";
// import useRedux from "../../hooks/useRedux";
// import { redoRecord, undoRecord } from "../../services/crudService";
// import useService from "../../hooks/useService";
import styled from "styled-components/macro";
import { useCrud } from "../../CrudProvider";

const MenuItem = styled(MuiMenuItem)`
  &.Mui-disabled {
    pointer-events: auto;
  }
`;

export const ActionsDropdownTypes = {
  INDEX: "INDEX",
  VIEW: "VIEW",
};

export function ActionsDropdown({
  params,
  modelName,
  type = ActionsDropdownTypes.INDEX,
  afterAction = () => {},
  ...props
}) {
  const app = useApp();
  const crud = useCrud();
  const history = useHistory();
  // const service = useService();
  // const redux = useRedux();

  const [anchorMenu, setAnchorMenu] = useState(null);

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setAnchorMenu(event.currentTarget);
  };

  const handleClick = (callback) => {
    return (event, id) => {
      event.stopPropagation();
      closeMenu();
      callback(id);
    };
  };

  const onEditClick = () => {
    history.push(`${crud.getModelBasePath()}/${params.id}`);
  };

  const onDeleteClick = () => {
    app.setConfirmDialogKey(DIALOG_TYPES.DELETE);
    app.setConfirmDialogPayload(params.row);
    app.setConfirmDialogOpen(true);
    afterAction();
  };

  // const onEvolveClick = (id) => {
  //   app.setConfirmDialogKey(DIALOG_TYPES.EVOLVE);
  //   app.setConfirmDialogPayload(id);
  //   app.setConfirmDialogOpen(true);
  //
  //   app.setConfirmDialogCallback(() => async (id) => {
  //     await service(
  //       [redoRecord, [modelName, id]],
  //       "Published changes have been re-applied."
  //     );
  //     afterAction();
  //   });
  // };
  //
  // const onDevolveClick = (id) => {
  //   app.setConfirmDialogKey(DIALOG_TYPES.DEVOLVE);
  //   app.setConfirmDialogPayload(id);
  //   app.setConfirmDialogOpen(true);
  //   app.setConfirmDialogCallback(() => async (id) => {
  //     await service(
  //       [undoRecord, [modelName, id]],
  //       "Previously published state has been restored."
  //     );
  //     afterAction();
  //   });
  // };
  //
  // const onDuplicateClick = () => {};
  //
  // const onPublishClick = async () => {
  //   await redux(
  //     (token) => publishRecord(modelName, params.row, token),
  //     "Record was published successfully."
  //   );
  //   afterAction();
  // };
  //
  // const onUnpublishClick = async () => {
  //   await redux(
  //     (token) => unpublishRecord(modelName, params.row, token),
  //     "Record was unpublished successfully."
  //   );
  //   afterAction();
  // };

  const [menuItems, setMenuItems] = useState({
    edit: {
      label: "Edit",
      onClick: handleClick(onEditClick),
      icon: EditIcon,
      visibleForTypes: [ActionsDropdownTypes.INDEX],
      disabled: EDIT_CRUD_TABLES_DISABLED.includes(modelName),
    },
    // duplicate: {
    //   label: "Duplicate",
    //   onClick: handleClick(onDuplicateClick),
    //   icon: DuplicateIcon,
    //   visibleForTypes: [ActionsDropdownTypes.INDEX, ActionsDropdownTypes.VIEW],
    // },
    // publish: {
    //   label: "Publish",
    //   onClick: handleClick(onPublishClick),
    //   icon: PublishIcon,
    //   visibleForTypes: [ActionsDropdownTypes.INDEX, ActionsDropdownTypes.VIEW],
    // },
    // evolve: {
    //   label: "Evolve",
    //   onClick: handleClick(onEvolveClick),
    //   icon: EvolveIcon,
    //   visibleForTypes: [ActionsDropdownTypes.VIEW],
    //   disabledTooltip:
    //     "Record does not have any published evolutions available.",
    // },
    // devolve: {
    //   label: "Devolve",
    //   onClick: handleClick(onDevolveClick),
    //   icon: DevolveIcon,
    //   visibleForTypes: [ActionsDropdownTypes.VIEW],
    //   disabledTooltip: "Record does not have any former published states.",
    // },
    // unpublish: {
    //   label: "Unpublish",
    //   onClick: handleClick(onUnpublishClick),
    //   icon: UnpublishIcon,
    //   visibleForTypes: [ActionsDropdownTypes.INDEX, ActionsDropdownTypes.VIEW],
    //   disabledTooltip: "Record is already unpublished.",
    // },
    delete: {
      //check to see if there is a delete button label for this model name
      //display label if so, else "Delete"
      label: DELETE_BUTTON_LABEL.filter((item) => item[modelName]).length
        ? DELETE_BUTTON_LABEL.filter((item) => item[modelName])[0][modelName]
        : "Delete",
      onClick: handleClick(onDeleteClick),
      icon: DeleteIcon,
      visibleForTypes: [ActionsDropdownTypes.INDEX, ActionsDropdownTypes.VIEW],
      className: "error",
      disabled: DELETE_CRUD_TABLES_DISABLED.includes(modelName),
    },
  });

  useEffect(() => {
    setMenuItems((prevState) => {
      let newState = { ...prevState };

      // newState.devolve.disabled = params.row.former_parent_id === null;
      // newState.evolve.disabled = params.row.future_parent_id === null;
      // newState.unpublish.disabled =
      //   params.row.status_id === CONTENT_NODE_STATUS_IDS.DRAFT;
      return newState;
    });
  }, [params]);

  return (
    <div {...props}>
      <Tooltip title="Actions">
        <IconButton
          component="div"
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          style={{ margin: 0 }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
        color={"primary"}
      >
        {Object.values(menuItems)
          .filter((x) => x.visibleForTypes.includes(type))
          .map((x) => (
            <Tooltip
              enterDelay={250}
              enterNextDelay={250}
              key={x.label}
              title={x.disabled && x.disabledTooltip ? x.disabledTooltip : ""}
            >
              <MenuItem
                component="div"
                onClick={
                  !x.disabled && params.id
                    ? (e) => x.onClick(e, params.id)
                    : () => {}
                }
                className={x.className ?? ""}
                disabled={(x.disabled || !params.id) ?? false}
              >
                <x.icon fontSize="small" style={{ marginRight: 10 }} />{" "}
                <Typography>{x.label}</Typography>
              </MenuItem>
            </Tooltip>
          ))}
      </Menu>
    </div>
  );
}
