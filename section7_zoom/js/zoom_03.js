import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let scene, camera, renderer, controls;
let boxGroup = new THREE.Object3D();

const totalNum = 10; //전체 박스 갯수
const depthNum = 40; //박스와 박스 사이 z값. 깊이
const totalDepthNum = totalNum * depthNum; //전체 깊이

let targetZNum = 0;
let moveZ = 0;
let mouseX = 0,
  mouseY = 0,
  moveX = 0,
  moveY = 0;

const init = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000"); //배경 컬러 #6fbdff
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 1000);
  camera.position.set(0, 0, 50);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  //그림자 활성화
  // document.body.appendChild(renderer.domElement);
  document.querySelector("#canvasWrap").appendChild(renderer.domElement);
  //cavasWrap 에 render 넣는다

  document.body.style.height = `${HEIGHT + totalNum * 100}px`;
  //body 스크롤 만들기

  //안개
  const near = 100;
  const far = 300;
  const color = "#000000";
  scene.fog = new THREE.Fog(color, near, far);

  // const axes = new THREE.AxesHelper(150);
  // scene.add(axes);

  // const gridHelper = new THREE.GridHelper(240, 20);
  // scene.add(gridHelper);

  //조명 넣기
  var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
  light.position.set(100, 100, 0);
  scene.add(light);

  // controls = new OrbitControls(camera, renderer.domElement);

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

//박스 추가
const addBox = (image, i) => {
  const imageMap = new THREE.TextureLoader().load(image);

  const material = new THREE.SpriteMaterial({ map: imageMap });
  const boxMesh = new THREE.Sprite(material);
  boxMesh.scale.set(32, 18, 1);

  let x = Math.random() * 100 - 100 / 2;
  let y = Math.random() * 50 - 50 / 2;
  let z = -i * depthNum;
  boxMesh.position.set(x, y, z);
  boxMesh.name = `imageBox_${i}`;
  // boxMesh.rotation.set(0, y, 0);
  boxGroup.add(boxMesh);
};

//조명 넣기
const addLight = (...pos) => {
  const color = 0xffffff;
  const intensity = 0.4;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  light.position.set(...pos);

  // const helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  scene.add(light);
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
//https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
//https://threejs.org/examples/#webgl_interactive_cubes

const onPointerMove = (event) => {
  pointer.x = (event.clientX / WIDTH) * 2 - 1;
  pointer.y = -(event.clientY / HEIGHT) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  // 레이저 닿는 녀석 찾기
  const intersects = raycaster.intersectObjects(boxGroup.children);

  //마우스 오버가 된 녀석들은 빨간색으로
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }

  if (intersects.length > 0) {
    document.querySelector("body").style.cursor = "pointer";
  } else {
    document.querySelector("body").style.cursor = "auto";
  }
};

const onDocumentMouseDown = (event) => {
  const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5);

  vector.unproject(camera);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(boxGroup.children);

  if (intersects.length > 0) {
    const item = intersects[0].object;
    const itemName = item.name;
    console.log(itemName);
  }
};

const animate = () => {
  //controls.update();

  moveZ += (targetZNum - moveZ) * 0.07;
  boxGroup.position.z = moveZ;

  moveX += (mouseX - moveX - WIDTH / 2) * 0.05;
  moveY += (mouseY - moveY - WIDTH / 2) * 0.05;

  boxGroup.position.x = -(moveX / 50);
  boxGroup.position.y = moveY / 50;

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

let scrolly = 0;
let pageNum = 0;
const progressBar = document.querySelector(".bar");
let perNum = 0;

const scrollFunc = () => {
  // console.log(event.deltaY);
  // if (event.deltaY == -150) {
  //     if (targetZNum > 0) {
  //         targetZNum -= depthNum;
  //     }
  // } else {
  //     if (targetZNum < totalDepthNum) {
  //         targetZNum += depthNum;
  //     }
  // }
  // console.log(targetZNum);

  // if (pageNum == Math.ceil(scrolly / 100)) return;

  scrolly = window.scrollY; //현재 스크롤 위치
  pageNum = Math.min(Math.ceil(scrolly / 100), totalNum); //스크롤 한번에 100 이동
  targetZNum = depthNum * pageNum;

  perNum = Math.ceil(
    (scrolly / (document.body.offsetHeight - window.innerHeight)) * 100
  );
  progressBar.style.width = perNum + "%";

  // console.log(targetZNum, window.scrollY, pageNum, perNum);
};

init();
animate();
window.addEventListener("resize", stageResize);
window.addEventListener("scroll", scrollFunc);
// window.addEventListener("wheel", scrollFunc);
scrollFunc();

window.addEventListener("mousemove", (e) => {
  //console.log(e);
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("mousedown", onDocumentMouseDown);
