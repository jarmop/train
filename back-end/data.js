const axios = require('axios');
const jsonfile = require('jsonfile');

const URL_TRACK_SECTIONS = 'https://rata.digitraffic.fi/api/v1/metadata/track-sections';
const URL_TRAIN_SCHEDULE = 'https://rata.digitraffic.fi/api/v1/trains/latest/8761';
// const URL_TRAIN = 'https://rata.digitraffic.fi/api/v1/trains/2018-03-16/8761';
const KEHARATA_1_TRACK_NUMBER = '001';
const KEHARATA_1_MAX_LENGTH = 7;
const KEHARATA_3_TRACK_NUMBER = '003';
const KEHARATA_3_MAX_LENGTH = 20;
const KEHARATA_123_TRACK_NUMBER = '123';
const KEHARATA_FILENAME = 'keharata[TRACK_NUMBER].json';

// Only stoppping points here. (Missing "gohst stations".)
const keharataStationsTrack1 = ['HKI', 'PSL', 'ILA', 'HPL'];
const keharataStationsTrack3 = [
  'HKI',
  'PSL',
  'KÄP',
  'OLK',
  'PMK',
  'ML',
  'TNA',
  'PLA',
  'TKL',
  'HKH',
];
const keharataStationsTrack123 = [
  'POH',
  'KAN',
  'MLO',
  'MYR',
  'LOH',
  'MRL',
  'LAV',
  'VKS',
  'VEH',
  'KTÖ',
  'AVP',
  'LEN',
  'ASO',
  'LNÄ',
];

// const getSectionLocationMetres = (section) => {
//   return section.ranges[0].startLocation.kilometres * 1000 +
//       section.ranges[0].startLocation.metres;
// };
//
// const getSectionLength = (section) => {
//   let {startLocation, endLocation} = section.ranges[0];
//   return (endLocation.kilometres * 1000 + endLocation.metres) -
//       (startLocation.kilometres * 1000 + startLocation.metres);
// };

const removeDuplicates = (sections) => {
  let hashTable = {};
  for (section of sections) {
    let trackAndCode = section.station + '-' + section.trackSectionCode;
    if (hashTable.hasOwnProperty(trackAndCode)) {
      console.log(trackAndCode);
    } else {
      hashTable[trackAndCode] = section;
    }
  }
  return Object.values(hashTable);
};

const filterKeharataSections = (sections) => {
  return sections.filter(section => {
    let isPartOfKeharata = false;
    for (range of section.ranges) {
      if (
          (
              [range.startLocation.track, range.endLocation.track]
                  .includes(KEHARATA_1_TRACK_NUMBER)
              &&
              range.endLocation.kilometres < KEHARATA_1_MAX_LENGTH
          )
          ||
          (
              [range.startLocation.track, range.endLocation.track]
                  .includes(KEHARATA_3_TRACK_NUMBER)
              &&
              range.endLocation.kilometres < KEHARATA_3_MAX_LENGTH
          )
          ||
          (
              [range.startLocation.track, range.endLocation.track]
                  .includes(KEHARATA_123_TRACK_NUMBER)
          )
      ) {
        isPartOfKeharata = true;
        break;
      }
    }
    return isPartOfKeharata;
  });
};

const filterSections = (sections) => {
  console.log('filterSections');
  console.log('total sections: ' + sections.length);
  filteredSections = filterKeharataSections(sections);

  // .filter(section => getSectionLength(section) > 0);

  filteredSections = removeDuplicates(filteredSections);

  // let multiRangeSections = 0;
  // for (section of filteredSections) {
  //   if (section.ranges.length > 1) {
  //     console.log(section.station + '-' + section.trackSectionCode);
  //     multiRangeSections++;
  //   }
  // }
  // let hashTable = {};
  // for (section of filteredSections) {
  //   hashTable[section.station] = 1;
  // }

  // 1 - 206 / 207
  // 3 - 328 / 328
  // 123 - 129 / 132
  // console.log(multiRangeSections);
  console.log(filteredSections.length);
  // console.log(Object.keys(hashTable).length);
  // console.log(Object.keys(hashTable));
  // console.log(filteredSections);

  return filteredSections;

};

const fetchTrackSections = () => {
  return axios.get(URL_TRACK_SECTIONS)
      .then(response => response.data)
      .catch(error => {
        console.log(error);
      });
};

exports.initializeKeharata = () => {
  fetchTrackSections()
      .then(sections => filterSections(sections))
      .then(sections => jsonfile.writeFile('data/sections.json', sections,
          (error) => {
            if (error) {
              console.log(error);
            }
            console.log(KEHARATA_FILENAME + ' saved!');
          },
      ));
};

exports.getKeharataTrackSections = () => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(KEHARATA_FILENAME, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};