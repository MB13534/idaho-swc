import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch as MuiSwitch,
} from "@material-ui/core";

const Switch = ({ label, name, onChange, value }) => {
  return (
    <FormControl>
      <FormGroup>
        <div>
          <FormControlLabel
            control={
              <MuiSwitch
                checked={value}
                onChange={onChange}
                name={name}
                color="primary"
              />
            }
            label={label}
            labelPlacement="start"
            style={{ width: "100%", justifyContent: "space-between" }}
          />
        </div>
      </FormGroup>
    </FormControl>
  );
};

export default Switch;
