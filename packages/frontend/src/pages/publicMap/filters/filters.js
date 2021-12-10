import { styled } from "@material-ui/core/styles";
import { Box, Paper } from "@material-ui/core";

import Search from "./search";
import AquiferFilter from "./aquiferFilter";
import useFilters from "../useFilters";

const Container = styled(Paper)(({ theme }) => ({
  alignItems: "center",
  borderBottom: `1px solid #ddd`,
  display: "flex",
  padding: theme.spacing(3),
}));

const AquiferOptions = [{ display: "Placeholder", value: "placeholder" }];

const FiltersBar = ({ onFilterChange, onSearchSelect }) => {
  const {
    aquifers,
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  } = useFilters({ onFilterChange });

  return (
    <Container square elevation={0}>
      {/* {children} */}
      <Box mr={8}>
        <Search onSelect={onSearchSelect} />
      </Box>
      <Box display="flex" gridColumnGap={8}>
        <AquiferFilter
          label="Aquifers"
          onChange={handleFilterValues}
          onSelectAll={handleSelectAll}
          onSelectNone={handleSelectNone}
          options={aquifers}
          value={filterValues.aquifers}
        />
      </Box>
    </Container>
  );
};

export default FiltersBar;
