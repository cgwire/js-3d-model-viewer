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
const scene = modelPlayer.prepareScene(viewerElement)
modelPlayer.loadObject(scene, './assets/sample.obj') // Urls are fine here.
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

## Why
 
CG studios want to be able to perform a quick review of 3D models. Displaying a
model in the browser could help in solving this problem. On a broader aspect,
there is no open source 3D model viewer. Which is sad whent technologies like
WebGL and Three.js allow to display easily 3D geometries.


## Development status

* Currently the viewer supports only `.obj` files.
* It cannot load textures or materials.
* Unit tests are missing


## Technologies

This viewer is based on [Three.js](https://threejs.org/)


## Resources

* Tutorial: https://manu.ninja/webgl-3d-model-viewer-using-three-js/
* Obj loader: https://threejs.org/docs/#examples/loaders/OBJLoader
* Sketchfab viewer: https://sketchfab.com/developers/viewer


## About authors

This viewer is written by CG Wire, a company based in France. We help small to
midsize CG studios to manage their production and build pipeline efficiently.

We apply software craftmanship principles as much as possible. We love coding
and consider that strong quality and good developer experience matter a lot.
Our extensive experience allows studios to get better at doing software and
focus more on the artistic work.

Visit [cg-wire.com](https://cg-wire.com) for more information.

[![CGWire Logo](https://zou.cg-wire.com/cgwire.png)](https://cg-wire.com)
