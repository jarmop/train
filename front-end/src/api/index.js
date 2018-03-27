// const URL_STATION = 'https://rata.digitraffic.fi/api/v1/live-trains/station/[STATION_SHORT_CODE]?minutes_after_departure=60&minutes_before_departure=60';
const URL_STATION = 'https://rata.digitraffic.fi/api/v1/live-trains/station/[STATION_SHORT_CODE]' +
    '?minutes_before_arrival=0' +
    '&minutes_after_arrival=0' +
    '&minutes_before_departure=60' +
    '&minutes_after_departure=5'
;
const URL_TRAIN_LOCATION = 'https://rata.digitraffic.fi/api/v1/train-locations/latest/[TRAIN_NUMBER]';
const URL_STATIONS = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
const URL_TRAIN = 'https://rata.digitraffic.fi/api/v1/trains/latest/[TRAIN_NUMBER]';

export const fetchTrainsByStation = (
    stationShortCode,
    minutesBeforeDeparture,
    minutesAfterDeparture
) => {
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

export const fetchTrainLocation = (trainNumber) => {
  return new Promise((resolve, reject) =>
      fetch(URL_TRAIN_LOCATION.replace(/\[TRAIN_NUMBER\]/, trainNumber))
          .then(response => response.json())
          .then(trainLocation => {
            resolve(trainLocation);
          })
          .catch(error => {
            reject(error);
          })
  );
};

export const fetchStations = () => {
  return fetch(URL_STATIONS)
      .then(response => response.json());
};

export const fetchTrain = (trainNumber) => {
  return fetch(URL_TRAIN.replace(/\[TRAIN_NUMBER\]/, trainNumber))
      .then(response => response.json());
};