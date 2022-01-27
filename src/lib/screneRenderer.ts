import * as THREE from 'three';
import orbitControlsCreator from 'three-orbit-controls';

/*
 * Allow the camera to orbit around a target
 */
const OrbitControls = orbitControlsCreator(THREE);

/**
 * Creates orbit controller
 * @param domElement HTML canvas element
 */
export const createOrbitControls = (camera: THREE.Camera, domElement?: HTMLElement) => {
  const orbit = new OrbitControls(camera, domElement);

  orbit.enableKeys = true;
  orbit.enableZoom = true;

  return orbit;
};

/**
 * Creates lights for the scene
 * @param color Lights color
 */
export const createLights = (color: number = 0xffffff): THREE.Light[] => {
  const ambientLight = new THREE.AmbientLight(color);
  const lights = [];

  lights[0] = new THREE.PointLight(color, 1, 0);
  lights[1] = new THREE.PointLight(color, 1, 0);
  lights[2] = new THREE.PointLight(color, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);

  return [ambientLight, lights[0], lights[1], lights[2]];
};

/**
 * Creates webgl renderer
 * @param canvas The html canvas node
 */
export const createRenderer = (canvas: HTMLCanvasElement): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });

  // Clear color
  renderer.setClearColor(0x0);

  // Clear alpha
  renderer.setClearAlpha(0);

  // Pixel ration setting
  renderer.setPixelRatio(window.devicePixelRatio);

  // Size setting
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
};

/**
 * Creates camera object
 * @param initDistance Initial distance from center
 */
export const createCamera = (initDistance: number = 80) => {
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = initDistance;

  return camera;
};

/**
 * Creates a clock object
 */
export const createClock = () => new THREE.Clock();

/**
 * Creates a scene object
 */
export const createScene = () => new THREE.Scene();
