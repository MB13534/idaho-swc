import {
  Avatar,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

const FilterAvatar = styled("span")(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  display: "flex",
  fontSize: "13px!important",
  justifyContent: "center",
  height: theme.spacing(4.5),
  width: theme.spacing(4.5),
}));

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  width: "100%",
}));

const Filter = ({
  active,
  label,
  multi,
  name,
  onChange = () => {},
  options = [],
  value = "",
}) => {
  return (
    <Button
      color={active ? "primary" : "inherit"}
      size="large"
      variant={active ? "contained" : "outlined"}
      startIcon={active ? <FilterAvatar>1</FilterAvatar> : undefined}
    >
      {label}
    </Button>
    // <FormControl variant="outlined">
    //   <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    //   <Select
    //     id="demo-simple-select"
    //     labelId="demo-simple-select-label"
    //     name={name}
    //     onChange={onChange}
    //     value={value}
    //   >
    //     {options.map(({ display, value }) => (
    //       <MenuItem key={value} value={value}>
    //         {display}
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
  );
};

export default Filter;
