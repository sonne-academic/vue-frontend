import * as THREE from 'three';
import * as d3 from 'd3-hierarchy';
import OrbitControls from 'three-orbitcontrols';
import { EllipseCurve } from 'three';

export interface Node {
  parent?: string;
  children?: string[];
  id: string;
  name: string;
}

interface Position {
  x: number;
  y: number;
}


export class RenderThing {
  private container: Element | null = null;
  // private stats;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer;

  private points: THREE.Points;
  private pointGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  private pointPositions: Float32Array;
  private pointPositionsAttrib: THREE.BufferAttribute;
  private pointColorsAttrib: THREE.BufferAttribute;
  private pointColors: Float32Array;

  private lines: THREE.LineSegments;
  private lineGeometry: THREE.BufferGeometry;
  private linePositions: Float32Array;
  private linePositionsAttrib: THREE.BufferAttribute;
  private lineColors: Float32Array;
  private lineColorsAttrib: THREE.BufferAttribute;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private controls: OrbitControls | null = null;

  private mouseX: number = 0;
  private mouseY: number = 0;
  constructor() {
    //
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 5, 3500 );
    // this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 5, 3500 );
    this.camera.position.z = 1000;
    // const helper = new THREE.CameraHelper(this.camera);
    // this.scene.add(helper);

