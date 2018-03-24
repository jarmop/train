import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getTrainsByStation} from 'services/TrainsService';
import {formatTimeShort} from 'utilities';
import 'styles/Station.css';
import {getUrl} from '../utilities';

let urlNameToHumanReadableName = {
  'kannelmaki': 'Kannelmäki',
  'huopalahti': 'Huopalahti',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationShortCode: this.props.match.params.station,
      trains: [],
    };
  }

  componentDidMount() {
    getTrainsByStation(this.state.stationShortCode).then(trains => {
      this.setState({trains: trains});
    });
  }

  render() {
    let {station} = this.props.match.params;
    let {trains} = this.state;

    return (
        <div className="station">
          {urlNameToHumanReadableName[station]}
          {trains.map(train =>
              <Link key={train.number} to={getUrl('/' + train.number)} className="station__train-link">
                  {formatTimeShort(train.scheduledDepartureTime)}
                  {' - '}
                  {train.number}
                  {' - '}
                  {train.letter}
              </Link>
          )}
        </div>
    );
  }
}

export default App;