
import * as THREE from "three";
// import { EffectComposer } from "three-outlinepass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import { GUI } from "dat.gui";

console.log("django");
const timeline = document.getElementById("timeline");
const progressLine = document.getElementById("progress-line");
const languageElement = document.getElementById("language");
// const info_desk = document.getElementById("info-desk");
function india_translation(stateName){
  const stateLanguages={
    "IN-JK": "بھارت",
    "IN-RJ":"भारत",
    "IN-GJ":"ભરત",
    "IN-MP":"भारत",
    "IN-CT":"भारत",
    "IN-JK":"भारत",
    "IN-MH":"भरत",
    "IN-TG":"భరత్",
    "IN-KA":"ಭಾರತ",
    "IN-TN":"பாரத்",
    "IN-KL":"ഭാരതം"
  }
  return stateLanguages[stateName] || "India";
}

let currentItem = timeline.firstChild;
console.log("Current Item", currentItem);
// console.log("current item dataset state", currentItem.dataset.state);
// console.log("current item next sibling", currentItem.nextSibling);
let prev_state ="IN-JK";
function highlightState(stateName) {
  let current_state = stateName;
  if(iconLoaded){
    if(prev_state!=current_state){
      let previousMesh = icon[0].children.find(child=>child.name===prev_state);
      previousMesh.material = state_texture;
      prev_state = current_state;
    }
   const hoveredLanguage = india_translation(stateName);
   languageElement.textContent = hoveredLanguage;
   console.log("inside highlight function", icon[0].children.find(child=>child.name===stateName));
   const componentMesh = icon[0].children.find(child=>child.name===stateName);
   componentMesh.material = new THREE.MeshBasicMaterial({
    color:0xE34547,
   })
   
  }
  console.log(stateName);
}
let intervalId = null;
let sumWidth = 0;
function startAnimation() {
  intervalId = setInterval(() => {
    const totalItems = timeline.children.length;
    
    const progressWidth =  (currentItem.clientWidth/timeline.offsetWidth)*100;
    sumWidth = sumWidth+progressWidth;
    console.log("sum width",sumWidth);
    console.log(progressWidth)
    progressLine.style.width = `${sumWidth}%`;
    
  
    // currentItem.style.backgroundColor = "#007bff"; // Highlight color
    currentItem.style.color = "black"; // Text color

    highlightState(currentItem.dataset.state);

    setTimeout(() => {
      // currentItem.style.backgroundColor = ""; // Reset background color
      // currentItem.style.color = "white"; // Reset text color
      currentItem = currentItem.nextElementSibling;
      if (!currentItem) {
        clearInterval(intervalId);
        intervalId = null;
        currentItem = timeline.firstChild;
      } else {
        currentItem.style.opacity = 1; // Make the next item visible
      }
    }, 1000); // Duration for highlight
  }, 3000); // Delay between animations
}

startAnimation();

// Add event listener for user clicks on timeline items
timeline.addEventListener("mouseover", (event) => {
  console.log(event);
  if (event.target.tagName === "LI") {
    const clickedState = event.target.dataset.state;
    if (intervalId) {
      clearInterval(intervalId);
      progressLine.style.width = 0;

      intervalId = null;
    }
    
    highlightState(clickedState);
    currentItem = event.target;
  }
});

const renderer = new THREE.WebGLRenderer();
// var compose = new EffectComposer(renderer);
renderer.setSize(window.innerWidth, window.innerHeight);
// var renderTarget = new THREE.WebGLRenderTarget(512,512);

renderer.setClearColor(0x3b657d);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// var gui = new GUI();

const directionalLight = new THREE.DirectionalLight(0x111111, 0);
directionalLight.position.set(0, 0, 10).normalize(); 
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff); // Soft white light
scene.add(ambientLight);


const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('./static/assets/texture2.jpg');
backgroundImage.wrapS = THREE.RepeatWrapping;
backgroundImage.wrapT = THREE.RepeatWrapping;
backgroundImage.repeat.set( 1, 1 );

