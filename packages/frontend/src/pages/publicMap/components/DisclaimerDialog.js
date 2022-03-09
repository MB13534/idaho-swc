import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "@auth0/auth0-react";

const DisclaimerDialog = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth0();
  const [open, setOpen] = React.useState(true);

  const handleAccept = () => {
    setOpen(false);
  };

  const handleDecline = () => {
    setOpen(false);
    history.push("/");
  };

  useEffect(() => {
    isAuthenticated && setOpen(false);
  }, [isAuthenticated]);

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-description"
      >
        <DialogTitle id="disclaimer-title">{"Disclaimer"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="disclaimer-description">
            This product is for informational purposes only and may not have
            been prepared for or suitable for legal, engineering, or surveying
            purposes. It does not represent an on-the-ground survey and
            represents only the approximate relative location of property
            boundaries. The Idaho Surface Water Coalition expressly disclaim any
            and all liability in connection herewith.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept} color="primary">
            Accept
          </Button>
          <Button onClick={handleDecline} color="secondary" autoFocus>
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisclaimerDialog;
