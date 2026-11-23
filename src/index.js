import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
// const USDZLoader = require('three-usdz-loader')

const emitEvent = (element, eventName, data) => {
  element.dispatchEvent(new window.CustomEvent(eventName, {
    detail: data
  }))
}

/*
 * Enable three.js cache.
 */
const enableCache = () => {
  THREE.Cache.enable = true
}

/*
 * Disable three.js cache.
 */
const disableCache = () => {
  THREE.Cache.enable = false
}

/*
 * Default configuration for camera.
 */
const setCamera = (aspect) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    aspect,
    0.01,
    1000
  )
  camera.position.z = 5
  camera.updateProjectionMatrix()
  return camera
}

/*
 * Add lights to given scene. They are grouped in scene.lights.group, so the
 * user can move one light or rotate all of them (e.g. for Z-up models).
 */
const setLights = (scene) => {
  const directionalLight = (intensity, x, y, z) => {
    const light = new THREE.DirectionalLight(new THREE.Color('#EEEEEE'), intensity)
    light.position.set(x, y, z)
    return light
  }
  const keyLight = directionalLight(2.8, -100, 0, 100)
  const keyLight2 = directionalLight(1.25, 100, -100, 100)
  const backLight = directionalLight(2.5, 100, 0, -100)
  const backLight2 = directionalLight(1.9, -100, 0, -100)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3)
  hemiLight.groundColor.setHSL(0.095, 1, 0.95)
  hemiLight.position.set(0, 100, 0)
  keyLight.castShadow = true

  const group = new THREE.Group()
  group.add(hemiLight, keyLight, keyLight2, backLight, backLight2)
  scene.add(group)
  scene.lights = { group, hemiLight, keyLight, keyLight2, backLight, backLight2 }
  return scene
}

/*
 * Link an orbit control to given camera and renderer.
 */
const setControls = (camera, renderer, isTrackball) => {
  let controls

  if (isTrackball) {
    controls = new TrackballControls(
      camera,
      renderer.domElement
    )
  } else {
    controls = new OrbitControls(
      camera,
      renderer.domElement
    )
  }
  controls.enableZoom = true
  camera.controls = controls
  return controls
}

/*
 * Configure Three renderer.
 */
const setRenderer = (width, height) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  return renderer
}

/*
 * Render function required by Three.js to display things.
 */
const render = (element, renderer, scene, camera, isTrackball) => {
  element.appendChild(renderer.domElement)
  const animate = () => {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // trackball controls needs to be updated in the animation loop before it will work
    if (isTrackball) camera.controls.update()
  }
  animate()
  return scene
}

/*
 * Build the scene in which the object will be displayed. It configures Three
 * properly and adds camera, lights and controls.
 */
const prepareScene = (domElement, opts) => {
  const scene = new THREE.Scene()
  const element = domElement
  const width = element.offsetWidth
  const height = element.offsetHeight

  const camera = setCamera(width / height)
  const renderer = setRenderer(width, height, scene, camera)
  setControls(camera, renderer, opts.trackball)
  setLights(scene)
  if (opts.grid) {
    showGrid(scene)
  }
  render(element, renderer, scene, camera, opts.trackball)
  window.addEventListener(
    'resize',
    onWindowResize(element, camera, renderer),
    false
  )
  scene.camera = camera
  scene.element = domElement
  if (opts.background) scene.background = new THREE.Color(opts.background)
  return scene
}

/*
 * Load a mesh (.obj) into the given scene. Materials can be specified too
 * (.mtl).
 */
const loadObject = (scene, url, materialUrl, callback) => {
  const objLoader = new OBJLoader()
  if (scene.locked) return false
  scene.locked = true

  if (materialUrl) {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(materialUrl, (materials) => {
      materials.preload()
      objLoader.setMaterials(materials)
      loadObj(objLoader, scene, url, callback)
    })
  } else {
    loadObj(objLoader, scene, url, callback)
  }

  return objLoader
}

/*
 * Load mesh and materials (.glb) into the given scene.
 */
const loadGlb = (scene, url, callback) => {
  const loader = new GLTFLoader()
  if (scene.locked) return false
  scene.locked = true

  loader.load(url, (gltf) => {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
      }
    })
    scene.add(gltf.scene)
    fitCameraToObject(scene.camera, gltf.scene)
    scene.locked = false
    if (callback) callback(gltf)
    emitEvent(scene.element, 'loaded', {gltf})
  },
  (xhr) => {
    if (xhr.total === 0) {
      emitEvent(scene.element, 'loading', {
        loaded: 0,
        total: 100
      })
    } else {
      emitEvent(scene.element, 'loading', {
        loaded: xhr.loaded,
        total: xhr.total
      })
    }
  },
  (err) => {
    scene.locked = false
    emitEvent(scene.element, 'error', {err})
    if (callback) callback(err)
  })

  return loader
}