const geometry = new THREE.PlaneGeometry( 1, 1 );
const material = new THREE.MeshBasicMaterial( {side: THREE.BackSide,map:backgroundImage} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x=Math.PI/2;
plane.scale.set(10,10,10);
scene.add( plane );

let state_texture;
// scene.background = backgroundImage;
textureLoader.load("./static/assets/texture5.jpg", (texture) => {
  state_texture = new THREE.MeshBasicMaterial({
   
    // color: 0xffffff,
    // emissive: 0xffffff,
    map: texture,
    side:THREE.DoubleSide,
  });
  console.log("state_texture", state_texture);
});

const orbit = new OrbitControls(camera, renderer.domElement);

const monkeyUrl = new URL("india_try19.glb", import.meta.url);
const loader = new GLTFLoader();

let iconLoaded = false;
let icon = [];

let testFrame;
var selectedObjects = [];
let children;
loader.load(monkeyUrl.href, function (glb) {

  icon[0] = glb.scene;
  icon[0].position.set(0, 0, -0.5);
  
  icon[0].scale.set(4, 4, 4);
  children = icon[0].children;
  iconLoaded = true;
  scene.add(icon[0]);

  selectedObjects.push(icon[0]);


  const model = icon[0].children.find(child=>child.name==="Sketchfab_model");
  const photosModel =  model.children.find(child=>child.name==="Collada_visual_scene_group");
  console.log("andhraPardeshFrame", photosModel.children.find(child=>child.name==="andhraPardeshFrame1"));
  console.log("andhraPardeshFrame Position", photosModel.children.find(child=>child.name==="gujaratFrame1").position);
  testFrame = photosModel.children.find(child=>child.name==="gujaratFrame1");
  // andhraPardeshFrame1
  // gui.add(icon[0].position,'x',-2,2).step(0.5);
  // gui.add(icon[0].position,'y',-2,2).step(0.5);
  // gui.add(icon[0].position,'z',-2,2).step(0.5);
  // gui.add(icon[0].scale,'x',2,6).step(1);
  // gui.add(icon[0].scale,'y',2,6).step(1);
  // gui.add(icon[0].scale,'z',2,6).step(1);
  // const object3d = icon[0].children.find(child=>child.name==='Sketchfab_model');
  // const object3dChildren = object3d.children.find(child=>child.name==='Collada_visual_scene_group');
  const plane= icon[0].children.find(child=>child.name==='Plane');
  plane.mesh = new THREE.MeshStandardMaterial({
    color:new THREE.Color(255,0,0),
    emissive:0xff0000,
  })
  // plane.scale.set(1.5,1.5,1.5);
  console.log("plane",plane);
  // const madhyaPardeshBoard = object3dChildren.children.find(child=>child.name==='Material3madhyaPardesh');
  
  // console.log("apple image",appleImage);
 
  // madhyaPardeshBoard.material = new THREE.MeshStandardMaterial({
  //   // map:appleImage,
  //   color:new THREE.Color(0,255,0),
    
  // })

  // madhyaPardeshBoard.scale.set(0.5,0.5,0.5);
  //  console.log("Madhya pardesh image materail",object3dChildren.children.find(child=>child.name==='Material3madhyaPardesh'));
  // console.log("working");
});
console.log("ICONS:", icon);

// const raycaster = new THREE.Raycaster();
// 
// var renderPass = new RenderPass(scene, camera);
// var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, selectedObjects);
// outlinePass.renderToScreen = true;
// outlinePass.selectedObjects = selectedObjects;

// compose.addPass(renderPass);
// compose.addPass(outlinePass);
// var params = {
//     edgeStrength: 2,
//     edgeGlow: 1,
//     edgeThickness: 1.0,
//     pulsePeriod: 0,
//     usePatternTexture: false
// };

// outlinePass.edgeStrength = params.edgeStrength;
// outlinePass.edgeGlow = params.edgeGlow;
// outlinePass.visibleEdgeColor.set(0x000000);
// outlinePass.hiddenEdgeColor.set(0x000000);

const raycaster = new THREE.Raycaster();

renderer.domElement.addEventListener("mousemove", (event) => {
  event.stopPropagation();
  if (event.type === "click") {
    console.log("Dddsd");
  }
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);

  let hoveredMesh = null;
  const stateMeshName =["Cube","LineArt","maharashtraFrame","arunachalPardeshFrame","assamFrame","biharFrame","chattisgarhFrame","goaFrame","gujaratFrame","harayanaFrame","himachalFrame","jammuKashmirFrame","jharkhandFrame","karnatakaFrame","keralaFrame","madhyaPardeshFrame","manipurFrame","meghalayaFrame","mizoramFrame","nagalandFrame","odishaFrame","punjabFrame","rajasthanFrame","sikkimFrame","tamilNaduFrame","telanganaFrame","tripuraFrame","uttarPardeshFrame","uttrakhandFrame","westBengalFrame","andhraPardeshFrame","maharashtraFrame1","arunachalPardeshFrame1","assamFrame1","biharFrame1","chattisgarhFrame1","goaFrame1","gujaratFrame1","harayanaFrame1","himachalFrame1","jammuKashmirFrame1","jharkhandFrame1","karnatakaFrame1","keralaFrame1","madhyaPardeshFrame1","manipurFrame1","meghalayaFrame1","mizoramFrame1","nagalandFrame1","odishaFrame1","punjabFrame1","rajasthanFrame1","sikkimFrame1","tamilNaduFrame1","telanganaFrame1","tripuraFrame1","uttarPardeshFrame1","uttrakhandFrame1","westBengalFrame1","andhraPardeshFrame1"];
  
  children.forEach((child) => {
    
    if (child instanceof THREE.Mesh && !stateMeshName.includes(child.name)) {
     
      const intersects = raycaster.intersectObject(child, true);
      if (intersects.length > 0) {
        hoveredMesh = child;
        // if (intervalId) {
        //   clearInterval(intervalId);
        //   intervalId = null;
        // }
        child.material = new THREE.MeshBasicMaterial({
          color: 0xE34547,
          // emissive: 0xff0000,
        });
        // child.scale.y =3 ;
        console.log(child.scale.y);
        const hoveredLanguage = india_translation(child.name);
        languageElement.textContent = hoveredLanguage;
      } else {
        child.material =state_texture;
        // new THREE.MeshBasicMaterial({
        //   color:0xD2EAF6
        // });
        child.scale.y = 1;
      }
    }
  });
});  

