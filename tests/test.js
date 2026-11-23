const modelPlayer = window.Js3dModelViewer
const expect = chai.expect
const viewerElement = document.getElementById('viewer')
const scene = modelPlayer.prepareScene(viewerElement, { grid: true })

const loadObject = (scene, url, mtlUrl) => new Promise((resolve) => {
  modelPlayer.loadObject(scene, url, mtlUrl, resolve)
})
const loadGlb = (scene, url) => new Promise((resolve) => {
  modelPlayer.loadGlb(scene, url, resolve)
})
const models = (scene) => scene.children.filter(
  (obj) => obj.type === 'Group' && obj !== scene.lights.group
)

// Returns true if the 8 corners of the object bounding box are in the camera view.
const isInView = (camera, object) => {
  object.updateMatrixWorld(true)
  camera.updateMatrixWorld()
  let box = null
  object.traverse((child) => {
    if (!child.isMesh) return
    child.geometry.computeBoundingBox()
    const childBox = child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld)
    box = box ? box.union(childBox) : childBox
  })
  const Vector3 = camera.position.constructor
  return [box.min.x, box.max.x].every((x) =>
    [box.min.y, box.max.y].every((y) =>
      [box.min.z, box.max.z].every((z) => {
        const p = new Vector3(x, y, z).project(camera)
        return Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && p.z <= 1
      })
    )
  )
}

describe('prepareScene', function () {
  it('works without options', function () {
    const element = document.createElement('div')
    const otherScene = modelPlayer.prepareScene(element)
    expect(otherScene.camera).to.not.be.undefined
    expect(otherScene.grid).to.be.undefined
  })

  it('sets the camera, the element and the grid', function () {
    expect(scene.camera).to.not.be.undefined
    expect(scene.element).to.eq(viewerElement)
    expect(scene.grid.visible).to.be.true
    expect(scene.upAxis).to.eq('y')
  })

  it('sets the background color', function () {
    const element = document.createElement('div')
    const otherScene = modelPlayer.prepareScene(element, { background: '#ff0000' })
    expect(otherScene.background.getHexString()).to.eq('ff0000')
  })

  it('adds all the lights to the scene, in one group', function () {
    const { group, ...lights } = scene.lights
    expect(scene.children).to.include(group)
    expect(Object.keys(lights)).to.have.members([
      'hemiLight', 'keyLight', 'keyLight2', 'backLight', 'backLight2'
    ])
    Object.values(lights).forEach((light) => {
      expect(light.parent).to.eq(group)
    })
  })
})

describe('loadObject', function () {
  this.timeout(10000)

  afterEach(function () {
    modelPlayer.clearScene(scene)
  })

  it('loads an .obj file and shows it in the camera view', async function () {
    const obj = await loadObject(scene, '../assets/sample.obj')
    expect(models(scene)).to.deep.eq([obj])
    expect(scene.locked).to.be.false
    expect(isInView(scene.camera, obj)).to.be.true
  })

  it('loads an .obj file with its .mtl materials', async function () {
    const obj = await loadObject(scene, '../assets/sample_03.obj', '../assets/sample_03.mtl')
    const materialNames = []
    obj.traverse((child) => {
      if (child.isMesh) materialNames.push([].concat(child.material)[0].name)
    })
    expect(materialNames.every((name) => name !== '')).to.be.true
    expect(isInView(scene.camera, obj)).to.be.true
  })

  it('refuses a second load while a model loads', async function () {
    const loading = loadObject(scene, '../assets/sample.obj')
    expect(modelPlayer.loadObject(scene, '../assets/sample_03.obj')).to.be.false
    await loading
    expect(models(scene)).to.have.length(1)
  })

  it('sends an error event and unlocks the scene if the file is missing', async function () {
    const errorEvent = new Promise((resolve) => {
      viewerElement.addEventListener('error', resolve, { once: true })
    })
    await loadObject(scene, '../assets/missing.obj')
    await errorEvent
    expect(scene.locked).to.be.false
    expect(models(scene)).to.have.length(0)
  })
})

describe('loadGlb', function () {
  this.timeout(10000)

  afterEach(function () {
    modelPlayer.clearScene(scene)
  })

  it('loads a .glb file and shows it in the camera view', async function () {
    const gltf = await loadGlb(scene, '../assets/room.glb')
    expect(models(scene)).to.deep.eq([gltf.scene])
    expect(scene.locked).to.be.false
    expect(isInView(scene.camera, gltf.scene)).to.be.true
  })

  it('sends an error event and unlocks the scene if the file is missing', async function () {
    const errorEvent = new Promise((resolve) => {
      viewerElement.addEventListener('error', resolve, { once: true })
    })
    await loadGlb(scene, '../assets/missing.glb')
    await errorEvent
    expect(scene.locked).to.be.false
  })
})

describe('up option', function () {
  this.timeout(10000)

  it('turns Z-up models to the Y-up axis', async function () {
    const element = document.createElement('div')
    element.style.width = '400px'
    element.style.height = '300px'
    document.body.appendChild(element)
    const zScene = modelPlayer.prepareScene(element, { up: 'z' })
    expect(zScene.upAxis).to.eq('z')
    const obj = await loadObject(zScene, '../assets/sample.obj')
    expect(obj.rotation.x).to.eq(-Math.PI / 2)
    expect(isInView(zScene.camera, obj)).to.be.true
    element.remove()
  })
})

describe('clearScene', function () {
  this.timeout(10000)

  it('removes the models and keeps the lights and the grid', async function () {
    await loadObject(scene, '../assets/sample.obj')
    modelPlayer.clearScene(scene)
    expect(models(scene)).to.have.length(0)
    expect(scene.children).to.include(scene.lights.group)
    expect(scene.children).to.include(scene.grid)
  })
})

describe('showGrid and hideGrid', function () {
  it('shows and hides the grid', function () {
    modelPlayer.hideGrid(scene)
    expect(scene.grid.visible).to.be.false
    modelPlayer.showGrid(scene)
    expect(scene.grid.visible).to.be.true
  })
})

describe('resetCamera', function () {
  it('puts the camera back to its initial position', function () {
    scene.camera.position.set(20, 15, 5)
    modelPlayer.resetCamera(scene)
    const { x, y, z } = scene.camera.position
    expect(x).to.be.closeTo(0, 1e-9)
    expect(y).to.be.closeTo(0, 1e-9)
    expect(z).to.be.closeTo(5, 1e-9)
  })
})
