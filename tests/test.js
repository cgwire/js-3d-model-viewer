const modelPlayer = window['js-3d-model-viewer'];
const viewerElement = document.getElementById('viewer');
const scene = modelPlayer.prepareScene(viewerElement);

describe('prepareScene', function () {
  it('Scene should have a camera', function () {
    chai.expect(scene.camera).to.not.be.undefined
  })
  it('Scene should have an element', function () {
    chai.expect(scene.element).to.not.be.undefined
  })
})

describe('loadObject', function () {
  it.skip('should have an object loaded', function (done) {
    modelPlayer.loadObject(scene, '../assets/sample.obj', null, () => {
      console.log(scene.children)
      done()
    })
    viewerElement.addEventListener('error', (err) => {
      throw err.detail.err
    })
  })
})

describe('clearScene', function () {
  it.skip('should be a scene without object', function () {
  })
})

describe('resetCamera', function () {
  it('should be a camera with default coordinates', function () {
    const initialPosition = {
      ...scene.camera.position
    }
    const initialRotation = {
      ...scene.camera.rotation
    }
    scene.camera.position.x = 20
    scene.camera.position.y = 15
    scene.camera.position.z = 5

    modelPlayer.resetCamera(scene)
    chai.expect(scene.camera.position.x).to.eq(initialPosition.x)
    chai.expect(scene.camera.position.y).to.eq(initialPosition.y)
    chai.expect(scene.camera.position.z).to.eq(initialPosition.z)
  })
})
