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
            <Map/>
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

let Map = ({}) => {
  let width = 150;
  let height = 20;
  let stationStrokeWidth = 1;
  let stationRadius = height / 2 - stationStrokeWidth;
  let trackStart = stationRadius;
  let trackLength = width - 2 * stationRadius;
  let trackEnd = trackStart + trackLength;
  let trackY = height / 2;
  let trainProgress = 0.5;
  let trainX = trackStart + trainProgress * trackLength;
  let trainRadius = 5;
  return (
      <div className="live-train-map">
        <svg
            width={width}
            height={height}
            style={{
              // border: '1px solid black'
            }}
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
      </div>
  );
};

// let Map2 = ({}) => (
//     <div className="live-train-map">
//       <div className="live-train-map__track">
//         <div
//             className="live-train-map__station"
//             style={{
//               left: 0,
//             }}
//         >
//           <div
//               className="live-train-map__station-name"
//               style={{
//                 left: -50,
//               }}
//           >
//             Malminkartano
//           </div>
//         </div>
//         <div
//             className="live-train-map__train"
//             style={{
//               left: '50%',
//             }}
//         >
//         </div>
//         <div
//             className="live-train-map__station"
//             style={{
//               right: 0,
//             }}
//         >
//           <div
//               className="live-train-map__station-name"
//               style={{
//                 right: -50,
//               }}
//           >
//             Pohjois-Haaga
//           </div>
//         </div>
//       </div>
//     </div>
// );

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