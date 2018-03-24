import {fetchTrainsByStation} from 'api';

const KEHARATA_TRAIN_LETTERS = ['P', 'I'];

const mapStationNameToStationShortCode = {
  'kannelmaki': 'KAN',
  'huopalahti': 'HPL',
};

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

          return {
            number: train.trainNumber,
            letter: train.commuterLineID,
            scheduledDepartureTime: new Date(departureTimetable.scheduledTime)
          };
        })
        .sort((trainA, trainB) =>
            trainA.scheduledDepartureTime > trainB.scheduledDepartureTime
        );
  });
};