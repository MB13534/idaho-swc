/**
 * This importer is heavily based off of the Mapbox CLI
 * tool called MTS Data Sync
 *
 * To learn more about Data Sync and the Mapbox Tiling Service
 * more generally, check out these links
 *
 * https://github.com/mapbox/mts-data-sync
 * https://www.mapbox.com/solutions/data-sync
 * https://github.com/mapbox/mapbox-sdk-js
 * https://docs.mapbox.com/mapbox-tiling-service/examples/
 * https://docs.mapbox.com/help/tutorials/get-started-mts-and-tilesets-cli/
 * https://docs.mapbox.com/api/maps/mapbox-tiling-service/#create-a-tileset
 * https://docs.mapbox.com/mapbox-tiling-service/reference/
 */

const axios = require('axios');
const mts = require('@mapbox/mapbox-sdk/services/tilesets');
const fs = require('fs');
const geojsonStream = require('geojson-stream');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '/../.env')});

/**
 * Configure file system paths used throughout the
 * ETL script
 */
const PATHS = {
  JOBS: path.join(__dirname, '/jobs'),
};

// base geojson that we will be building up in the script
let geojson = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * Utility used to fetch data from the ArcGIS service
 * Handles requesting the data as well as programmatically
 * paginating through the data
 * The ArcGIS services will only return 1000 records at a
 * time so we need to use a limit and offset approach to
 * request 1000 records at a time until no more records are
 * returned
 * We use recursion to accomplish this.
 * Each batch of 1000 records is then pushed to the `features`
 * property on our geojson variable
 * When all the records have been returned, we write the contents
 * of the geojson variable to a file that we can read from
 * later
 * @param {string} options.url API endpoint to hit
 * @param {number} options.offset Number of records that
 * request should be offset by
 * @param {number} options.limit Max number of records that
 * @param {string} options.filePath name of the file where the geojson should
 * ben written to
 * should be returned
 */
async function fetch({url, offset, limit, filePath}) {
  const finalUrl = !!limit
    ? `${url}&resultOffset=${offset}&resultRecordCount=${limit}`
    : url;

  const fetchMessage = !!limit
    ? `Fetching records ${offset} to ${offset + 1000}`
    : `Fetching records 0 to 1000`;

  console.log(fetchMessage);
  const {data} = await axios.get(finalUrl);

  if (data?.features?.length > 0 && !!limit) {
    geojson.features = [...geojson.features, ...data?.features];
    return fetch({url, offset: offset + 1000, limit});
  } else {
    fs.writeFileSync(filePath, JSON.stringify(geojson));
    return data;
  }
}

/**
 * Function used to read a geojson file and convert its
 * contents to the GeoJSON-LD format that is required by
 * the Mapbox Tiling Service
 * @param {string} readPath
 * @param {string} writePath
 */
