import React, {Component} from 'react';
import {getLiveTrain} from 'services/LiveTrainService';
import {formatTime} from 'utilities';
import 'styles/LiveTrain.css';

class LiveTrain extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let {trainNumber} = this.props;
    // getLiveTrain(trainNumber)
    //     .then(liveTrain => {
    //       console.log(liveTrain);
    //     })
    //     .catch(message => {
    //       console.log(message);
    //     })
  }

  render() {
    return (
        <div className="live-train">
          <div className="live-train__map">
            <Map
                startStationName={'Malminkartano'}
                endStationName={'Kannelmäki'}
                trainProgress={0.3}
            />
          </div>
          <div className="live-train__data">
            <Data
                data={{
                  longitude: 1,
                  latitude: 2,
                  speed: 2,
                  updated: new Date(),
                }}
                oldData={{
                  longitude: 1,
                  latitude: 2,
                  speed: 2,
                  updated: new Date(),
                }}
            />
          </div>
        </div>
    );
  }
}

export default LiveTrain;

let Map = ({startStationName, endStationName, trainProgress}) => {
  let width = 100;
  let height = 20;
  let stationStrokeWidth = 1;
  let stationRadius = height / 2 - stationStrokeWidth;
  let trackStart = stationRadius;
  let trackLength = width - 2 * stationRadius;
  let trackEnd = trackStart + trackLength;
  let trackY = height / 2;
  let trainX = trackStart + trainProgress * trackLength;
  let trainRadius = 5;
  return (
      <div className="live-train-map">
        <div className="live-train-map__station-name live-train-map__station-name--start">
          {startStationName}
        </div>
        <svg
            width={width}
            height={height}
            className="live-train-map__track"
        >
          <line
              x1={trackStart}
              x2={trackEnd}
              y1={trackY}
              y2={trackY}
              strokeWidth="2"
              stroke="black"
          />
          <circle
              cx={trackStart}
              cy={trackY}
              r={stationRadius}
              fill="white"
              stroke="black"
              strokeWidth={stationStrokeWidth}
          />
          <circle
              cx={trackEnd}
              cy={trackY}
              r={stationRadius}
              fill="white"
              stroke="black"
              strokeWidth={stationStrokeWidth}
          />
          <circle cx={trainX} cy={trackY} r={trainRadius} fill="red"/>
          <polygon
              points={
                trainX + ',' + (trackY + trainRadius)
                + ' '
                + (trainX + 2 * trainRadius) + ',' + trackY
                + ' '
                + trainX + ',' + (trackY - trainRadius)
              }
              fill="red"
          />
        </svg>
        <div className="live-train-map__station-name">
          {endStationName}
        </div>
      </div>
  );
};

let Data = ({data, oldData}) => (
    <table>
      <tbody>
      <tr>
        <th>Speed:</th>
        <td>{data.speed}</td>
        <td>
          (
          {oldData && data.speed - oldData.speed}
          )
        </td>
      </tr>
      <tr>
        <th>Updated:</th>
        <td>{formatTime(data.updated)}</td>
        <td>
          (
          {oldData && parseInt(
              (data.updated.getTime() - oldData.updated.getTime()) / 1000
          )}
          s )
        </td>
      </tr>
      </tbody>
    </table>
);