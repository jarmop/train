import React, {Component} from 'react';
import * as service from './TrackerService';
import './Tracker.css';

let minLon = 24.84;
let maxLon = 25.09;
let minLat = 60.16;
let maxLat = 60.33;

let latRatio = 4000;
let lonRatio = 2300;

let width = (maxLon - minLon) * lonRatio;
let height = (maxLat - minLat) * latRatio;

// console.log(width);
// console.log(height);

let mapLonToMap = (lon) => {
  return Math.floor((lon - minLon) * lonRatio);
};

let mapLatToMap = (lat) => {
  return height - Math.floor((lat - minLat) * latRatio);
};

class Tracker extends Component {
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

    let x1 = mapLonToMap(data1.longitude);
    let y1 = mapLatToMap(data1.latitude);
    let x2 = mapLonToMap(data2.longitude);
    let y2 = mapLatToMap(data2.latitude);

    return (
        <div className="tracker">
          <div>
            Coordinates1: {data1.longitude + ', ' + data1.latitude}
            <br/>
            Speed1: {data1.speed}
          </div>
          <div>
            Coordinates2: {data2.longitude + ', ' + data2.latitude}
            <br/>
            Speed2: {data2.speed}
          </div>
          <svg width={width} height={height}>
            {stations.map(station =>
                <Station
                    key={station.stationShortCode}
                    x={mapLonToMap(station.longitude)}
                    y={mapLatToMap(station.latitude)}
                    name={station.stationName}
                />
            )}
            <Train x={x1} y={y1} color={'green'}/>
            <Train x={x2} y={y2} color={'blue'}/>
          </svg>
        </div>
    );
  }
}

let Station = ({x, y, name}) => (
    <svg x={x} y={y}>
      <circle
          cx={7}
          cy={7}
          r={5}
          style={{
            fill: 'red', stroke: 'black', strokeWidth: 1,
          }}
      />
      <text x={14} y={14} fill="black">{name}</text>
    </svg>
);

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

export default Tracker;