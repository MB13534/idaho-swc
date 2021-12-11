import MultiSelect from "../multiSelect";
import Switch from "../switch";

const filtersLookup = {
  "multi-select": MultiSelect,
  boolean: Switch,
};

const Filter = ({ type, ...rest }) => {
  const FilterComponent = filtersLookup[type];
  if (!FilterComponent) return null;
  return <FilterComponent {...rest} />;
};

export default Filter;
