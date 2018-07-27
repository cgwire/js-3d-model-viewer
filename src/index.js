import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'
const OrbitControls = require('three-orbit-controls')(THREE)
OBJLoader(THREE)

const setCamera = (aspect) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    aspect,
    1,
    1000
  )
  camera.position.z = 5
  camera.updateProjectionMatrix()
  return camera
}

const setLights = (scene) => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.25)
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  const keyLight = new THREE.DirectionalLight(
    new THREE.Color('#EEEEEE'),
    0.5
  )
  const fillLight = new THREE.DirectionalLight(
    new THREE.Color('#EEEEEE'),
    0.75
  )

  keyLight.position.set(-100, 0, 100)
  fillLight.position.set(100, 0, 100)
  backLight.position.set(100, 0, -100).normalize()
  ambient.intensity = 0.25

  scene.add(ambient)
  scene.add(keyLight)
  scene.add(fillLight)
  scene.add(backLight)
  return { keyLight, fillLight, backLight, ambient }
}

const setControls = (camera, renderer) => {
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  )
  controls.enableZoom = true
  camera.controls = controls
  return controls
}

const setRenderer = (width, height) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'))
  return renderer
}

const render = (element, renderer, scene, camera) => {
  element.appendChild(renderer.domElement)
  const animate = () => {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  return scene
}

const prepareScene = (domElement) => {
  const scene = new THREE.Scene()
  const element = domElement
  const width = element.offsetWidth
  const height = element.offsetHeight

  const camera = setCamera(width / height)
  const renderer = setRenderer(width, height, scene, camera)
  setControls(camera, renderer)
  setLights(scene)
  render(element, renderer, scene, camera)
  window.addEventListener(
    'resize',
    onWindowResize(element, camera, renderer),
    false
  )
  scene.camera = camera
  return scene
}

const loadObject = (scene, url, callback) => {
  if (scene.locked) return false
  const objLoader = new THREE.OBJLoader()
  const material = new THREE.MeshPhongMaterial({ color: 0xbbbbcc })
  scene.locked = true
  objLoader.load(url, (obj) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
    scene.add(obj)
    fitCameraToObject(scene.camera, obj)
    scene.locked = false
    if (callback) callback(obj)
  })
  return objLoader
}

const clearScene = (scene) => {
  scene.children.forEach((obj) => {
    if (obj.type === 'Group') {
      scene.remove(obj)
    }
  })
}

const resetCamera = (scene) => {
  scene.camera.controls.reset()
}

const goFullScreen = (element) => {
  const hasWebkitFullScreen = 'webkitCancelFullScreen' in document
  const hasMozFullScreen = 'mozCancelFullScreen' in document

  if (hasWebkitFullScreen) {
    return element.webkitRequestFullScreen()
  } else if (hasMozFullScreen) {
    return element.mozRequestFullScreen()
  } else {
    return false
  }
}

const onWindowResize = (element, camera, renderer) => () => {
  const width = element.offsetWidth
  const height = element.offsetHeight
  const aspect = width / height
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const fitCameraToObject = (camera, object) => {
  const fov = camera.fov
  const boundingBox = new THREE.Box3()
  const size = new THREE.Vector3()
  boundingBox.setFromObject(object)
  boundingBox.getSize(size)

  let cameraZ = Math.abs(size.y / 2 * Math.tan(fov * 2))
  camera.position.z = Math.max(cameraZ, size.z) * 1.5
  camera.updateProjectionMatrix()
}

export {
  prepareScene, loadObject, clearScene, resetCamera, goFullScreen
}
