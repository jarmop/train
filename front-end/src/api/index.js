import queryString from 'query-string';

// const URL_STATION = 'https://rata.digitraffic.fi/api/v1/live-trains/station/[STATION_SHORT_CODE]?minutes_after_departure=60&minutes_before_departure=60';
const URL_STATION = 'https://rata.digitraffic.fi/api/v1/live-trains/station/[STATION_SHORT_CODE]?minutes_after_departure=60&minutes_before_departure=60';

export const fetchTrainsByStation = (stationShortCode, minutesBeforeDeparture, minutesAfterDeparture) => {
  return new Promise((resolve, reject) =>
      fetch(URL_STATION.replace(/\[STATION_SHORT_CODE\]/, stationShortCode))
          .then(response => response.json())
          .then(trains => {
            resolve(trains);
          })
          .catch(error => {
            reject(error);
          })
  );
};