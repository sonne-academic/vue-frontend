export = OrbitControls;
declare class OrbitControls {
  constructor(object: any, domElement: any);
  object: any;
  domElement: any;
  enabled: any;
  target: any;
  minDistance: any;
  maxDistance: any;
  minZoom: any;
  maxZoom: any;
  minPolarAngle: any;
  maxPolarAngle: any;
  minAzimuthAngle: any;
  maxAzimuthAngle: any;
  enableDamping: any;
  dampingFactor: any;
  enableZoom: any;
  zoomSpeed: any;
  enableRotate: any;
  rotateSpeed: any;
  enablePan: any;
  panSpeed: any;
  screenSpacePanning: any;
  keyPanSpeed: any;
  autoRotate: any;
  autoRotateSpeed: any;
  enableKeys: any;
  keys: any;
  mouseButtons: any;
  target0: any;
  position0: any;
  zoom0: any;
  getPolarAngle: any;
  getAzimuthalAngle: any;
  saveState: any;
  reset: any;
  update: any;
  dispose: any;
  addEventListener(type: any, listener: any): void;
  dispatchEvent(event: any): void;
  hasEventListener(type: any, listener: any): any;
  removeEventListener(type: any, listener: any): void;
}
