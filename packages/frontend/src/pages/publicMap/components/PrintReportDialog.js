import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PrintReportDialog({
  downloadCallback,
  setPrintReportDialogOpen,
  printReportDialogOpen,
  title,
  setTitle,
}) {
  const handleClose = () => {
    setPrintReportDialogOpen(false);
  };

  const handleDownload = () => {
    downloadCallback();
    setTitle("");
    handleClose();
  };

  return (
    <Dialog
      open={printReportDialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Print Report</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please provide a title that will appear on the report.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDownload} color="primary">
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
