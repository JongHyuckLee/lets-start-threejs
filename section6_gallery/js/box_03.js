import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { DragControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/DragControls.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const totalNum = 10; //전체 박스 갯수

let scene, camera, renderer, controls;
let cardArray = [];

const init = async () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000"); //배경 컬러
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.set(0, 0, 50);

  gsap.from(camera.position, {
    duration: 1,
    delay: 0.8,
    z: 150,
    ease: "Power2.easeInOut",
  });

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

  // controls = new OrbitControls(camera, renderer.domElement);

  {
    //바닥
    // const imageMap = new THREE.TextureLoader().load("./image/hardwood.jpg");
    // imageMap.wrapS = THREE.RepeatWrapping;
    // imageMap.wrapT = THREE.RepeatWrapping;
    // imageMap.repeat.set(10, 10);

    const geometry = new THREE.BoxGeometry(400, 400, 2);
    const material = new THREE.MeshPhongMaterial({
      // map: imageMap,
      color: 0x464946,
    });
    const wallMesh = new THREE.Mesh(geometry, material);

    wallMesh.position.set(0, 0, -1);
    wallMesh.receiveShadow = true; //default is false
    // wallMesh.castShadow = true;
    scene.add(wallMesh);
  }

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

  const res = await Promise.all(
    arr.map(async (image, index) => {
      const mesh = await addBox(image, index);
      return mesh;
    })
  );
  cardArray.push(...res);
  controls = new DragControls(cardArray.reverse(), camera, renderer.domElement);
  addLight(15, 15, 20);
};

//카드 추가
const addBox = async (image, i) => {
  const imageMap = new THREE.TextureLoader();
  const data = await imageMap.load(image, (data) => {});
  const geometry = new THREE.BoxGeometry(16, 12, 1);
  const material = new THREE.MeshPhongMaterial({
    map: data,
    // color: 0xffffff,
  });
  const cardMesh = new THREE.Mesh(geometry, material);
  cardMesh.castShadow = true;
  cardMesh.receiveShadow = true;

  let x = 0; //Math.random() * 50 - 25;
  let y = 0; //Math.random() * 50 - 25;
  let z = 0;
  cardMesh.position.set(x, y, z);
  cardMesh.rotation.set(0, 0, Math.random() * 360);

  gsap.to(cardMesh.position, {
    duration: 0.8,
    delay: i * 0.1 + 0.5,
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40,
    ease: "Power4.easeOut",
  });
  gsap.to(cardMesh.rotation, {
    duration: 0.8,
    delay: i * 0.1 + 0.5,
    z: Math.random() * 2 - 1,
    ease: "Power4.easeOut",
  });
  // https://greensock.com/docs/v2/Easing

  //drag를 위한 배열

  scene.add(cardMesh);

  return cardMesh;
};

//조명 넣기
const addLight = (...pos) => {
  const color = 0xffffff;
  const intensity = 0.4;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  // addLight(15, 15, 20);
  // ...pos로 위치값을 바로 가져옵니다.
  light.position.set(...pos);

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default
  light.shadow.radius = 5;
  light.shadow.blurSamples = 5;
  scene.add(light);

  // const helper = new THREE.PointLightHelper(light);
  // scene.add(helper);
};

const animate = () => {
  //controls.update();
  // camera.lookAt(scene.position);
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

init();
animate();
window.addEventListener("resize", stageResize);
