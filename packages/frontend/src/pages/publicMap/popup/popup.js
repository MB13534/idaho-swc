import { Box, Typography } from "@material-ui/core";
import "./styles.css";

const Popup = ({ excludeFields, feature, titleField }) => {
  const popupData = excludeFields
    ? Object.entries(feature?.properties).reduce((acc, [key, value]) => {
        if (!excludeFields.includes(key)) {
          acc.push([key, value]);
        }
        return acc;
      }, [])
    : Object.entries(feature?.properties);
  if (!popupData) return null;
  return (
    <Box maxHeight={150}>
      {popupData?.map(([key, value]) => (
        <Box
          key={key}
          display="flex"
          gridColumnGap={24}
          justifyContent={"space-between"}
        >
          <Typography variant="subtitle1">{key}</Typography>
          <Typography variant="subtitle1">{value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Popup;
