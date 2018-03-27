import React, {Component} from 'react';
import {getLiveTrain} from 'services/LiveTrainService';
import {formatTime} from 'utilities';
import 'styles/LiveTrain.css';

class LiveTrain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liveTrain: null,
    };
  }

  componentDidMount() {
    let {trainNumber} = this.props;
    getLiveTrain(trainNumber)
        .then(liveTrain => {
          // console.log(liveTrain);
          this.setState({
            liveTrain: {...liveTrain},
          });
        })
        .catch(message => {
          // console.log(message);
        })
  }

  render() {
    if (!this.state.liveTrain) {
      return 'Loading...';
    }

    let {startStationName, endStationName, progress, speed, updated} = this.state.liveTrain;

    return (
        <div className="live-train">
          <div className="live-train__map">
            <Map
                startStationName={startStationName}
                endStationName={endStationName}
                trainProgress={progress}
            />
          </div>
          <div className="live-train__data">
            <Data
                data={{
                  progress: progress,
                  speed: speed,
                  updated: updated,
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

let Data = ({data}) => (
    <table>
      <tbody>
      <tr>
        <th>Speed:</th>
        <td>{data.speed}</td>
      </tr>
      <tr>
        <th>Updated:</th>
        <td>{formatTime(data.updated)}</td>
      </tr>
      </tbody>
    </table>
);