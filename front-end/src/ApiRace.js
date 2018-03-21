import React, {Component} from 'react';
import * as service from './TrackerService';
import './Tracker.css';

class ApiRace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trainNumber: (new URL(window.location.href)).pathname.split('/')
          .slice(-1)
          .pop(),
      data1: {
        longitude: 0,
        latitude: 0,
        speed: 0,
      },
      data2: {
        longitude: 0,
        latitude: 0,
        speed: 0,
      }
    };
  }

  poll() {
    setTimeout(() => {
      this.updateLocation();
      this.poll();
    }, 5000);
  }

  updateLocation() {
    service.getLocation(this.state.trainNumber)
        .then(({longitude, latitude, speed}) => {
          console.log('update 1');
          this.setState({
            data1: {
              longitude,
              latitude,
              speed,
            }
          });
        })
        .catch(message => {
          console.log(message);
        });
    service.getLocation2(this.state.trainNumber)
        .then(({longitude, latitude, speed}) => {
          console.log('update 2');
          this.setState({
            data2: {
              longitude,
              latitude,
              speed,
            }
          });
        })
        .catch(message => {
          console.log(message);
        });
  }

  componentDidMount() {
    service.getStations().then(stations => this.setState({stations}));
    this.updateLocation();
    this.poll();
  }

  render() {
    let {data1, data2, stations} = this.state;

    if (!stations) {
      return '';
    }

    return (
        <div className="tracker">
          <div>
            <b>rata.digitraffic.fi</b>
            <Map data={data1} stations={stations}/>
          </div>
          <div>
            <b>junatkartalla</b>
            <Map data={data2} stations={stations}/>
          </div>
        </div>
    );
  }
}

let Map = ({data, stations}) => {
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
        <div>
          Longitude: {data.longitude.toFixed(2)}
          <br/>
          Latitude: {data.latitude.toFixed(2)}
          <br/>
          Speed: {data.speed}
        </div>
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
        <text x={x + radius} y={y + radius} fill="black" style={{fontSize: 12}}>{name}</text>
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