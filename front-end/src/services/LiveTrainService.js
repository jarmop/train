import geolib from 'geolib';
import {fetchTrainLocation} from 'api';
import {fetchStations, fetchTrain} from 'api';

type LiveTrain = {
  startStationName: string,
  endStationName: string,
  progress: float,
  speed: int,
  locationUpdated: Date,
};

const makeLiveTrain = (location, schedule, oldLiveTrain) => {
  // console.log(location);
  // console.log(schedule);
  let train = {
    location: {
      longitude: location.location.coordinates[0],
      latitude: location.location.coordinates[1],
    },
    speed: location.speed,
    timeUpdated: location.timestamp,
    timeChanged: location.timestamp,
  };

  if (oldLiveTrain
      && oldLiveTrain.location.longitude === train.location.longitude
      && oldLiveTrain.location.latitude === train.location.latitude
      && oldLiveTrain.speed === train.speed
  ) {
    train.timeChanged = oldLiveTrain.locationChanged;
  }

  return getStations()
      .then(stations => {
        let startStationName = '';
        let endStationName = '';
        let progress = 0;
        for (let i = 0; i < schedule.length; i++) {
          let event = schedule[i];
          if (event.type === 'ARRIVAL' && !event.hasOwnProperty('actualTime')) {
            let startDeparture = schedule[i - 1];
            let endArrival = event;

            let startStation = stations[startDeparture.stationShortCode];
            let endStation = stations[endArrival.stationShortCode];
            let startLocation = {
              latitude: startStation.latitude,
              longitude: startStation.longitude
            };
            let endLocation = {
              latitude: endStation.latitude,
              longitude: endStation.longitude
            };
            let stationRadius = 200;
            let isAtStartStation = geolib.isPointInCircle(
                train.location, startLocation, stationRadius);
            // let isAtEndStation = geolib.isPointInCircle(trainLocation, endLocation, stationRadius);
            // console.log('is at start: ' + isAtStartStation);
            // console.log('is at end: ' + isAtEndStation);
            // let fullDistance = geolib.getDistance(startLocation, endLocation); THIS FAILS!!!

            let startDistance = geolib.getDistance(
                train.location, startLocation);
            let endDistance = geolib.getDistance(train.location, endLocation);
            let fullDistance = geolib.getDistance(startLocation, endLocation);

            // console.log('fullD: ' + fullDistance);
            // console.log('startD: ' + startDistance);
            // console.log('edndD: ' + endDistance);
            // console.log('diff: ' + (fullDistance - startDistance - endDistance));

            progress = isAtStartStation && train.speed === 0
                ? 0
                : startDistance / fullDistance;
            startStationName = startStation.name;
            endStationName = endStation.name;

            break;
          }
        }

        let liveTrain: LiveTrain = {
          startStationName: startStationName,
          endStationName: endStationName,
          progress: progress,
          speed: train.speed,
          location: train.location,
          locationUpdated: new Date(train.timeUpdated),
          locationChanged: new Date(train.timeChanged),
        };

        // console.log(liveTrain);

        return liveTrain;
      });
};

export const updateLiveTrain = (trainNumber, oldLiveTrain = null) => {
  return new Promise((resolve, reject) => {
    let location = null;
    let schedule = null;
    getTrainLocation(trainNumber)
        .then(trainLocation => {
          location = trainLocation;
          if (schedule) {
            resolve(makeLiveTrain(location, schedule, oldLiveTrain));
          }
        });
    getTrainSchedule(trainNumber)
        .then(trainSchedule => {
          schedule = trainSchedule;
          if (location) {
            resolve(makeLiveTrain(location, schedule, oldLiveTrain));
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
              let timeTableRows = train.timeTableRows.filter(
                  event => event.trainStopping);
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