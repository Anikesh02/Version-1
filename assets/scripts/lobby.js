// import '../styles/style.css';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



// Scene and Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000); // Field of View, Aspect Ratio, Near and Far Clipping Plane
scene.add(camera);
camera.position.set(0, 9, 35);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);


const lights = () => {
    // Front light
    const frontLight = new THREE.PointLight(0xffffff, 1);
    frontLight.position.set(0, 20, 50);
    scene.add(frontLight);

    // Back light
    const backLight = new THREE.PointLight(0xffffff, 1);
    backLight.position.set(0, 20, -50);
    scene.add(backLight);

    // Left light
    const leftLight = new THREE.PointLight(0xffffff, 1);
    leftLight.position.set(-50, 12, 0);
    scene.add(leftLight);
}
// lights();


// Red Tracker
const redTracker = () => {
    const sphereGeometry = new THREE.SphereGeometry(0.03, 16, 16); // Radius, Width Segments, Height Segments
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.z = -5;
    camera.add(sphere);
    scene.add(camera);
}
redTracker();


// Floor function
const createFloor = (color, yPos) => {
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    floorPlane.rotation.x = 0.5 * Math.PI;
    floorPlane.position.y = yPos;
    scene.add(floorPlane);
};
// Creating floors with colors instead of textures
createFloor(0x2f2e2e, 0);   // Ground Floor - Grey
createFloor(0x2f2e2e, 40);    // Ground Floor Ceiling - Dark Grey
createFloor(0x2f2e2e, 42);  // First Floor - Grey
createFloor(0x2f2e2e, 75);    // First Floor Ceiling - Dark Grey
createFloor(0x2f2e2e, 77);  // First Floor - Grey
createFloor(0x2f2e2e, 110);    // First Floor Ceiling - Dark Grey

