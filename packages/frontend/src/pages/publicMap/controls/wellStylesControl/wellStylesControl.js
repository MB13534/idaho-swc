import { ButtonGroup, Button } from "@material-ui/core";

const WellStylesControl = ({ onChange, options, value }) => {
  return (
    <ButtonGroup size="medium">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <Button
            key={option.value}
            color={active ? "primary" : "inherit"}
            onClick={() => onChange(option.value)}
            variant={active ? "contained" : "outlined"}
          >
            {option.display}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default WellStylesControl;
