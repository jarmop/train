const addLeadingZero = (value) => {
  return value < 10 ? '0' + value : '' + value;
};

export const formatDate = (timestamp) => {
  let date = new Date(timestamp);
  return addLeadingZero(date.getHours())
      + ':'
      + addLeadingZero(date.getMinutes())
      + ':'
      + addLeadingZero(date.getSeconds());
};