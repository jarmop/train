const addLeadingZero = (value) => {
  return value < 10 ? '0' + value : '' + value;
};

export const formatTime = (timestamp) => {
  let date = new Date(timestamp);
  return addLeadingZero(date.getHours())
      + ':'
      + addLeadingZero(date.getMinutes())
      + ':'
      + addLeadingZero(date.getSeconds());
};

export const formatTimeShort = (timestamp) => {
  let date = new Date(timestamp);
  return addLeadingZero(date.getHours())
      + ':'
      + addLeadingZero(date.getMinutes());
};

export const getUrl = (path) => {
  return process.env.PUBLIC_URL + path;
};