// Vector3 {x: 0.028676969930529594, y: -0.26879048347473145, z: 0.0026505368296056986, isVector3: true}
const onClick = {"harayana":[-0.22010113,0.05824,-0.59714],"gujarat":[0.028676,-0.268 +0.2,0.0026],"maharashtra":[-0.361,0.069,0.4438],"uttarPardesh":[0.068,0.193,-0.311]};
renderer.domElement.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  
  raycaster.setFromCamera(mouse, camera);
  const stateMeshName = ["rajasthanFrame","LineArt","gujaratFrame","maharashtraFrame","karnatakaFrame"];
  children.forEach((child) => {
    if (child instanceof THREE.Mesh && !stateMeshName.includes(child.name)) {
      const intersects = raycaster.intersectObject(child, true);
      if (intersects.length > 0) {
        
        console.log("child inside click event", child);
        showInfoDesk(child.name);
        

        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        // gsap.to(camera.position,{x:-1.9965789055338878,y:1.3517812002868428,z:8.879763474080168,duration:10,delay:1,
        //   onComplete:()=>{
        //     confirm("do you want to enter the museum");
        //   }
        // })
      }
    }
  });
});
const statesData = {
  "IN-MH":{
    name:"Maharashtra",
    capital:"(Mumbai)",
    artifacts:[
      "Ajanta Caves",
      "Ellora Caves",
      "Ajanta Caves",
      "Ellora Caves",
      "Ajanta Caves",
      "Ellora Caves"

    ],
    image:"./static/assets/maharashtra_map.jpg"
  },
  "IN-GJ":{
    name:"Gujarat",
    capital:"(Gandhinagar)",
    artifacts:[
      "Ajanta Caves",
      "Ellora Caves",
      "Ajanta Caves",
      "Ellora Caves",
      "Ajanta Caves",
      "Ellora Caves"
    ],
    image:"./static/assets/gujarat_map.png"
  }
}
const infoDeskElement = document.getElementById('info-desk');
const closeInfoDeskButton = document.getElementById("go-back");
const goMuseumButton = document.getElementById("go-museum");
const imageElement = document.getElementsByClassName("state-image")[0];
console.log("info desk image",imageElement);
function showInfoDesk(stateName){
  
  const stateNameElement = document.getElementById('state-name');
  const capitalElement = document.getElementById('capital');
  const artifactsListElement = document.querySelector('.artifacts-list');
  stateNameElement.textContent = statesData[stateName].name;
  capitalElement.textContent = statesData[stateName].capital;
  imageElement.src = statesData[stateName].image;
  console.log("info desk image",imageElement);
  console.log(" statesData[stateName].name", statesData[stateName].name);
  console.log(" statesData[stateName].capital",statesData[stateName].capital);
  artifactsListElement.innerHTML = '';
  statesData[stateName].artifacts.forEach(artifact=>{
    const listItem = document.createElement('li');
    listItem.textContent = artifact;
    artifactsListElement.appendChild(listItem);

  })
  infoDeskElement.classList.remove('hidden');
  infoDeskElement.classList.add('visible');
}

closeInfoDeskButton.addEventListener("click",()=>{
  infoDeskElement.classList.add("hidden");
  infoDeskElement.classList.remove('visible');
})
goMuseumButton.addEventListener("click",(event)=>{
  console.log("state clicked",event);
  window.location.href = "lobby";
})
camera.position.set(-1.4240104792773967, 1.427113086886674, 0.8510387236093673);

// Vector3 {x: -0.2201011364411452, y: 0.05824476748798764, z: -0.5971488777034827, isVector3: true} // haryana
// Vector3 {x: 0.06832556209801197, y: 0.19381524645105933, z: -0.31153891632124475, isVector3: true} uttarpardesh
// ector3 {x: -0.47462429621059055, y: 0.09377829113805758, z: 0.32214862239653047, isVector3: true} gujarat
// ector3 {x: -0.3615721771082808, y: 0.06939873881219619, z: 0.44383781623792373, isVector3: tru maharashtra
// {x: -0.23585883029269178, y: 0.07087637258695467, z: 0.8108879011575806, isVector3: true}
function animate() {
  orbit.update();
  // console.log(camera.position);
  // compose.render(scene, camera)  
  // renderer.render(backgroundMesh,new THREE.Scene());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
