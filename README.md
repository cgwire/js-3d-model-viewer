# Javascript 3D Model Viewer 

A web viewer to display 3D models in the browser.

[Demo](https://cgwire.github.io/js-3d-model-viewer/)


## How to run

Get this library as a dependency:

```bash
npm install js-3d-model-viewer
```

Then run this snippet after the HTML of your page is loaded:

```javascript
import modelPlayer from 'js-3d-model-viewer'
const viewerElement = document.getElementById('viewer')
const opts = {
  grid: true,
  trackball: false,
  background: 'rgb(100, 100, 100)'
}
const scene = modelPlayer.prepareScene(viewerElement, opts)
modelPlayer.loadObject(scene, './assets/sample.obj') // Urls are fine here.
// Alternatively you can load a .glb file
modelPlayer.loadGlb(scene, './assets/sample.glb') // Urls are fine here.
```

You're done!

If you want to go fullscreen, you can do it like this:

```javascript
const viewerElement = document.getElementById('viewer')
const fullScreenButton = document.getElementById('fullscreen-button')
fullScreenButton.addEventListener('click', () => {
  modelPlayer.goFullScreen(viewerElement)
})
```

If you want to enable the underlying Thee.js cache:

```
modelPlayer.enableCache()
// modelPlayer.disableCache()
```

## Development status

* Currently the viewer supports only `.obj` and `.glb` files.
* Unit tests are missing


## Technologies

This viewer is based on [Three.js](https://threejs.org/)


## Development environment

First install dependencies:

```
npm i
```

All the code is in the `src/index.js` file. Once you did your changes you have to run the dev build:

```
npm run build
```

Then you can test it with the demo page by starting a static webserver:

```
npm run serve
```

You can see the result in the browser by connecting to
[http://localhost:9080](http://localhost:9080).

To build the projects for production you have to run the following command:

```
npm run build
```

You will obtained a minified version of the sources in the `dist` folder.


## Resources

* Tutorial: https://manu.ninja/webgl-3d-model-viewer-using-three-js/
* Obj loader: https://threejs.org/docs/#examples/loaders/OBJLoader
* Sketchfab viewer: https://sketchfab.com/developers/viewer


## About authors

This viewer is written by CG Wire, a company based in France. We help
animations studios to manage their production and build pipeline efficiently.

We apply software craftmanship principles as much as possible. We love coding
and consider that strong quality and good developer experience matter a lot.
Our extensive experience allows studios to get better at doing software and
focus more on the artistic work.

Visit [cg-wire.com](https://cg-wire.com) for more information.

[![CGWire Logo](https://zou.cg-wire.com/cgwire.png)](https://cg-wire.com)
