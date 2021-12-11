import {
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from "@material-ui/core";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";

const MultiSelect = ({
  label,
  name,
  onChange = () => {},
  onSelectAll,
  onSelectNone,
  options = [],
  value = [],
}) => {
  return (
    <div>
      <Typography variant="subtitle1">{label}</Typography>
      <Box display="flex" gridColumnGap={8} mt={2}>
        <Button
          size="small"
          startIcon={<PlusIcon />}
          onClick={() => onSelectAll(name)}
          variant="outlined"
        >
          Select All
        </Button>
        <Button
          size="small"
          startIcon={<MinusIcon />}
          onClick={() => onSelectNone(name)}
          variant="outlined"
        >
          Select None
        </Button>
      </Box>
      <Box>
        <FormControl component="fieldset">
          <ul style={{ paddingLeft: 0, listStyle: "none", columnCount: 2 }}>
            {options.map((option) => (
              <li key={option.value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={value.includes(option.value)}
                      onChange={onChange}
                      name={name}
                      value={option.value}
                    />
                  }
                  label={option.display}
                />
              </li>
            ))}
          </ul>
        </FormControl>
      </Box>
    </div>
  );
};

export default MultiSelect;
