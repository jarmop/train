import stoppingSections from 'data/stopping-sections';

let keharataStationCodes = Object.keys(stoppingSections);

const URL_LOCATION = 'https://rata.digitraffic.fi/api/v1/train-locations/latest/[TRAIN_NUMBER]';
const URL_LOCATION2 = 'https://junatkartalla-cal-prod.herokuapp.com/trains/[PREVIOUS_RESPONSE_TIMESTAMP]';
const URL_STATIONS = 'https://rata.digitraffic.fi/api/v1/metadata/stations';

let previousResponseTimestamp = 1;

export const getStations = () => {
  return fetch(URL_STATIONS)
      .then(response => response.json())
      .then(stations => {
        let keharataStations = stations.filter(station => station.passengerTraffic === true && keharataStationCodes.includes(station.stationShortCode));
        return keharataStations;
      })
      .catch();
};

export const getLocation = (train) => {
  return new Promise((resolve, reject) => {
    fetch(URL_LOCATION.replace(/\[TRAIN_NUMBER\]/, train))
        .then(response => response.json())
        .then(json => {
          if (json.length > 0) {
            json = json[0];
            resolve({
              longitude: json.location.coordinates[0],
              latitude: json.location.coordinates[1],
              speed: json.speed,
              updated: new Date(json.timestamp),
            });
          } else {
            reject('not found')
          }

        })
        .catch(message => {
          reject(message);
        });
  });
};

export const getLocation2 = (train) => {
  return new Promise((resolve, reject) => {
    fetch(URL_LOCATION2.replace(/\[PREVIOUS_RESPONSE_TIMESTAMP\]/, previousResponseTimestamp))
        .then(response => response.json())
        .then(json => {
          previousResponseTimestamp = json.responseTimestamp;
          if (json.trains.hasOwnProperty(train)) {
            let trainData = json.trains[train];
            resolve({
              longitude: parseFloat(trainData.longitude),
              latitude: parseFloat(trainData.latitude),
              speed: trainData.speed,
              updated: new Date(trainData.updated),
            });
          } else {
            reject('not updated');
          }
        })
        .catch(message => {
          reject(message);
        });
  });
};