// Model on the center of the Ground Floor
const loadModel = (modelName, position, scale, rotation) => {
    const loader = new GLTFLoader().setPath('./static/assets/models/');
    loader.load(`${modelName}.glb`, (gltf) => {
        const mesh = gltf.scene;
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        mesh.rotation.set(...rotation);
        scene.add(mesh);
    }, (xhr) => {
        console.log(`loading model ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    });
};



const models = [
    // Ground Floor
    { modelName: 'CenterModel', position: [4, 6, 0], scale: [1, 1, 1], rotation: [0, 0, 0] },
    { modelName: 'text_new', position: [32, 20, 50], scale: [10, 10, 10], rotation: [0, -Math.PI , 0] },
    {modelName: 'groundFloorText', position: [-45, 30, -50], scale: [3, 3, 3], rotation: [0, 0 , 0] },
    {modelName: 'firstFloorText', position: [-45, 70, -50], scale: [3, 3, 3], rotation: [0, 0 , 0] },
    {modelName: 'goToUpstairs', position: [35, 60, -50], scale: [2, 2, 2], rotation: [0, 0 , 0] },
    {modelName: 'goToUpstairs', position: [35, 20, -50], scale: [2, 2, 2], rotation: [0, 0 , 0] },
    {modelName: 'instructions', position: [-45, 20, -50], scale: [2, 2, 2], rotation: [0, 0 , 0] },
    {modelName: 'instructions', position: [-45, 60, -50], scale: [2, 2, 2], rotation: [0, 0 , 0] },
];
models.forEach(model => loadModel(model.modelName, model.position, model.scale, model.rotation));


// Cube Geometry at the center of the ground floor with texture
const support = () => {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); // Width, Height, Depth
    const cubeTexture = new THREE.TextureLoader().load('./static/assets/img/newWall.jpg');
    const cubeMaterial = new THREE.MeshStandardMaterial({ map: cubeTexture });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(3, 0.5, -1);
    cube.scale.set(15, 7, 8); // Width, Height, Depth
    scene.add(cube);
}
support();

//Importance of the spotlight

const spotLight = new THREE.SpotLight(0xffffff, 100,6,10,5,4); // Color, Intensity, Distance, Angle, Penumbra, Decay
spotLight.position.set(-50, 22, 7.3);
spotLight.target.position.set(42, 0, -1);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 100;
spotLight.shadow.mapSize.height = 100;
spotLight.shadow.camera.near = 50;
spotLight.shadow.camera.far = 40;
spotLight.shadow.camera.fov = 10;
scene.add(spotLight);

const spotlightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotlightHelper);

// dAT GUI for determing and locating spotlight
const gui = new dat.GUI();
const spotLightFolder = gui.addFolder('Spotlight');
spotLightFolder.add(spotLight.position, 'x', -100, 100).name('X Position');
spotLightFolder.add(spotLight.position, 'y', 0,100).name('Y Position');
spotLightFolder.add(spotLight.position, 'z', -100, 100).name('Z Position');
spotLightFolder.add(spotLight.target.position, 'x', -100, 100).name('X Target Position');
spotLightFolder.add(spotLight.target.position, 'y', 0, 100).name('Y Target Position');
spotLightFolder.add(spotLight.target.position, 'z', -100, 100).name('Z Target Position');
spotLightFolder.add(spotLight, 'intensity', 0, 10).name('Intensity');
spotLightFolder.add(spotLight, 'distance', 0, 100).name('Distance');
spotLightFolder.add(spotLight.shadow.camera, 'near', 0.1, 100).name('Near');
spotLightFolder.add(spotLight.shadow.camera, 'far', 0.1, 100).name('Far');
spotLightFolder.add(spotLight.shadow.camera, 'fov', 1, 180).name('FOV');
spotLightFolder.open();

function spotAnimate() {
    requestAnimationFrame(spotAnimate);
    spotLight.position.set(spotLight.position.x, spotLight.position.y, spotLight.position.z);
    spotLight.target.position.set(spotLight.target.position.x, spotLight.target.position.y, spotLight.target.position.z);
    spotlightHelper.update();
    renderer.render(scene, camera);
}
spotAnimate();

// Event listener for Q key
const Q_key = () => {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Q' || event.key === 'q') {
            openFloorSelectionModal();
        }
    });
    const floorSelectionModal = document.getElementById("floorSelectionModal");
    const floorSelectionClose = document.getElementById("floorSelectionClose");

    function openFloorSelectionModal() {
        floorSelectionModal.classList.add('show');
    }
    floorSelectionClose.onclick = function () {
        floorSelectionModal.classList.remove('show');
    }
    window.onclick = function (event) {
        if (event.target == floorSelectionModal) {
            floorSelectionModal.classList.remove('show');
        }
    }
    window.setCameraHeight = function (height) {
        camera.position.y = height;
        floorSelectionModal.classList.remove('show');
    }
}
Q_key();


const createWall = (width, height, color, position, addLightStrips = false, rotation = [0, 0, 0]) => {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(...position);
    wall.rotation.set(...rotation);
    scene.add(wall);

    if (addLightStrips) {
        const lightStripMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Change the color to your liking
        const lightStripGeometry = new THREE.BoxGeometry(0.5, height, 0.2); // Adjust the '0.2' to change the thickness of the light strip

        // Left light strip
        const leftLightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
        leftLightStrip.position.set(position[0] - width / 2, position[1], position[2]);
        scene.add(leftLightStrip);

        // Right light strip
        const rightLightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
        rightLightStrip.position.set(position[0] + width / 2, position[1], position[2]);
        scene.add(rightLightStrip);
    }
};
const createFloorWalls = (floorHeight) => {
    // Back Wall
    createWall(99.5, 42, 0x2f2e2e, [0, floorHeight + 12.5, 50], true);

    // Right Wall
    createWall(100, 42, 0x2f2e2e, [50, floorHeight + 12.5, 0], false, [0, 0.5 * Math.PI, 0]);

    // Left Wall
    createWall(100, 42, 0x2f2e2e, [-50, floorHeight + 12.5, 0], false, [0, -0.5 * Math.PI, 0]);

    // Front Left Wall
    createWall(36, 42, 0x2f2e2e, [-31.4, floorHeight + 12.5, -50], true, [0, Math.PI, 0]);

    // Front Right Wall
    createWall(17, 42, 0x2f2e2e, [41.2, floorHeight + 12.5, -50], true);

    // Front Right Plane Wall
    createWall(45, 100, 0x2f2e2e, [32.5, floorHeight + 20, -72.5], false, [0, 0.5 * Math.PI, 0]);

    // Front Left Plane Wall
    createWall(40, 100, 0x2f2e2e, [-13, floorHeight + 20, -70], false, [0, -0.5 * Math.PI, 0]);
};
createFloorWalls(0); // Ground Floor
createFloorWalls(42);  // First Floor

// Light strip at the center of the ground floor
const lightStrip = (xPos, yPos, zPos) => {
    const lightStripMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightStripGeometry = new THREE.BoxGeometry(0.5, 1000, 0.2); // Width, Height, Depth
    const lightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
    lightStrip.position.set(xPos, yPos, zPos);
    scene.add(lightStrip);
}
lightStrip(-12.5, 6, -89.5);
lightStrip(31, 6, -89.5);


// Front Wall
const createFrontWall = () => {
    const geometry = new THREE.PlaneGeometry(100, 1000);
    const material = new THREE.MeshStandardMaterial({ color: 0x2f2e2e, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(0, 45, -115);
    scene.add(wall);
};
createFrontWall();

// Load ceiling light model
const loadCeilingLight = (position, scale, targetPosition) => {
    const loader = new GLTFLoader().setPath('./static/assets/models/');
    loader.load('ceiling_light.glb', (gltf) => {
        const mesh = gltf.scene;
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        scene.add(mesh);

        // Check if the current position matches the target position
        if (position[0] === targetPosition[0] && position[1] === targetPosition[1] && position[2] === targetPosition[2]) {
            // Create a spotlight at the ceiling light's position
            const spotlight = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10, 0.5, 2); // Color, Intensity, Distance, Angle, Penumbra, Decay
            spotlight.position.set(position[0], position[1] - 1, position[2]); // Position it just below the light model
            spotlight.target.position.set(position[0], position[1] - 20, position[2]);
            spotlight.castShadow = true; // Enable shadows

            // Set up shadow properties
            spotlight.shadow.mapSize.width = 1024;
            spotlight.shadow.mapSize.height = 1024;
            spotlight.shadow.camera.near = 0.5;
            spotlight.shadow.camera.far = 50;

            // Spotlight helper
            const spotlightHelper = new THREE.SpotLightHelper(spotlight);
            scene.add(spotlightHelper);


            scene.add(spotlight);
            scene.add(spotlight.target);
        }
    }, (xhr) => {
        console.log(`loading ceiling light ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    });
};

const ceilingLights = [
    // Ground Floor
    { position: [40, 40, 0], scale: [1, 1, 1] },
    { position: [40, 40, 25], scale: [1, 1, 1] },
    { position: [40, 40, -25], scale: [1, 1, 1] },
    { position: [-40, 40, 0], scale: [1, 1, 1] },
    { position: [-40, 40, -30], scale: [1, 1, 1] },
    { position: [-40, 40, 25], scale: [1, 1, 1] },
    { position: [0, 40, 0], scale: [1, 1, 1] },
    { position: [0, 40, 25], scale: [1, 1, 1] },
    { position: [0, 40, -25], scale: [1, 1, 1] },
    // First Floor
    { position: [40, 75, 0], scale: [1, 1, 1] },
    { position: [40, 75, 25], scale: [1, 1, 1] },
    { position: [40, 75, -25], scale: [1, 1, 1] },
    { position: [-40, 75, 0], scale: [1, 1, 1] },
    { position: [-40, 75, -30], scale: [1, 1, 1] },
    { position: [-40, 75, 25], scale: [1, 1, 1] },
    { position: [0, 75, 0], scale: [1, 1, 1] },
    { position: [0, 75, 25], scale: [1, 1, 1] },
    { position: [0, 75, -25], scale: [1, 1, 1] }
];

const targetPosition = [0, 20, 25];
ceilingLights.forEach(light => loadCeilingLight(light.position, light.scale, targetPosition));



const createImagePlaneWithBorder = (imageUrl, position, rotation, width, height, borderPositionOffset, hasBorder, modalLink, modalInfo) => {
    const textureLoader = new THREE.TextureLoader();
    const imageTexture = textureLoader.load(imageUrl);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ map: imageTexture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    plane.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(plane);

    if (hasBorder) {
        const borderGeometry = new THREE.PlaneGeometry(width + 0.5, height + 0.5);
        const borderMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(position.x + borderPositionOffset.x, position.y + borderPositionOffset.y, position.z + borderPositionOffset.z);
        border.rotation.set(rotation.x, rotation.y, rotation.z);
        scene.add(border);
    }
    plane.userData = { imageUrl, modalLink, modalInfo, position, rotation };
    return plane;
};
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const modalBack = document.getElementById('modal-back');
const modalLink = document.getElementById('modal-link');
const modalInfo = document.getElementById('modal-info');

// Close modal
modalClose.onclick = () => {
    modal.classList.remove('show');
    modal.style.pointerEvents = 'none';
};

// Set up the back button action
modalBack.onclick = () => {
    modal.classList.remove('show');
    modal.style.pointerEvents = 'none';
};

// Modal link will be updated dynamically based on the plane
modalLink.onclick = () => {
    if (modalLink.href) {
        window.location.href = modalLink.href;
    }
};

// Add an event listener for the "P" key to show the selection modal
document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        showSelectionModal();
    }
});
const showSelectionModal = () => {
    const selectionModal = document.createElement('div');
    selectionModal.id = 'selectionModal';
    selectionModal.style.position = 'fixed';
    selectionModal.style.top = '50%';
    selectionModal.style.left = '50%';
    selectionModal.style.transform = 'translate(-50%, -50%)';
    selectionModal.style.background = 'rgba(255, 255, 255, 0.1)';
    selectionModal.style.borderRadius = '20px';
    selectionModal.style.padding = '20px';
    selectionModal.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    selectionModal.style.backdropFilter = 'blur(10px)';
    selectionModal.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    selectionModal.style.zIndex = '1000';
    selectionModal.style.overflowY = 'auto';
    selectionModal.style.maxHeight = '80%';
    selectionModal.style.width = '60%';
    selectionModal.style.color = 'black';

    const selectionModalClose = document.createElement('button');
    selectionModalClose.innerText = 'Close';
    selectionModalClose.style.marginBottom = '10px';
    selectionModalClose.style.padding = '10px 20px';
    selectionModalClose.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    selectionModalClose.style.border = 'none';
    selectionModalClose.style.borderRadius = '10px';
    selectionModalClose.style.cursor = 'pointer';
    selectionModalClose.onclick = () => {
        document.body.removeChild(selectionModal);
    };
    selectionModal.appendChild(selectionModalClose);

    planes.forEach((plane, index) => {
        const imageElement = document.createElement('img');
        imageElement.src = plane.userData.imageUrl;
        imageElement.style.width = '100px';
        imageElement.style.height = '100px';
        imageElement.style.margin = '10px';
        imageElement.style.cursor = 'pointer';
        imageElement.style.borderRadius = '10px';
        imageElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        imageElement.onclick = () => {
            navigateToImage(index);
            document.body.removeChild(selectionModal);
        };

        const nameElement = document.createElement('div');
        nameElement.innerText = plane.userData.modalInfo;
        nameElement.style.textAlign = 'center';
        nameElement.style.marginTop = '5px';
        nameElement.style.fontWeight = 'bold';

        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'inline-block';
        imageContainer.style.textAlign = 'center';
        imageContainer.appendChild(imageElement);
        imageContainer.appendChild(nameElement);

        selectionModal.appendChild(imageContainer);
    });

    document.body.appendChild(selectionModal);
};
const navigateToImage = (index) => {
    const targetPlane = planes[index];
    const offset = -9;
    const position = targetPlane.userData.position;
    const rotation = targetPlane.userData.rotation;
    const planeNormal = new THREE.Vector3(0, 0, 1);
    planeNormal.applyEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z, 'XYZ'));
    const cameraPosition = new THREE.Vector3(
        position.x - planeNormal.x * offset,
        position.y - planeNormal.y * offset,
        position.z - planeNormal.z * offset
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(position.x, position.y, position.z);
};
const checkCameraPosition = () => {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    let modalVisible = false;

    planes.forEach(plane => {
        const planePosition = new THREE.Vector3();
        plane.getWorldPosition(planePosition);

        const distance = cameraPosition.distanceTo(planePosition);
        const facing = isCameraFacingPlane(camera, plane);

        if (distance < 8.5 && facing) {
            modalVisible = true;
            modalImage.src = plane.userData.imageUrl; // Load the image into the modal
            modalLink.href = plane.userData.modalLink; // Set the modal link
            modalInfo.innerHTML = plane.userData.modalInfo; // Set the modal info
        }
    });

    if (modalVisible) {
        modal.classList.add('show');
        modal.style.pointerEvents = 'auto'; // Enable pointer events when modal is open
    } else {
        modal.classList.remove('show');
        modal.style.pointerEvents = 'none'; // Disable pointer events when modal is closed
    }
};
const loadStand = (position, scale, rotation) => {
    const loader = new GLTFLoader().setPath('./static/assets/models/');

    loader.load('tablet_display_stands.glb', (gltf) => {
        const mesh = gltf.scene;
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        mesh.position.set(...position); // x, y, z
        mesh.scale.set(...scale); // Width, Height, Depth
        mesh.rotation.set(...rotation);
        scene.add(mesh);
    }, (xhr) => {
        console.log(`loading stand ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    });
};
const stands = [
    // Ground Floor
    { position: [-18, 0, 12], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 0, 30], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 0, -5], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 0, -20], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [25, 0, 12], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 0, -5], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 0, 30], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 0, -20], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    // First Floor
    { position: [-18, 42, 12], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 42, 30], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 42, -5], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [-18, 42, -20], scale: [5, 5, 4], rotation: [0, Math.PI / 2, 0] },
    { position: [25, 42, 12], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 42, -5], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 42, 30], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] },
    { position: [25, 42, -20], scale: [5, 5, 4], rotation: [0, -Math.PI / 2, 0] }

];
stands.forEach(stand => loadStand(stand.position, stand.scale, stand.rotation));

const isCameraFacingPlane = (camera, plane) => {
    const planeNormal = new THREE.Vector3(0, 0, 1);
    planeNormal.applyQuaternion(plane.quaternion);
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    return planeNormal.dot(cameraDirection) < -0.5;
};

const planes = [];
//Ground Floor
planes.push(createImagePlaneWithBorder('./static/assets/img/image.jpg', { x: 25, y: 6.6, z: 12 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info1', 'Info for image 1'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image2.jpg', { x: -18, y: 6.6, z: 12 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info2', 'Info for image 2'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image3.jpg', { x: 25, y: 6.6, z: -5 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info3', 'Info for image 3'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image4.jpg', { x: -18, y: 6.6, z: -5 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info4', 'Info for image 4'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image5.jpg', { x: -18, y: 6.6, z: 30 }, { x: - 90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info5', 'Info for image 5'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image6.jpg', { x: 25, y: 6.6, z: 30 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info6', 'Info for image 6'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image7.jpg', { x: 49, y: 12, z: 8 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info7', 'Info for image 7'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image8.jpg', { x: 49, y: 12, z: -20 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info8', 'Info for image 8'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image9.jpg', { x: -49, y: 12, z: -20 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info9', 'Info for image 9'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image10.jpg', { x: -48, y: 12, z: 8 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info10', 'Info for image 10'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image11.jpg', { x: 49, y: 12, z: 30 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info11', 'Info for image 11'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image12.jpg', { x: -49, y: 12, z: 30 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info12', 'Info for image 12'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image13.jpg', { x: 25, y: 6.6, z: -20 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info13', 'Info for image 13'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image14.jpg', { x: -18, y: 6.6, z: -20 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info14', 'Info for image 14'));
// First Floor
planes.push(createImagePlaneWithBorder('./static/assets/img/image15.jpg', { x: 25, y: 48.6, z: 12 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info15', 'Info for image 15'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image16.jpg', { x: -18, y: 48.6, z: 12 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info16', 'Info for image 16'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image17.jpg', { x: 25, y: 48.6, z: -5 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info17', 'Info for image 17'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image18.jpg', { x: -18, y: 48.6, z: -5 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info18', 'Info for image 18'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image19.jpg', { x: -18, y: 48.6, z: 30 }, { x: - 90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info19', 'Info for image 19'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image20.jpg', { x: 25, y: 48.6, z: 30 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info20', 'Info for image 20'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image21.jpg', { x: 49, y: 54, z: 8 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info21', 'Info for image 21'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image22.jpg', { x: 49, y: 54, z: -20 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info22', 'Info for image 22'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image23.jpg', { x: -49, y: 54, z: -20 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info23', 'Info for image 23'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image24.jpg', { x: -48, y: 54, z: 8 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info24', 'Info for image 24'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image25.jpg', { x: 49, y: 54, z: 30 }, { x: 0, y: -0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info25', 'Info for image 25'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image26.jpg', { x: -49, y: 54, z: 30 }, { x: 0, y: 0.5 * Math.PI, z: 0 }, 15, 15, { x: 0, y: 2, z: -0.01 }, false, 'https://example.com/more-info26', 'Info for image 26'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image27.jpg', { x: 25, y: 48.6, z: -20 }, { x: -90 * (Math.PI / 180), y: -60 * (Math.PI / 180), z: -Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.08, z: -0.01 }, true, 'https://example.com/more-info27', 'Info for image 27'));
planes.push(createImagePlaneWithBorder('./static/assets/img/image28.jpg', { x: -18, y: 48.6, z: -20 }, { x: -90 * (Math.PI / 180), y: 60 * (Math.PI / 180), z: Math.PI / 2 }, 6, 6, { x: 0.05, y: -0.1, z: -0.01 }, true, 'https://example.com/more-info28', 'Info for image 28'));

const animate = () => {
    requestAnimationFrame(animate);
    checkCameraPosition();
    renderer.render(scene, camera);
};
animate();


// Controls
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience() {
    controls.lock();
    hideMenu();
}

const playButton = document.getElementById('play_button');
playButton.addEventListener('click', startExperience);

// Hide Menu
function hideMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = 'none';
}
// Show Menu
function showMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = 'flex';
}
controls.addEventListener('unlock', showMenu);


// Event Listener for when we press the Keys
document.addEventListener('keydown', onKeyDown, false);
// Function for Movement when we press the keys
function onKeyDown(event) {
    let keycode = event.which;

    // Right Arrow Key or 'D'
    if (keycode === 39 || keycode === 68) {
        controls.moveRight(0.5);
    }
    // Left Arrow Key or 'A'
    else if (keycode === 37 || keycode === 65) {
        controls.moveRight(-0.5);
    }
    // Up Arrow Key or 'W'
    else if (keycode === 38 || keycode === 87) {
        controls.moveForward(0.5);
    }
    // Down Arrow Key or 'S'
    else if (keycode === 40 || keycode === 83) {
        controls.moveForward(-0.5);
    }
}

// Function to create stairs
const createStairs = () => {
    const createStairPlane = (width, height, depth, texturePath, position, rotation) => {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);
        const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(...position);
        plane.rotation.set(...rotation);
        scene.add(plane);
        

    };
    createStairPlane(25, 35, 2, './static/assets/img/stairs.jpg', [20, 8, -65], [-0.345 * Math.PI, 0, 0]); // Right stair
    createStairPlane(50, 25, 1, './static/assets/img/stairs.jpg',[ 8, 18, -92], [0.5 * Math.PI, 0, 0]); // Plane at the top
    createStairPlane(25, 40, 2, './static/assets/img/stairs.jpg', [-5, 30, -68  ], [0.32 * Math.PI, 0, 0]); // Left stair
    createStairPlane(100, 39, 1, './static/assets/img/newWall.jpg', [-1, -1, -70], [0.5 * Math.PI, 0, 0]); // Plane at the bottom
  
  };
createStairs();


// Stairs Logic
function updateCameraPosition() {
    const { x, z } = controls.getObject().position;
    const rightStairBoundaries = {
        lowerX: -20,
        upperX: 30,
        lowerZ: -70,
        upperZ: -50
    };

    const leftStairBoundaries = {
        lowerX: -30,
        upperX: 10,
        lowerZ: -90,
        upperZ: -50
    };

    // Check if the camera is within the right stair boundaries
    if (x > rightStairBoundaries.lowerX && x < rightStairBoundaries.upperX && z > rightStairBoundaries.lowerZ && z < rightStairBoundaries.upperZ) {
        if (z < -90) {
            camera.position.y = 18 + ((z + 90) / 10) * 10; // Upward movement for right stairs
        } else if (z > -60) {
            camera.position.y = 8 - ((z + 50) / 10) * 5; // Downward movement for right stairs
        } else if (z > -90 && z < -60) {
            camera.position.y = 28; // Stable height at the top of the right stairs
        } else {
            camera.position.y = 10; // Stable height at the bottom of the right stairs
        }
    }

    // Check if the camera is within the left stair boundaries
    if (x > leftStairBoundaries.lowerX && x < leftStairBoundaries.upperX && z > leftStairBoundaries.lowerZ && z < leftStairBoundaries.upperZ) {
        if (z < -70) {
            camera.position.y = 8 + ((z + 70) / 10) * 10; // Upward movement for left stairs
        } else if (z > -60) {
            camera.position.y = 30 + ((z + 50) / 10) * 10; // Downward movement for left stairs
        } else if (z > -70 && z < -60) {
            camera.position.y = 25; // Stable height at the top of the left stairs
        }
    }
}
// Adjust the aspect ratio when the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const render = function () {
    updateCameraPosition();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();