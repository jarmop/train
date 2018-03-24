import React, {Component} from 'react';
import * as service from 'services/TrackerService';
import 'styles/ApiRace.css';
import {formatDate} from 'utilities';

class ApiRace extends Component {
  constructor(props) {
    super(props);

    this.isPollingEnabled = true;

    this.state = {
      trainNumber: props.trainNumber,
      data1: {
        longitude: 0,
        latitude: 0,
        speed: 0,
        updated: new Date(),
      },
      data2: {
        longitude: 0,
        latitude: 0,
        speed: 0,
        updated: new Date(),
      }
    };
  }

  poll() {
    setTimeout(() => {
      if (this.isPollingEnabled) {
        this.updateLocation();
        this.poll();
      }

    }, 5000);
  }

  updateLocation() {
    service.getLocation(this.state.trainNumber)
        .then(({longitude, latitude, speed, updated}) => {
          console.log('update 1');
          this.setState({
            data1: {
              longitude,
              latitude,
              speed,
              updated,
            },
            oldData1: {...this.state.data1}
          });
        })
        .catch(message => {
          console.log(message);
        });
    service.getLocation2(this.state.trainNumber)
        .then(({longitude, latitude, speed, updated}) => {
          console.log('update 2');
          this.setState({
            data2: {
              longitude,
              latitude,
              speed,
              updated,
            },
            oldData2: {...this.state.data2},
          });
        })
        .catch(message => {
          console.log(message);
        });
  }

  componentDidMount() {
    service.getStations().then(stations => this.setState({stations}));
    this.updateLocation();
    this.isPollingEnabled = true;
    this.poll();
  }

  componentWillUnmount() {
    this.isPollingEnabled = false;
  }

  render() {
    let {data1, data2, oldData1, oldData2, stations} = this.state;

    if (!stations) {
      return '';
    }

    return (
        <div className="tracker">
          <div>
            <b>rata.digitraffic.fi</b>
            <Map data={data1} oldData={oldData1} stations={stations}/>
          </div>
          <div>
            <b>junatkartalla</b>
            <Map data={data2} oldData={oldData2} stations={stations}/>
          </div>
        </div>
    );
  }
}

let Map = ({data, oldData, stations}) => {
  let width = 160;
  let height = 200;
  let x = width / 2;
  let y = height / 2;

  // 0.01 coord point = 100px
  let scale = 10000;
  let latRatio = 4 / 10 * scale;
  let lonRatio = 23 / 100 * scale;

  return (
      <div className="map-container">
        <table>
          <tbody>
          <tr>
            <th>Longitude:</th>
            <td>{data.longitude.toFixed(4)}</td>
            {oldData &&
            <td>({(data.longitude - oldData.longitude).toFixed(4)})</td>
            }
          </tr>
          <tr>
            <th>Latitude:</th>
            <td>{data.latitude.toFixed(4)}</td>
            {oldData &&
            <td>({(data.latitude - oldData.latitude).toFixed(4)})</td>
            }
          </tr>
          <tr>
            <th>Speed:</th>
            <td>{data.speed}</td>
            {oldData &&
            <td>({data.speed - oldData.speed})</td>
            }
          </tr>
          <tr>
            <th>Updated:</th>
            <td>{formatDate(data.updated)}</td>
            {oldData &&
            <td>
              ({parseInt(
                (data.updated.getTime() - oldData.updated.getTime()) / 1000
            )} s)
            </td>
            }
          </tr>
          </tbody>
        </table>
        <svg width={width} height={height} className="map">
          {stations.map(station =>
              <Station
                  key={station.stationShortCode}
                  x={x + (station.longitude - data.longitude) * lonRatio}
                  y={y - (station.latitude - data.latitude) * latRatio}
                  name={station.stationName}
              />
          )}
          <Train x={x} y={y} color={'green'}/>
        </svg>
      </div>
  );
};

let Station = ({x, y, name}) => {
  let radius = 6;
  let strokeWidth = 1;
  return (
      <svg>
        <circle
            cx={x}
            cy={y}
            r={radius - strokeWidth}
            style={{
              fill: 'red', stroke: 'black', strokeWidth: strokeWidth,
            }}
        />
        <text x={x + radius} y={y + radius} fill="black"
              style={{fontSize: 12}}>{name}</text>
      </svg>
  );
};

let Train = ({x, y, color}) => (
    <circle
        cx={x}
        cy={y}
        r={5}
        style={{
          fill: color, stroke: 'black', strokeWidth: 1,
        }}
    />
);

export default ApiRace;