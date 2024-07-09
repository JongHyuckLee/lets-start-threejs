import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;
let boxGroup = new THREE.Object3D();
const totalNum = 100; //전체 박스 갯수

const init = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000"); //배경 컬러
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 1000);
  camera.position.set(50, 50, 150);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  //그림자 활성화

  document.body.appendChild(renderer.domElement);

  // const axes = new THREE.AxesHelper(150);
  // scene.add(axes);

  // const gridHelper = new THREE.GridHelper(240, 20);
  // scene.add(gridHelper);

  //조명 넣기
  var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
  light.position.set(100, 100, 0);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  const arr = [
    "https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkd-TFeia6ljbZ_uWEFMZD2rHF_nanTbvUkilPapEcNIcIliJUDJgmJ7LNBgYsiYxBDFQ&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWndbP-W-LsTkEM96_CEfFQRXw_VcuWX4hEA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxILEKrQlSSd0zCAg_CI1bGLuEKMN6KZ2F0g&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWMGhOfLAXoWyvWApDBKH5OhE3G0k4lYAhw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQJjHY4DexDJWPHtjECnXAgo2DR2PeksT21g&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSkZiM0rK4Ii7jSAjLdACszDWnsdzSl8pqaA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr29mZQhjbTVhcLsRdki25QGsKz-B1RaRU7w&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEvRPU4KKmpmmg7iXY2yWqZM_vCb_KuBHTYw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH0Vf6oF1kZS3spd_Pblp171URvLpJEhRCGg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Z4nnCXxv6O5hGjtvox3HppfY_tow9qaBJA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyF9PDMw3zEsc-3lDGY_hZOfQLJsGz5cBs8Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq4wyRh015KWJNfUC6qQz4M3qya3SqUj84rw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJhvXwhTaVcZldyAGCETFLUpGHvNwBeaQy2g&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0nwbvNREelPL48a_KC6Q7sXtNIgZpLE7NSA&s",
  ];

  arr.map(async (image, index) => {
    const mesh = addBox(image, index);
    return mesh;
  });

  scene.add(boxGroup);
  addLight(15, 15, 20);
};

const depthNum = 100; //박스와 박스 사이 z값. 깊이
let targetZNum = 0; //
let moveZ = 0;

//박스 추가
const addBox = (image, i) => {
  const imageMap = new THREE.TextureLoader().load(image);

  const geometry = new THREE.BoxBufferGeometry(32, 18, 1);
  const material = new THREE.MeshPhongMaterial({
    map: imageMap,
  });
  const boxMesh = new THREE.Mesh(geometry, material);
  boxMesh.castShadow = true;

  let x = 0; // Math.random() * 100 - 100 / 2;
  let y = 0; //Math.random() * 100 - 100 / 2;
  let z = -i * depthNum;
  boxMesh.position.set(x, y, z);
  //   boxMesh.rotation.set(x, y, z);
  boxGroup.add(boxMesh);
};

//조명 넣기
const addLight = (...pos) => {
  const color = 0xffffff;
  const intensity = 0.4;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  light.position.set(...pos);

  const helper = new THREE.PointLightHelper(light);
  scene.add(helper);

  scene.add(light);
};

const animate = () => {
  //controls.update();

  moveZ += (targetZNum - moveZ) * 0.07;
  boxGroup.position.z = moveZ;

  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

const stageResize = () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
};

const scrollFunc = (event) => {
  // console.log(event.deltaY);
  if (event.deltaY < -150) {
    if (targetZNum > 0) {
      targetZNum -= depthNum;
    }
  }
  if (event.deltaY > 150) {
    if (targetZNum < totalNum * depthNum) {
      targetZNum += depthNum;
    }
  }
  // console.log(targetZNum);
};

init();
animate();
window.addEventListener("resize", stageResize);
window.addEventListener("wheel", scrollFunc);
