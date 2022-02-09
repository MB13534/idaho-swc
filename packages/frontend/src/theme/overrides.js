import { customHighlight } from "./variants";

const overrides = {
  MuiCard: {
    root: {
      borderRadius: "6px",
      boxShadow:
        "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
    },
  },
  MuiMobileStepper: {
    root: {
      background: "none",
    },
  },
  PrivateNotchedOutline: {
    legendLabelled: {
      fontSize: ".92em",
    },
  },
  MuiInputLabel: {
    shrink: {
      fontSize: "16px",
      color: "black",
    },
    root: {
      color: "black",
    },
  },
  MuiInputBase: {
    root: {
      color: "rgba(0,0,0,1)",
    },
  },
  MuiFormLabel: {
    root: {
      color: "black",
    },
  },
  MuiCardHeader: {
    action: {
      marginTop: "-4px",
      marginRight: "-4px",
    },
  },
  MuiPickersDay: {
    day: {
      fontWeight: "300",
    },
  },
  MuiPickersYear: {
    root: {
      height: "64px",
    },
  },
  MuiPickersCalendar: {
    transitionContainer: {
      marginTop: "6px",
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: "transparent",
      "& > *": {
        backgroundColor: "transparent",
      },
    },
    switchHeader: {
      marginTop: "2px",
      marginBottom: "4px",
    },
  },
  MuiPickersClock: {
    container: {
      margin: `32px 0 4px`,
    },
  },
  MuiPickersClockNumber: {
    clockNumber: {
      left: `calc(50% - 16px)`,
      width: "32px",
      height: "32px",
    },
  },
  MuiPickerDTHeader: {
    dateHeader: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
    timeHeader: {
      "& h3": {
        fontSize: "3rem",
        fontWeight: 400,
      },
    },
  },
  MuiPickersTimePicker: {
    hourMinuteLabel: {
      "& h2": {
        fontSize: "3.75rem",
        fontWeight: 300,
      },
    },
  },
  MuiPickersToolbar: {
    toolbar: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
  },
  MuiChip: {
    root: {
      borderRadius: "6px",
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: "0.65rem",
    },
  },
  MuiCssBaseline: {
    "@global": {
      "::-moz-selection": {
        color: "white",
        background: customHighlight[500],
      },
      "::selection": {
        color: "white",
        background: customHighlight[500],
      },
      "*::-webkit-scrollbar": {
        width: "0.8em",
      },
      "*::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        // backgroundColor: "rgba(255,255,255,.2)",
        backgroundColor: "rgb(178,178,178)",
        border: "none !important",
        borderRadius: "8px",
      },
    },
  },
};

export default overrides;