    this.scene.background = new THREE.Color( 0xFFFFFF );
    this.scene.fog = new THREE.Fog( 0xFFFFFF, 2000, 3500 );
    //
    const pointCount = 5000;
    // this.pointGeometry = new THREE.BufferGeometry();
    this.pointPositions = new Float32Array(pointCount * 3);
    this.pointColors = new Float32Array(pointCount * 3);
    this.make_random_points(pointCount);
    this.pointPositionsAttrib = new THREE.BufferAttribute( this.pointPositions, 3 ) ;
    this.pointColorsAttrib = new THREE.BufferAttribute( this.pointColors, 3 ) ;
    this.pointGeometry.addAttribute( 'position', this.pointPositionsAttrib);
    this.pointGeometry.addAttribute( 'color', this.pointColorsAttrib);
    this.pointGeometry.computeBoundingSphere();
    //
    const materialParams: THREE.PointsMaterialParameters = {
      size: 15,
      vertexColors: THREE.VertexColors,
    };
    const pointMaterial = new THREE.PointsMaterial( materialParams );
    const sprite = new THREE.TextureLoader().load('/disc.png');
    const mtlParams2: THREE.PointsMaterialParameters =  {
      size: 10,
      sizeAttenuation: false,
      map: sprite,
      alphaTest: 0.5,
      transparent: true,
      vertexColors: THREE.VertexColors,
    };
    const pointMaterialDisc = new THREE.PointsMaterial(mtlParams2);
    this.points = new THREE.Points( this.pointGeometry, pointMaterialDisc );
    this.scene.add( this.points );
    this.lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    this.linePositions = new Float32Array(pointCount * 3 * 2);
    this.linePositionsAttrib = new THREE.BufferAttribute(this.linePositions, 3);
    this.lineColors = new Float32Array(pointCount * 3 * 2);
    this.lineColorsAttrib = new THREE.BufferAttribute(this.lineColors, 3);
    this.lineGeometry.addAttribute('position', this.linePositionsAttrib);
    this.lineGeometry.addAttribute('color', this.lineColorsAttrib);
    this.lines = new THREE.LineSegments(this.lineGeometry, lineMaterial);
    // this.lines = new THREE.LineSegments(this.lineGeometry);
    this.scene.add(this.lines);
    //
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.renderer.setSize( 400, 400 );
  }

  public init(el: Element) {
    // this.stats = new Stats();
    this.container = el;
    el.appendChild( this.renderer.domElement );
    document.addEventListener('mousemove', (evt) => {this.onDocumentMouseMove(evt); }, false);
    window.addEventListener( 'resize', () => {this.onWindowResize(); }, false );
    // if you do not pass an element the orbitcontrols will steal focus
    // from every other element. You can't click into a textbox etc...
    const ctrl = new OrbitControls(this.camera, el as HTMLElement);
    ctrl.minDistance = 1000;
    ctrl.maxDistance = 3500;
    ctrl.enabled = true;
    ctrl.maxPolarAngle = Math.PI / 2;
    ctrl.minPolarAngle = Math.PI / 2;
    ctrl.maxAzimuthAngle = 0;
    ctrl.minAzimuthAngle = 0;
    this.controls = ctrl;
    this.animate();
  }
  public onDocumentMouseMove(evt: MouseEvent) {
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
    this.mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
  }
  public onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  public updateNodes(nodes: Map<string, Node>) {
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.9;

    const strat = d3.stratify<Node>()
      .id((d) => d.id)
      .parentId((d) => d.parent)
      ([...nodes.values()]);
    const tree = d3.tree<Node>()
      .size([width, height])
      (strat);
    this.updatePositions(tree.descendants());
    this.updateLines(tree.links());
  }

  public updateLines(newLines: Array<d3.HierarchyPointLink<Node>>)  {
    let counter = 0;
    const color = new THREE.Color();
    const nodeCount = newLines.length * 2;
    for (const link of newLines) {
      color.setHSL(counter / nodeCount, 0.7, 0.7);

      this.linePositions[counter * 3 + 0 ] = link.target.x - window.innerWidth / 2;
      this.linePositions[counter * 3 + 1 ] = link.target.y - window.innerHeight / 2;
      this.linePositions[counter * 3 + 2 ] = -1000;
      this.lineColors[counter * 3 + 0 ] = color.r;
      this.lineColors[counter * 3 + 1 ] = color.g;
      this.lineColors[counter * 3 + 2 ] = color.b;
      counter += 1;

      color.setHSL(counter / nodeCount, 0.7, 0.7);
      this.linePositions[counter * 3 + 0 ] = link.source.x - window.innerWidth / 2;
      this.linePositions[counter * 3 + 1 ] = link.source.y - window.innerHeight / 2;
      this.linePositions[counter * 3 + 2 ] = -1000;
      this.lineColors[counter * 3 + 0 ] = color.r;
      this.lineColors[counter * 3 + 1 ] = color.g;
      this.lineColors[counter * 3 + 2 ] = color.b;
      counter += 1;

      if ( counter * 3 > this.linePositions.length) {
        break;
      }
    }
    this.linePositionsAttrib.needsUpdate = true;
    this.lineColorsAttrib.needsUpdate = true;
    this.lineGeometry.setDrawRange(0, counter);
  }
  public updatePositions(newPositions: Array<d3.HierarchyPointNode<Node>>) {
    // to replace buffer after recalculation, see:
    // https://github.com/mrdoob/three.js/blob/
    // 70438028775dd4d539ebdfdaf1aafd6fbcac43c7/examples/webgl_lines_sphere.html#L112-L127
    // todo, do d3 calculation in worker; then replace buffer.
    let counter = 0;
    const color = new THREE.Color();
    for ( const node of newPositions) {
      this.pointPositions[counter * 3 + 0] = node.x - window.innerWidth / 2; // * 0.5 - 100;
      this.pointPositions[counter * 3 + 1] = node.y - window.innerHeight / 2; // * 0.5 - 400;
      const hue = counter / newPositions.length;
      color.setHSL(hue , 0.5, 0.5);
      this.pointColors[counter * 3 + 0 ] = color.r;
      this.pointColors[counter * 3 + 1 ] = color.g;
      this.pointColors[counter * 3 + 2 ] = color.b;
      counter += 1;
      if ( counter * 3  > this.pointPositions.length) {
        break;
      }
    }
    this.pointGeometry.computeBoundingSphere();
    this.pointPositionsAttrib.needsUpdate = true;
    this.pointColorsAttrib.needsUpdate = true;
    this.pointGeometry.setDrawRange(0, newPositions.length);
  }
  //
  public animate() {
    requestAnimationFrame( () => {this.animate(); } );
    if (this.controls) {
      this.controls.update();
    }
    this.render();
    // this.stats.update();
  }
  public render() {
    const time = Date.now() * 0.001;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersect = this.raycaster.intersectObject(this.points);
    if ( intersect.length > 0) {
      const pt = intersect[0];
      if (pt.index) {
        this.pointColors[3 * pt.index] = 0;
        this.pointColors[3 * pt.index + 1] = 0;
        this.pointColors[3 * pt.index + 2] = 0;
      }
      this.pointColorsAttrib.needsUpdate = true;
      // console.log(intersect);
    }
    // this.camera.position.x = this.mouseX - (window.innerWidth / 2);
    // this.camera.position.y = this.mouseY - (window.innerHeight / 2);
    this.camera.lookAt(this.scene.position);
    // this.points.rotation.x = time * 0.25;
    // this.points.rotation.y = time * 0.5;
    // this.lines.rotation.x = time * .25;
    // this.lines.rotation.y = time * 0.5;
    this.renderer.render( this.scene, this.camera );
  }

  public close() {
    this.renderer.forceContextLoss();
  }

  private make_random_points(particles: number) {
    const n = 1000;
    const n2 = n / 2; // particles spread in the cube
    const color = new THREE.Color();
    for ( let i = 0; i < particles; i++ ) {
      // positions
      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;
      const z = n2;
      this.pointPositions[i * 3 + 0] = x;
      this.pointPositions[i * 3 + 1] = y;
      this.pointPositions[i * 3 + 2] = -n;
      // colors
      const vx = ( x / n ) + 0.5;
      const vy = ( y / n ) + 0.5;
      const vz = ( z / n ) + 0.5;
      color.setRGB( vx, vy, vz );
      this.pointColors[i * 3 + 0] = color.r;
      this.pointColors[i * 3 + 1] = color.g;
      this.pointColors[i * 3 + 2] = color.b;
    }
  }
}