/*
const loadUsdz = (scene, url, callback) => {
  const loader = new USDZLoader()
  if (scene.locked) return false
  scene.locked = true

  const group = new THREE.Group()
  scene.add(group)
  loader.loadFile(file, group)
    .then(model => {
      fitCameraToObject(scene.camera, model)
      scene.locked = false
      if (callback) callback(model)
      emitEvent(scene.element, 'loaded', {model})
      return Promise.resolve(model)
    })
}
*/


/*
 * Load an .obj file. If no materials is configured on the loader, it sets
 * a phong grey material by default.
 */
const loadObj = (objLoader, scene, url, callback) => {
  const material = new THREE.MeshPhongMaterial({ color: 0xbbbbcc })

  objLoader.load(url, (obj) => {
    if (!objLoader.materials) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material
        }
      })
    }
    scene.add(obj)
    fitCameraToObject(scene.camera, obj)
    scene.locked = false
    if (callback) callback(obj)
    emitEvent(scene.element, 'loaded', {obj})
  },
  (xhr) => {
    if (xhr.total === 0) {
      emitEvent(scene.element, 'loading', {
        loaded: 0,
        total: 100
      })
    } else {
      emitEvent(scene.element, 'loading', {
        loaded: xhr.loaded,
        total: xhr.total
      })
    }
  },
  (err) => {
    scene.locked = false
    emitEvent(scene.element, 'error', {err})
    if (callback) callback(err)
  })
}

/*
 * Remove all meshes from the scene.
 */
const clearScene = (scene) => {
  [...scene.children].forEach((obj) => {
    if (obj.type === 'Group' && obj !== scene.lights.group) {
      scene.remove(obj)
    }
  })
}

/*
 * Put back camera in its original position.
 */
const resetCamera = (scene) => {
  scene.camera.controls.reset()
}

/*
 * Put back camera in its original position.
 */
const showGrid = (scene) => {
  if (!scene.grid) {
    const size = 10
    const divisions = 10
    const gridHelper = new THREE.GridHelper(size, divisions)
    scene.add(gridHelper)
    scene.grid = gridHelper
  } else {
    scene.grid.visible = true
  }
}

const hideGrid = (scene) => {
  scene.grid.visible = false
}

/*
 * Display the viewer through the fullscreen feature of the browser.
 */
const goFullScreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
    return true
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
    return true
  }
  return false
}

/*
 * When the window is resized, the camera aspect ratio needs to be updated to
 * avoid distortions.
 */
const onWindowResize = (element, camera, renderer) => () => {
  const resize = () => {
    const isFullscreen = (document.fullscreenElement || document.webkitFullscreenElement) === element
    const width = isFullscreen ? window.innerWidth : element.offsetWidth
    const height = isFullscreen ? window.innerHeight : element.offsetHeight
    const aspect = width / height
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  resize()
  setTimeout(resize, 100)
}

/*
 * Depending on the object size, the camera Z position must be bigger or
 * smaller to make sure the object fill all the space without getting outside
 * camera point of view.
 */
const fitCameraToObject = (camera, object) => {
  const fov = camera.fov
  const boundingBox = new THREE.Box3()
  const size = new THREE.Vector3()
  boundingBox.setFromObject(object)
  resetObjectPosition(boundingBox, object)
  boundingBox.getSize(size)

  const fitSize = Math.max(size.y, size.x / camera.aspect)
  const cameraZ = fitSize / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2))
  const z = (cameraZ + size.z / 2) * 1.2
  // object sits on the grid, so aim at its middle height
  camera.position.set(0, size.y / 2, z)
  camera.controls.target.set(0, size.y / 2, 0)
  camera.controls.update()
  camera.updateProjectionMatrix()
}

/*
 * Center object on X and Z, and put its base on the grid (Y = 0).
 */
const resetObjectPosition = (boundingBox, object) => {
  const size = new THREE.Vector3()
  boundingBox.setFromObject(object)
  boundingBox.getSize(size)
  object.position.x = -boundingBox.min.x - size.x / 2
  object.position.y = -boundingBox.min.y
  object.position.z = -boundingBox.min.z - size.z / 2
  object.rotation.z = 0
}

export {
  prepareScene,
  loadObject,
  loadGlb,
  // loadUsdz,
  clearScene,
  resetCamera,
  goFullScreen,
  showGrid,
  hideGrid,
  enableCache,
  disableCache
}
