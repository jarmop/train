import React, {Component} from 'react';
import * as service from 'services/TrackerService';
import 'styles/ApiRace.css';
import {formatTime} from 'utilities';
import Map from 'components/Map';

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
          // console.log('update 1');
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
    // service.getLocation2(this.state.trainNumber)
    //     .then(({longitude, latitude, speed, updated}) => {
    //       console.log('update 2');
    //       this.setState({
    //         data2: {
    //           longitude,
    //           latitude,
    //           speed,
    //           updated,
    //         },
    //         oldData2: {...this.state.data2},
    //       });
    //     })
    //     .catch(message => {
    //       console.log(message);
    //     });
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
          {/*<div>*/}
            {/*<b>junatkartalla</b>*/}
            {/*<Map data={data2} oldData={oldData2} stations={stations}/>*/}
          {/*</div>*/}
        </div>
    );
  }
}



export default ApiRace;