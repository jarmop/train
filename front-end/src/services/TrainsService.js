import {fetchTrainsByStation} from 'api';

const KEHARATA_TRAIN_LETTERS = ['P', 'I'];

const mapStationNameToStationShortCode = {
  'kannelmaki': 'KAN',
  'huopalahti': 'HPL',
};

let train: {number: int};

export const getTrainsByStation = (stationName) => {
  let stationShortCode = mapStationNameToStationShortCode[stationName];
  return fetchTrainsByStation(stationShortCode).then(trains => {
    let keharataTrains = trains.filter(
        train => KEHARATA_TRAIN_LETTERS.includes(train.commuterLineID));
    return keharataTrains
        .map(train => {
          let departureTimetable = train.timeTableRows
              .filter(timeTable =>
                  timeTable.stationShortCode === stationShortCode
                  && timeTable.type === 'DEPARTURE'
              )
              .pop();

          let trainObject: {
            number: int,
            code: string,
            scheduledDepartureTime: Date,
            track: int,
          } = {
            number: train.trainNumber,
            code: train.commuterLineID,
            scheduledDepartureTime: new Date(departureTimetable.scheduledTime),
            track: parseInt(departureTimetable.commercialTrack),
          };

          return trainObject;
        })
        .sort((trainA, trainB) =>
            trainA.scheduledDepartureTime.getTime() - trainB.scheduledDepartureTime.getTime()
        );
  });
};