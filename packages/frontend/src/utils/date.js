import moment from "moment";
import { THEME } from "../constants";

export const formatDate = (date) => {
  return moment(date)
    .add(moment().utcOffset(), "minutes")
    .format(THEME.DATE_FORMAT_LONG);
};

export const formatTimeAgo = (date) => {
  return moment(date).add(moment().utcOffset(), "minutes").fromNow();
};