async function convert(readPath, writePath) {
  try {
    const ldgeojson = fs.createWriteStream(writePath);
    console.log('Converting GeoJSON file...');
    return new Promise((resolve, reject) => {
      fs.createReadStream(readPath)
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

// setup the mts client
const mtsService = mts({accessToken: process.env.MAPBOX_ACCESS_TOKEN});

// kick off the sync process by deleting the tileset source
const deleteTilesetSource = async function (tilesetSourceId) {
  try {
    const response = await mtsService
      .deleteTilesetSource({id: tilesetSourceId})
      .send();
    if (response.statusCode === 204) {
      console.log(`Preparing tileset source data: ${tilesetSourceId}`);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

// kick off the sync process by deleting the tileset source
// create a tileset source aka upload your data
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

// validate the recipe
const validateRecipe = async function (recipe) {
  try {
    const response = await mtsService.validateRecipe({recipe: recipe}).send();
    if (response.body.valid) {
      console.log('Recipe validated');
      return response;
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error);
  }
};

const tilesetExists = async function (tilesetId) {
  try {
    const response = await mtsService.listTilesets().send();
    const exists = response.body.filter((tileset) => tileset.id === tilesetId);
    if (exists.length > 0) {
      console.log('Tileset already exists');
      console.log(exists);
      return response;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

// has the tileset been created? if not, create the tileset using the tileset source
const createTileset = async function (tilesetId, tilesetName, recipe) {
  try {
    const response = await mtsService
      .createTileset({
        tilesetId: tilesetId,
        recipe: recipe,
        name: tilesetName,
      })
      .send();
    console.log(`Tileset ${tilesetId} created`);
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// if the tileset exists, make sure it has the latest recipe
const updateRecipe = async function (tilesetId, recipe) {
  try {
    const response = await mtsService
      .updateRecipe({
        tilesetId: tilesetId,
        recipe: recipe,
      })
      .send();
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// publish the tileset
const publishTileset = async function (tilesetId) {
  try {
    const publishRequest = mtsService.publishTileset({
      tilesetId: tilesetId,
    });
    const response = await publishRequest.send();
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// log the job id and status message
const tilesetStatus = function (tilesetId) {
  setTimeout(checkStatus, 10000, tilesetId);
};

// Check job status and report warnings
const jobStatus = async function (tilesetId, jobId) {
  console.log('Checking completed job status...');
  try {
    const response = await mtsService
      .tilesetJob({
        tilesetId: tilesetId,
        jobId,
      })
      .send();
    return response.body;
  } catch (error) {
    console.log(error);
    return;
  }
};

/**
 * Request the status every 10s, logging the status to the console until it's 'success
 */
const checkStatus = async function (tilesetId) {
  try {
    const response = await mtsService
      .tilesetStatus({
        tilesetId: tilesetId,
      })
      .send();
    if (
      response.body.status === 'processing' ||
      response.body.status === 'queued'
    ) {
      console.log(`Status: ${response.body.status} ${response.body.id}`);
      console.log(response.body);
      tilesetStatus(tilesetId);
    } else if (response.body.status === 'success') {
      console.log(await jobStatus(tilesetId, response.body.latest_job));
      console.log(
        `Complete: opening https://studio.mapbox.com/tilesets/${response.body.id}/`
      );
    } else {
      console.log('Error creating tileset', response.body);
      console.log(await jobStatus(tilesetId, response.body.latest_job));
    }
  } catch (error) {
    console.log(error);
  }
};

async function runJob({config, mode}) {
  try {
    const readPath = path.join(
      __dirname,
      `/temp/${config.tilesetSourceId}.geojson`
    );
    const writePath = path.join(
      __dirname,
      `/temp/${config.tilesetSourceId}.geojson.ld`
    );
    await fetch({
      url: config.url,
      offset: 0,
      limit: 1000,
      filePath: readPath,
    });
    fs.writeFileSync(readPath, '');
    fs.writeFileSync(writePath, '');
    await convert(readPath, writePath);
    await deleteTilesetSource(config.tilesetSourceId);
    await createTilesetSource(config.tilesetSourceId, writePath);
    await validateRecipe(config.recipe);
    const tilesetAlreadyExists = await tilesetExists(config.tilesetId);
    if (!tilesetAlreadyExists) {
      await createTileset(config.tilesetId, config.tilesetName, config.recipe);
    } else {
      await updateRecipe(config.tilesetId, config.recipe);
    }

    if (mode === 'synchronous') {
      return await publishTileset(config.tilesetId);
    }
    await publishTileset(config.tilesetId);
    return await checkStatus(config.tilesetId);
  } catch (err) {
    console.log(err);
  }
}

const jobs = fs.readdirSync(PATHS.JOBS);

// TODO look into multilayer tiletsets
// https://docs.mapbox.com/help/troubleshooting/multilayer-tilesets/
async function processJobs({jobs, mode}) {
  if (mode === 'synchronous') {
    for (const job of jobs) {
      // clear out the temporary files
      console.log(`Job Starting - ${job}`);
      const config = fs.readFileSync(path.join(__dirname, `/jobs/${job}`), {
        encoding: 'utf-8',
      });
      await runJob({config: JSON.parse(config), mode});
      await checkStatus(config.tilesetId);
      console.log(`Job finished - ${job}`);
    }
  } else {
    jobs.forEach(async (job) => {
      console.log(`Job Starting - ${job}`);
      const config = fs.readFileSync(path.join(__dirname, `/jobs/${job}`), {
        encoding: 'utf-8',
      });
      runJob({config: JSON.parse(config), mode});
      console.log(`Job finished - ${job}`);
    });
  }
}

const mode = !!typeof process.argv[2]
  ? process.argv[2]
      .split('')
      .filter((_, i) => i > 1)
      .join('')
  : 'concurrent';

processJobs({
  jobs,
  mode,
});
