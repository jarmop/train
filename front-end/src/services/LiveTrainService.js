import geolib from 'geolib';
import {fetchTrainLocation} from 'api';
import {fetchStations, fetchTrain} from 'api';

type LiveTrain = {
  progress: float,
  speed: int,
  updated: Date,
};

const makeLiveTrain = (location, schedule) => {
  // console.log(location);
  // console.log(schedule);
  let train = {
    longitude: location.location.coordinates[0],
    latitude: location.location.coordinates[1],
    speed: location.speed,
    timestamp: location.timestamp,
  };
  return getStations()
      .then(stations => {
        let startStationName = '';
        let endStationName = '';
        let progress = 0;
        for (let i = 0; i < schedule.length; i++) {
          let event = schedule[i];
          if (event.type === 'ARRIVAL' && !event.hasOwnProperty('actualTime')) {
            let startEvent = schedule[i - 1];
            let endEvent = event;
            let startStation = stations[startEvent.stationShortCode];
            let endStation = stations[endEvent.stationShortCode];
            startStationName = startStation.name;
            endStationName = endStation.name;

            if (startEvent.hasOwnProperty('actualTime')) {
              console.log('between stations');
              // is between stations
              let startLocation = {latitude: startStation.latitude, longitude: startStation.longitude};
              let endLocation = {latitude: endStation.latitude, longitude: endStation.longitude};
              let trainLocation = {latitude: train.latitude, longitude: train.longitude};
              let fullDistance = geolib.getDistance(startLocation, endLocation);
              let startDistance = geolib.getDistance(trainLocation, startLocation);
              let endDistance = geolib.getDistance(trainLocation, endLocation);
              progress = startDistance / fullDistance;
            }

            break;
          }
        }
        let liveTrain: LiveTrain = {
          startStationName: startStationName,
          endStationName: endStationName,
          progress: progress,
          speed: train.speed,
          updated: new Date(train.timestamp),
        };

        console.log(liveTrain);

        return liveTrain;
      });
};

export const getLiveTrain = (trainNumber) => {
  return new Promise((resolve, reject) => {
    let location = null;
    let schedule = null;
    getTrainLocation(trainNumber)
        .then(trainLocation => {
          location = trainLocation;
          if (schedule) {
            resolve(makeLiveTrain(location, schedule));
          }
        });
    getTrainSchedule(trainNumber)
        .then(trainSchedule => {
          schedule = trainSchedule;
          if (location) {
            resolve(makeLiveTrain(location, schedule));
          }
        });
  });
};

const getTrainLocation = (trainNumber) => {
  let CACHE_KEY = 'getTrainLocation';
  return new Promise((resolve, reject) => {
    // let location = JSON.parse(localStorage.getItem(CACHE_KEY));
    let location = false;//JSON.parse(localStorage.getItem(CACHE_KEY));
    if (location) {
      resolve(location);
    } else {
      fetchTrainLocation(trainNumber)
          .then(trainLocation => {
            if (trainLocation.length === 1) {
              trainLocation = trainLocation.pop();
              localStorage.setItem(CACHE_KEY, JSON.stringify(trainLocation));
              resolve(trainLocation);
            } else {
              reject('not found');
            }
          });
    }
  });
};

const getTrainSchedule = (trainNumber) => {
  let CACHE_KEY = 'getTrainSchedule';
  return new Promise((resolve, reject) => {
    // let schedule = JSON.parse(localStorage.getItem(CACHE_KEY));
    let schedule = false;//JSON.parse(localStorage.getItem(CACHE_KEY));
    if (schedule) {
      resolve(schedule);
    } else {
      fetchTrain(trainNumber)
          .then(train => {
            if (train.length === 1) {
              train = train.pop();
              let timeTableRows = train.timeTableRows.filter(event => event.trainStopping);
              localStorage.setItem(CACHE_KEY, JSON.stringify(timeTableRows));
              resolve(timeTableRows);
            } else {
              reject('not found');
            }
          });
    }
  });

};

const getStations = () => {
  let CACHE_KEY = 'getStations';
  return new Promise((resolve, reject) => {
    let stations = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (stations) {
      resolve(stations);
    } else {
      fetchStations()
          .then(stations => {
            stations = stations.filter(station =>
                station.passengerTraffic === true
            );
            let stationMap = {};
            for (let station of stations) {
              stationMap[station.stationShortCode] = {
                shortCode: station.stationShortCode,
                name: station.stationName,
                longitude: station.longitude,
                latitude: station.latitude,
              };
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(stationMap));
            resolve(stationMap);
          });
    }
  });
};