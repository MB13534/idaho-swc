# Importers

The Importers package is meant to serve as a clearing house for all extract, load, and transform (ETL) scripts. If we need to request data from a third party, transform, and then upload it somewhere (i.e. our DB, Mapbox, etc) and we can't do it directly in the Postgres DB, it should live in this repo. Below you will find a description of each importer.

## ArcGIS to Mapbox

This importer is responsible for requesting data from an ArcGIS API endpoint and uploading it to Mapbox as a Tileset.

### Why Do We Need This Importer?

ESRI provides relatively easy access to spatial data hosted on their platform in GeoJSON format. However, they only allow you to access 1000 records in a single request and the types of layers we are working with (i.e. parcels and streets) have far more features than that. Additionally, adding GeoJSON directly to a Mapbox map works does not work well for layers with a lot of features and/or complex geometries (works great for small layers though). For large layers, it is best to use Mapbox's optimized solution called [Tilesets](https://docs.mapbox.com/studio-manual/reference/tilesets/).

All of the above is a long way of saying we needed a way to display more than 1000 records at a time in a performant way so we needed to figure out a way to programmatically get data from ESRI to Mapbox.

### What Does the Importer Do?

Put very simply, the importer runs through the following steps:

1. Request data from an ArcGIS API endpoint. Requests 1000 records at a time using offset and limit arguments to build up a GeoJSON object that contains every layer feature
2. Write the built up GeoJSON object to a file that can be read from later
3. Read the GeoJSON file and convert it to the [GeoJSON-LD](https://geojson.org/geojson-ld/) format that is required by Mapbox
4. Upload the GeoJSON-LD to Mapbox and execute logic responsible for converting the GeoJSON to a Mapbox Tileset and publishing it

### How Do I Configure an Importer Job for a New Layer?

Open up the `packages/importers/arcgisToMapbox/jobs` directory and create a new file following the `[LAYER_NAME].json` convention. This file is a configuration file for the importer job - each layer should have their own config. Here is an example of the configuration for the job responsible for importing the Bell CAD Parcels.

```json
{
  "recipe": {
    "version": 1,
    "layers": {
      "parcel_test": {
        // format of "mapbox://tileset-source/{username}/{tilesetSourceId}"
        "source": "mapbox://tileset-source/txclearwater/bell_cad_parcels",
        "minzoom": 12,
        "maxzoom": 16
      }
    }
  },
  "tilesetName": "Bell CAD Parcels",
  // format for tilsetId is {username}.{whateveryouwant}
  "tilesetId": "txclearwater.bell_cad_parcels",
  "tilesetSourceId": "bell_cad_parcels",
  "url": "https://gis.bisclient.com/maps01/rest/services/BellPropertySearch/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
}
```

So what do all these configuration options do?

**`recipe`**

The `recipe` property refers to a Mapbox Tileset recipe. They have pretty decent docs so no need for me to go in depth here. Check out their docs over [here](https://docs.mapbox.com/mapbox-tiling-service/reference/).

**tilesetName**

The display name for the tileset that will be displayed in the Mapbox Studio UI

**tilesetId**

The unique identifier for the tileset. Should follow the format of `{username}.{id}`. The id argument can be whatever you like. I like to make the id portion match whatever I have set for the `tilesetSourceId` argument and what I have set for the last portion of the `source` argument in the recipe configuration. Reference the code snippet above where `bell_cad_parcels` is used across all three.

**tilesetSourceId**

A unique identifier for the tileset source. As mentioned in the `tilesetId` explanation, I like to have this match the last parts of the `tilsetId` and `source` configuration options like in the snippet above.

**url**

The ArcGIS API endpoint where you will be requesting data from.

## Questions

I did my best to document these processes but you can always reach out to me (Ben Tyler).
