# The Public Map

This document is intended to serve as a rough companion piece to the Clearwater Public Map. It describes the general approach used, key parts of the system across different packages, and potential gotchas. These docs are not 100% complete yet.

## Overview

For starters, [Mapbox](https://www.mapbox.com/) and [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) are at the core of the public map. While not perfect, Mapbox provides the easiest way to build highly interactive and performant web maps. There are definitely some quirks to working with Mapbox GL JS in a full stack JS. These include

- managing the state and life cycle of the Map instance and frontend application state
- things like sources and layers need to be defined using the [Mapbox Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)

If parts of the frontend seem a little funky or you are scratching your head as to why it is setup that way, that is most likely why. I tried to add code comments wherever possible to minimize confusion though.

With those caveats established, let's dive into core parts of the system.

## The Frontend

All of the frontend code related to the public map lives in the `/frontend/pages/publicMap` directory. I intentionally sandboxed all of the related components and hooks in this directory to make it obvious where different parts of the logic live. As the map continues to evolve, you should 100% feel free to move the components and hooks out the respective common directories.

### Guiding Development Philosophy

I still haven't found a way of working with Mapbox GL JS and React that I am 100% happy with, but the best approach I have found thus far is to isolate the Mapbox-specific logic and keep it separate from the UI. This results in better React components that are more flexible and ensures that the Mapbox GL JS logic lives in one place. The best way I have found to accomplish this is through a custom React hook. Meet our `useMap` hook.

The `useMap` hook handles all things Mapbox GL JS. Everything from rendering the map to controlling the layer styles, filters, and visibility. The hook provides an easy way to sandbox some of the messier logic and keep it separate from our React components. The custom hook additionally makes it simple to expose functions that can be used by our components to update the map.

For instance, one of the functions returned from `useMap` is `updateLayerVisibility`. The function wraps all of the logic required to change if a layer is visible or hidden in Mapbox GL JS. This exposed function can then be easily passed to a component to control a layer's visibility and the component has to know very little about the map.

** As a general rule of thumb, if you are writing some logic that leverages Mapbox GL JS, it should probably live in the `useMap` hook.**

## Hooks

Custom hooks are a key part of the public map. I have found that they provide a really nice way to isolate complex logic but to still have the results of that logic be easily accessible by components. In addition to the `useMap` hooks, I setup the following:

- `useFilters`
  - controls a lot of the logic for the map filter controls
- `useLayers`
  - handles fetching a list of map layers to display from the API and exposes a method for updating the layers
- `useSources`
  - handles fetching a list of map sources to display from the API and exposes a method for updating the sources
- `useLayerStyles`
  - controls a lot of the logic related to the 'Color Wells by' control

## Backend

There really is not too much happening in the API. Pretty much all of the public map-related logic lives in the `PublicMapRoutes.js` file. This files exposes routes for fetching sources, layers, and filter options for the map.

The most important thing to note is that the list of sources and layers to display on the map are not specified in the frontend. They are declared as hardcoded variables in the `PublicMapRoutes.js` file. The `sources` and `layers` variables are both arrays of objects that follow the Mapbox [Source](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) and [Layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/) style specifications respectively. As a result, the structure of the source and layer objects are very strict. If there are any custom layer or source attributes that needed be added to a source or layer, a property called `lreProperties` should be added to the object. You can then add custom properties to your hearts content and this provides us a way to sandbox our configuration from Mapbox's.

We recently added support for making certain layers only visible to certain roles. This is accomplished through the `lreProperties` key on a layer config. To limit a layer to certain roles you just need to setup the layer as follows (note the addition of the `permissions` key to the `lreProperties` key):

```js
module.exports = {
  id: 'proposed-management-zones-fill',
  name: 'Proposed Management Zones',
  type: 'fill',
  source: 'proposed-management-zones',
  'source-layer': 'Proposed_Management_Zones-bd97ag',
  paint: {
    'fill-color': 'hsla(83, 89%, 57%, 0.14)',
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'proposed-management-zones',
    permissions: {
      roles: ['Administrator', 'Developer'],
    },
  },
};
```

## Importers

Coming soon. In the interim, just reach out to Ben Tyler with any questions.

## Resources

For some Mapbox guides, check out Ben Tyler's ["Building Interactive Maps with React" course](https://www.notion.so/Building-Interactive-Maps-with-React-ebf3a3e6a5294a5885a2963cec397eb6).
