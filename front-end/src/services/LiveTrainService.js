import {fetchTrainLocation} from 'api';

type LiveTrain = {
  longitude: float,
  latitude: float,
  speed: int,
  updated: Date,
};


export const getLiveTrain = (trainNumber) => {
  return new Promise((resolve, reject) =>
      fetchTrainLocation(trainNumber)
          .then(trainLocation => {
            if (trainLocation.length === 1) {
              trainLocation = trainLocation.pop();
              console.log(trainLocation);
              let coordinates = trainLocation.location.coordinates;
              let liveTrain: LiveTrain = {
                longitude: trainLocation.location.coordinates[0],
                latitude: trainLocation.location.coordinates[1],
                speed: trainLocation.speed,
                updated: new Date(trainLocation.timestamp),
              };
              resolve(liveTrain);
            } else {
              reject('not found');
            }
          })
  );
};