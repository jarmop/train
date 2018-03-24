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
          <h1 className="station__name">
            {urlNameToHumanReadableName[station]}
          </h1>
          <table className="station-train-table">
            <thead>
            <tr>
              <th>Departs</th>
              <th className="station-train-table__element--centered">Code</th>
              <th>Number</th>
              <th className="station-train-table__element--centered">track</th>
            </tr>
            </thead>
            <tbody>
            {trains.map(train =>
                <tr className="station-train-table__train">
                  <td>
                    {formatTimeShort(train.scheduledDepartureTime)}
                  </td>
                  <td className="station-train-table__element--centered">
                    <Link
                        key={train.number}
                        to={getUrl('/' + train.number)}
                        className="station-train-link"
                    >
                      {train.code}
                    </Link>
                  </td>
                  <td>
                    {train.number}
                  </td>
                  <td className="station-train-table__element--centered">
                    {train.track}
                  </td>
                </tr>
            )}
            </tbody>
          </table>

        </div>
    );
  }
}

export default App;