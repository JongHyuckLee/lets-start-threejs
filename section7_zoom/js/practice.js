import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let scene, camera, renderer, controls;
let boxGroup = new THREE.Object3D();

let totalNum = 0; //전체 박스 갯수
const depthNum = 100; //박스와 박스 사이 z값. 깊이

let targetZNum = 0;
let moveZ = 0;
let mouseX = 0,
  mouseY = 0,
  moveX = 0,
  moveY = 0;

const dataArr = [
  {
    image: "./image/main_5.png",
  },
  {
    image: "./image/main_6.png",
  },
  {
    image: "./image/main_4.png",
  },
  {
    image: "./image/main_3.png",
  },
  {
    image: "./image/main_2.png",
  },
  {
    image: "./image/main_1.png",
  },
  {
    image: "./image/main_0.png",
  },
];

const init = () => {
  totalNum = dataArr.length - 1; //전체 박스 갯수

  scene = new THREE.Scene();
  scene.background = new THREE.TextureLoader().load("./image/bg.jpg");
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 5, 1000);
  camera.position.set(0, 0, 50);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  //그림자 활성화

  document.querySelector("#canvasWrap").appendChild(renderer.domElement);
  //cavasWrap 에 render 넣는다

  document.body.style.height = `${HEIGHT + totalNum * depthNum}px`;
  //body 스크롤 만들기

  //안개
  const near = depthNum;
  const far = depthNum * totalNum;
  const color = "#ffffff";
  scene.fog = new THREE.Fog(color, near, far);

  //조명 넣기
  var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
  light.position.set(100, 100, 0);
  scene.add(light);

  for (let i = 0; i <= totalNum; i++) {
    addBox(i);
  }
  scene.add(boxGroup);
  addLight(15, 15, 20);
};

//박스 추가
const addBox = (i) => {
  const imageMap = new THREE.TextureLoader().load(dataArr[i].image);

  const material = new THREE.SpriteMaterial({ map: imageMap });
  const boxMesh = new THREE.Sprite(material);
  boxMesh.scale.set(WIDTH / (10 - i), HEIGHT / (10 - i), 1);

  let z = (-i * depthNum) / totalNum;
  boxMesh.position.set(0, 0, z);
  boxMesh.name = `imageBox_${i}`;
  boxGroup.add(boxMesh);
};

//조명 넣기
const addLight = (...pos) => {
  const color = 0xffffff;
  const intensity = 0.4;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  light.position.set(...pos);

  scene.add(light);
};

const animate = () => {
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
  //카메라 비율을 화면 비율에 맞춘다
};

let scrolly = 0;
let pageNum = 0;
const progressBar = document.querySelector(".bar");
let perNum = 0;

const scrollFunc = () => {
  scrolly = window.scrollY; //현재 스크롤 위치
  pageNum = Math.ceil(scrolly / 100); //스크롤 한번에 100 이동
  targetZNum = (depthNum * pageNum) / 8;

  perNum = Math.ceil(
    (scrolly / (document.body.offsetHeight - window.innerHeight)) * 100
  );
};

init();
animate();
window.addEventListener("resize", stageResize);
window.addEventListener("scroll", scrollFunc);
scrollFunc();

window.addEventListener("mousemove", (e) => {
  //console.log(e);
  mouseX = e.clientX;
  mouseY = e.clientY;
});
