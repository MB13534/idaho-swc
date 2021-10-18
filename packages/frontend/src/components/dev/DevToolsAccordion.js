import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { DebugJson } from "./DebugJson";
import { useDev } from "../../DevProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { useApp } from "../../AppProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingLeft: theme.spacing(2),
  },
}));

export default function DevToolsAccordion() {
  const classes = useStyles();

  const app = useApp();
  const dev = useDev();
  const { user } = useAuth0();

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>process.env</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DebugJson data={process.env} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Raw Data from Last API Call
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DebugJson data={dev.rawApiData} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            useApp().currentUser
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DebugJson data={app.currentUser} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>useAuth0().user</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DebugJson data={user} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
