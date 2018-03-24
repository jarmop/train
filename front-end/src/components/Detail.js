import React, {Component} from 'react';
import 'styles/Detail.css';
import {getOccupied} from 'services/service';

class Detail extends Component {
  constructor(props) {
    super(props);

    this.isPollingEnabled = true;

    this.state = {
      occupied: {
        current: null,
        next: null,
        previous: null,
      },
      trainNumber: props.trainNumber,
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

  componentDidMount() {
    this.updateLocation();
    this.poll();
  }

  componentWillUnmount() {
    this.isPollingEnabled = false;
  }

  updateLocation() {
    getOccupied(this.state.trainNumber)
        .then(occupied => {
          this.setState({
            occupied: occupied,
          });
        })
        .catch(message => {
          // console.log(message)
        });
  }

  render() {
    let {occupied} = this.state;

    return (
        <div className="detail">
          <div className="track">
            <div className="station">
              {occupied.previous}
            </div>
            <div><i className="track__direction fa fa-angle-double-right"></i>
            </div>
            <div className="station station--current">
              {occupied.current}
            </div>
            <div><i className="track__direction fa fa-angle-double-right"></i>
            </div>
            <div className="station">
              {occupied.next}
            </div>
          </div>
        </div>
    );
  }
}

export default Detail;