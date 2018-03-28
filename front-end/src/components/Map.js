import React from 'react';

let Map = ({data, oldData, stations, fixedMap = true}) => {
  let width = 700;
  let height = 700;
  let centerX = width / 2;
  let centerLongitude = data.longitude;
  let centerLatitude = data.latitude;
  let centerY = height / 2;
  let trainX = centerX;
  let trainY = centerY;

  // 0.01 coord point = 100px
  let scale = 10000;
  let latRatio = 4 / 10 * scale;
  let lonRatio = 23 / 100 * scale;

  // let staticCenter = true;
  // let staticCenter = false;
  if (fixedMap) {
    centerLongitude = 24.97;
    centerLatitude = 60.25;
    trainX = centerX + (data.longitude - centerLongitude) * lonRatio;
    trainY = centerY - (data.latitude - centerLatitude) * latRatio;
  }

  return (
      <div className="map-container">
        <svg width={width} height={height} className="map">
          {stations.map(station =>
              <Station
                  key={station.stationShortCode}
                  x={centerX + (station.longitude - centerLongitude) * lonRatio}
                  y={centerY - (station.latitude - centerLatitude) * latRatio}
                  name={station.stationName}
              />
          )}
          <Train x={trainX} y={trainY} color={'green'}/>
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

export default Map;
