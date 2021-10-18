import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { DIALOG_TYPES } from "../../constants";
import { useApp } from "../../AppProvider";
import { isWidthDown, withWidth } from "@material-ui/core";

const dialogKey = DIALOG_TYPES.EVOLVE;

function ConfirmEvolveDialog({ open, setOpen, width }) {
  const { confirmDialogKey, confirmDialogPayload, confirmDialogCallback } =
    useApp();

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    handleClose();
    confirmDialogCallback(confirmDialogPayload);
  };

  return (
    <Dialog
      maxWidth="xs"
      open={confirmDialogKey === dialogKey && open}
      onClose={handleClose}
    >
      <DialogTitle style={{ textAlign: "center" }}>
        {"Evolve Record"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{
            textAlign: "center",
            padding: `0 ${isWidthDown("xs", width) ? 20 : 40}px`,
          }}
        >
          Evolving a record re-applies any published changes that were reverted
          during a devolve.
          <br />
          <br />
          Are you sure you want to evolve this record?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="outlined"
          onClick={handleAgree}
          color="primary"
          autoFocus
        >
          Yes, re-apply changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withWidth()(ConfirmEvolveDialog);
