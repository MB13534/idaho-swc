import { styled } from "@material-ui/core/styles";
import { Box, Paper } from "@material-ui/core";

import Search from "./search";
import Filter from "./filter/filter";

const Container = styled(Paper)(({ theme }) => ({
  alignItems: "center",
  borderBottom: `1px solid #ddd`,
  display: "flex",
  padding: theme.spacing(3),
}));

const AquiferOptions = [{ display: "Placeholder", value: "placeholder" }];

const FiltersBar = ({ onSearchSelect }) => {
  return (
    <Container square elevation={0}>
      {/* {children} */}
      <Box mr={8}>
        <Search onSelect={onSearchSelect} />
      </Box>
      <Box display="flex" gridColumnGap={8}>
        <Filter active label="Aquifers" options={AquiferOptions} />
        <Filter label="Primary Use" options={AquiferOptions} />
      </Box>
    </Container>
  );
};

export default FiltersBar;
