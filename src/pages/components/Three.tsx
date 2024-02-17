import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshObject } from '../../object/MeshObject';
import * as CANNON from 'cannon-es';
import { KeyController } from '@/object/KeyController';
import { Player } from '@/object/Player';
import { RiCreativeCommonsZeroFill } from 'react-icons/ri';
import { itemVariants } from '@/utils/motion';
import { TouchController } from '@/object/TouchController';

const ThreeScene = () => {

  useEffect(() => {

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 3, 7);
    scene.add(camera);

    //Controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const keyController = new KeyController();
    const touchController = new TouchController();
    

    // Light
    const ambientLight = new THREE.AmbientLight('white', 1);
    const pointLight = new THREE.PointLight('white', 100, 100);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.position.y = 10;

    scene.add(ambientLight, pointLight);

    // Cannon(Physics)

    const cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, -10, 0);

    const defaultCannonMaterial = new CANNON.Material('default');
    const playerCannonMaterial = new CANNON.Material('player');

    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultCannonMaterial,
        defaultCannonMaterial,
        {
            friction: 1,
            restitution: 0.2
        }
    );

    const playerContactMaterial = new CANNON.ContactMaterial(
        playerCannonMaterial,
        defaultCannonMaterial,
        {
            friction: 1,
            restitution: 0.2
        }
    );
    cannonWorld.defaultContactMaterial = defaultContactMaterial;
    cannonWorld.addContactMaterial(playerContactMaterial)

    const cannonObjects: MeshObject[] = [];

    // Mesh
    const ground = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'ground',
        width: 50,
        height: 0.2,
        depth: 50,
        color: 'white',
        y: -0.2,
        differenceY: '0'
    });
    
    const floor = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'floor',
        width: 10,
        height: 0.4,
        depth: 7,
        differenceY: '0',
        color: '#ccbaa3'
    });

    const wall1 = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'wall1',
        width: 10,
        height: 3,
        depth: 0.2,
        z: -3.4,
        color: '#da8f74'
    });
    
    const wall2 = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'wall2',
        width: 0.2,
        height: 3,
        depth: 6.8,
        x: 4.9,
        z: 0.1,
        color: '#da8f74'
    });

    const wall3 = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'wall3',
        width: 10,
        height: 3,
        depth: 0.2,
        z: 3.4,
        color: '#da8f74'
    });
    

    const desk = new MeshObject({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        mass: 100,
        loader: gltfLoader,
        name: 'desk',
        width: 2.5,
        height: 1.04,
        depth: 0.75,
        scaleX: 1.4,
        scaleY: 1.2,
        x: 3.5,
        z: -3,
        rotationY: THREE.MathUtils.degToRad(180),
        modelSrc: '/models/desk.glb'
    });

    const simpleTable = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'simpleTable',
        width: 1.97,
        height: 1,
        depth: 0.8,
        scaleX: 1,
        scaleY: 0.8,
        scaleZ: 0.8,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        rotationY: THREE.MathUtils.degToRad(90),
        mass: 100,
        modelSrc: '/models/table_1_all_metal.glb',
        x: 2.65,
        z: -1.6,
    })

    const chair = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'officeChair',
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        x: 3.5,
        z: -1.7,
        y: 0.4,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        scaleX: 1.3,
        scaleY: 1.3,
        scaleZ: 1.3,
        mass: 30,
        differenceY: '0',
        modelSrc: '/models/high_quality_chair.glb'
    })

    const shelf = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'bookShelf',
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        x: 2.5,
        z: 3.1,
        // y: 0.4,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        scaleX: 0.04,
        scaleY: 0.04,
        scaleZ: 0.04,
        rotationY: THREE.MathUtils.degToRad(180),
        mass: 30,
        y: 0.4,
        // differenceY: '0',
        modelSrc: '/models/book_shelf.glb'
    })

    const light_oak_bookshelf = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'light_oak_bookshelf',
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        x: 1,
        z: 3,
        // y: 0.4,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        scaleX: 0.015,
        scaleY: 0.015,
        scaleZ: 0.015,
        rotationY: THREE.MathUtils.degToRad(180),
        mass: 30,
        y: 0.4,
        // differenceY: '0',
        modelSrc: '/models/light_oak_bookshelf.glb'
    })

    const jazz_bass = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'jazz_bass',
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        x: 2.5,
        z: -0.35,
        y: 0.4,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        rotationY: THREE.MathUtils.degToRad(0),
        rotationX: THREE.MathUtils.degToRad(75),
        rotationZ: THREE.MathUtils.degToRad(90),
        mass: 30,
        // differenceY: '0',
        modelSrc: '/models/jazz_bass.glb'
    })

    const pc = new MeshObject({
        scene,
        loader: gltfLoader,
        name: 'pc',
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        x: 2.6,
        z: -3,
        y: 1.4,
        scaleX: 0.15,
        scaleY: 0.15,
        scaleZ: 0.15,
        cannonMaterial: defaultCannonMaterial,
        cannonWorld,
        // rotationY: THREE.MathUtils.degToRad(0),
        // rotationX: THREE.MathUtils.degToRad(75),
        // rotationZ: THREE.MathUtils.degToRad(90),
        mass: 30,
        // differenceY: '0',
        modelSrc: '/models/pc.glb'
    })

    const player = new Player({
        scene,
        cannonWorld,
        cannonMaterial: defaultCannonMaterial,
        name: 'player',
        width: 0.5,
        height: 1,
        depth: 0.5,
        x: 0,
        z: 1.5,
        mass: 50
    });

    function move(){
        if(keyController.keys['KeyW'] || keyController.keys['ArrowUp']){
            player.walk(-0.03, 'forward');
        }

        if(keyController.keys['KeyS'] || keyController.keys['ArrowDown']){
            player.walk(0.03, 'backward');
        }

        if(keyController.keys['KeyA'] || keyController.keys['ArrowLeft']){
            player.walk(0.03, 'left');
        }

        if(keyController.keys['KeyD'] || keyController.keys['ArrowRight']){
            player.walk(0.03, 'right');
        }
    }

    function moveMobile(){
        if(!touchController.walkTouch) return;

        const cx = touchController.cx;
        const cy = touchController.cy;
        const yy = touchController.walkTouch.clientY - cy;
        const xx = touchController.walkTouch.clientX - cx;
        const angle = Math.atan2(-yy, xx);
        const angle2 = Math.atan2(yy, xx);

        player.walkMobile(delta, angle);

        touchController.setAngleOfBar(angle2);
    }

    let movementX = 0;
    let movementY = 0;

    cannonObjects.push(ground, floor, wall1, wall2, wall3);

    let device;
    function setDevice(){
        const htmlElem = document.querySelector('html');
        if('ontouchstart' in document.documentElement && window.innerWidth < 1300){
            device = 'mobile';
            htmlElem?.classList.add('touchevents')
        }else {
            device = 'desktop';
            htmlElem?.classList.add('no-touchevents')
        }
    }

    function setLayout(){
        setDevice();
        if(device === 'mobile'){
            touchController.setPosition();
        }
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function updateMovementValue(event: any){
        movementX = event.movementX * delta;
        movementY = event.movementY * delta;
    }

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const minPolarAngle = 0;
    const maxPolarAngle = Math.PI;

    function moveCamera(){
        let factor = delta * 50;
        if (device === 'mobile'){
            factor = delta
        }

        // rotation
        euler.setFromQuaternion(camera.quaternion);
        euler.y -= movementX * factor;
        euler.x -= movementY * factor;
        euler.x = Math.max(Math.PI / 2 - maxPolarAngle, Math.min(Math.PI / 2 - minPolarAngle, euler.x))

        movementX -= movementX * 0.2;
        movementY -= movementY * 0.2;

        camera.quaternion.setFromEuler(euler);
        player.rotationY = euler.y;

        // position
        camera.position.x = Number(player.x);
        camera.position.y = Number(player.y) + 1.3;
        camera.position.z = Number(player.z);
    }

    function setMode(mode: string){
        document.body.dataset.mode = mode
        if(mode === "game"){
            document.addEventListener('mousemove', updateMovementValue)
        }else{
            document.removeEventListener('mousemove', updateMovementValue)
        }
    }

    // Raycasting
    const mouse = new THREE.Vector2(); // 0, 0
    const raycaster = new THREE.Raycaster();

    function checkIntersects(){
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        for (const item of intersects){
            if(item.object.name === 'lamp'){
                console.log(item.object.name)
                break;
            }else if (item.object.name === 'roboticVaccum'){
                console.log(item.object.name)
                break;
            }
        }
    }


    const clock = new THREE.Clock();
    let delta: any;

     //Draw
     function draw(){
        const canvases = document.querySelectorAll('canvas');
            if (canvases.length > 1) {
            // 중복된 canvas 삭제 로직
            canvases[1].remove(); //
            }

        delta = clock.getDelta();

        let cannonStepTime = 1/60;
        if(delta < 0.01){
            cannonStepTime = 1/120;
        };
        cannonWorld.step(cannonStepTime, delta, 3);

        for(const object of cannonObjects){
            if(object.cannonBody){
                object.mesh.position.copy(object.cannonBody.position);
                object.mesh.quaternion.copy(object.cannonBody.quaternion);
                if(object.transparentMesh){
                    object.transparentMesh.position.copy(object.cannonBody.position);
                    object.transparentMesh.quaternion.copy(object.cannonBody.quaternion);
                }
            }
        }

        if(player.cannonBody){
            player.mesh.position.copy(player.cannonBody.position);
            player.x = player.cannonBody.position.x;
            player.y = player.cannonBody.position.y;
            player.z = player.cannonBody.position.z;

            if(device === 'mobile'){
                moveMobile();
            }else{
                move();
            }

            
        }
    
        moveCamera();
        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
        }
    
        setDevice();
        draw();

    const canvas = document.querySelector('canvas');

   window.addEventListener('resize', setLayout)
   document.addEventListener('click', () => {
    // document.body.requestPointerLock();
    if (device === 'mobile') return;
    canvas?.requestPointerLock();
   })

   canvas?.addEventListener('click', event => {
    if(device === "mobile"){
        mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
        mouse.y = -(event.clientY / canvas.clientHeight * 2 - 1);
        checkIntersects();
    }else{
        mouse.x = 0;
        mouse.y = 0;
        if(document.body.dataset.mode === 'game'){
            checkIntersects();
        }
    }
    
    
   })

   document.addEventListener('pointerlockchange', () => {
    if(document.pointerLockElement === canvas){
        setMode('game')
    }else{
        setMode('website')
    }
   })

   const touchX: any[] = [];
   const touchY: any[] = [];
   window.addEventListener('touchstart', event => {
    if(event.target === touchController.elem){
        return;
    }
    movementX = 0;
    movementY = 0;

    touchX[0] = event.targetTouches[0].clientX;
    touchX[1] = event.targetTouches[0].clientX;
    touchY[0] = event.targetTouches[0].clientY;
    touchY[1] = event.targetTouches[0].clientY;
   });

   window.addEventListener('touchmove', event => {
    if(event.target === touchController.elem){
        return;
    }

    movementX = 0;
    movementY = 0;

    touchX[0] = touchX[1];
    touchX[1] = event.targetTouches[0].clientX;
    touchY[0] = touchY[1];
    touchY[1] = event.targetTouches[0].clientY;

    movementX = touchX[1] - touchX[0];
    movementY = touchY[1] - touchY[0];
   });

   window.addEventListener('touchend', event => {
    if(event.target === touchController.elem){
        return;
    }
    movementX = 0;
    movementY = 0;
    touchX[0] = touchX[1] = 0;
    touchY[0] = touchY[1] = 0;

   });

   window.addEventListener('gesturestart', event => {
    event.preventDefault();
   })
   window.addEventListener('gesturechange', event => {
    event.preventDefault();
   })
   window.addEventListener('gestureend', event => {
    event.preventDefault();
   })

  }, []);

  return (
    <>
        <div className="target-marker"></div>
        <div className="mobile-controller">
            <div className="mobile-controller-bar"></div>
        </div>
        
    </>
  );
};

export default ThreeScene;
