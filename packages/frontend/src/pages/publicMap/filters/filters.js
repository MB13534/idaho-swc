import { styled } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

import Search from "./search";

const Container = styled(Paper)(({ theme }) => ({
  borderBottom: `1px solid #ddd`,
  padding: theme.spacing(3),
}));

const FiltersBar = ({ children }) => {
  return (
    <Container square elevation={0}>
      {/* {children} */}
      <Search />
    </Container>
  );
};

export default FiltersBar;
