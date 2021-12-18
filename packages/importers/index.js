require('dotenv').config();
const axios = require('axios');
const mts = require('@mapbox/mapbox-sdk/services/tilesets');
const fs = require('fs');
const geojsonStream = require('geojson-stream');

const url =
  'https://gis.bisclient.com/maps01/rest/services/BellPropertySearch/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';

async function writeData(url) {
  const {data} = await axios.get(url);
  fs.writeFileSync('./output.geojson', JSON.stringify(data));
}

writeData(url);

async function convertData(geojson) {
  try {
    const ldgeojson = fs.createWriteStream(geojson + '.ld');
    console.log('Converting GeoJSON file...');
    return new Promise((resolve, reject) => {
      fs.createReadStream(geojson)
        .pipe(
          geojsonStream.parse((row) => {
            if (row.geometry.coordinates === null) {
              return null;
            }
            return JSON.stringify(row) + '\r\n';
          })
        )
        .pipe(ldgeojson)
        .on('finish', () => {
          console.log('Finished writing file...');
          resolve(true);
        })
        .on('error', reject);
    });
  } catch (err) {
    console.log(err);
  }
}

const mtsService = mts({accessToken: process.env.MAPBOX_ACCESS_TOKEN});
console.log(mtsService);

// create a tileset source
const createTilesetSource = async function (
  tilesetSourceId,
  tilesetSourcePath
) {
  console.log('Uploading the source data...');
  try {
    const response = await mtsService
      .createTilesetSource({id: tilesetSourceId, file: tilesetSourcePath})
      .send();
    console.log(
      `Tileset source created: ${response.body.id}. Files ${response.body.files}, Size: ${response.body.file_size} bytes`
    );
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

async function handleStuff() {
  // await convertData('./output.geojson');
  // createTilesetSource('clearwater_parcel_test2', './output.geojson.ld');

  // mtsService
  //   .createTileset({
  //     tilesetId: 'txclearwater.parcel_test',
  //     recipe: {
  //       version: 1,
  //       layers: {
  //         parcel_test: {
  //           source:
  //             'mapbox://tileset-source/txclearwater/clearwater_parcel_test2',
  //           minzoom: 0,
  //           maxzoom: 5,
  //         },
  //       },
  //     },
  //     name: 'Parcel Test 2',
  //   })
  //   .send()
  //   .then((response) => {
  //     const message = response.body.message;
  //     console.log(message);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  mtsService
    .publishTileset({
      tilesetId: 'txclearwater.parcel_test',
    })
    .send()
    .then((response) => {
      const tilesetPublishJob = response.body;
      console.log(tilesetPublishJob);
    })
    .catch((err) => {
      console.error(err);
    });
}

handleStuff();

/**
 * Resources
 * https://docs.mapbox.com/mapbox-tiling-service/examples/
 * https://docs.mapbox.com/help/tutorials/get-started-mts-and-tilesets-cli/
 * https://docs.mapbox.com/api/maps/mapbox-tiling-service/#create-a-tileset
 * https://github.com/mapbox/mapbox-sdk-js
 * https://docs.mapbox.com/mapbox-tiling-service/reference/
 */
