import { UNDEFINED } from 'swr/_internal';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as CANNON from 'cannon-es';

export class Player {
    name: string;
    width: number;
    height: number;
    depth: number;
    color?: string;
    mesh: THREE.Mesh;
    x?: number;
    y?: number;
    z?: number;
    differenceY?: string;
    rotationX?: any;
    rotationY?: any;
    rotationZ?: any;
    mass?: any;
    cannonBody?: any;
    cannonMaterial?: any;
    cannonWorld?: any;
    scaleX?: any;
    scaleY?: any;
    scaleZ?: any;

    constructor(info: {name: string, width: number, height: number, depth: number, 
        color?: string, scene: THREE.Scene,x?: number, y?: number, z?: number, modelSrc?: string, loader?: any,
        differenceY?: string, rotationX?: any, rotationY?: any, rotationZ?: any, mapSrc?: string,
        mass?: any, cannonMaterial?: any, cannonWorld?: any, scaleX?: any, scaleY?: any, scaleZ?: any}) {
        this.name = info.name;
        this.width = info.width;
        this.height = info.height;
        this.depth = info.depth;
        this.color = info.color || 'white';
        this.differenceY = info.differenceY || '0.4';
        this.x = info.x || 0;
        this.y = info.y || this.height / 2 + Number(this.differenceY);
        this.z = info.z || 0;
        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;
        this.scaleX = info.scaleX || 1;
        this.scaleY = info.scaleY || 1;
        this.scaleZ = info.scaleZ || 1;

        this.mass = info.mass || 0;
        this.cannonMaterial = info.cannonMaterial;
        this.cannonWorld = info.cannonWorld;

        
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const material = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 'yellow',
            opacity: 0,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x ,this.y, this.z)
        this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
        info.scene.add(this.mesh);

        this.setCannonBody();      
    }

    walk(value: any, direction: any){

        if (direction === 'left') {
			this.rotationY -= THREE.MathUtils.degToRad(90);
		}
		if (direction === 'right') {
			this.rotationY += THREE.MathUtils.degToRad(90);
		}

        this.x += Math.sin(this.rotationY) * value;
        this.z += Math.cos(this.rotationY) * value;
        if(this.cannonBody) {
            this.cannonBody.position.x = this.x;
            this.cannonBody.position.z = this.z;
            // this.mesh.position.x = Number(this.x);
            // this.mesh.position.z = Number(this.z);
        }
    }

    walkMobile(value: any, radian: any){
        const angle = this.rotationY + radian + THREE.MathUtils.degToRad(90);
        this.x += Math.sin(angle) * value;
        this.z += Math.cos(angle) * value;
        this.cannonBody.position.x = this.x;
        this.cannonBody.position.z = this.z;
    }

    setCannonBody(){
        this.cannonBody = new CANNON.Body({
            mass: this.mass,
            position: new CANNON.Vec3(this.x, this.y, this.z),
            shape: new CANNON.Box(new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2)),
            material: this.cannonMaterial
        });

        const quatX = new CANNON.Quaternion();
        const axisX = new CANNON.Vec3(1, 0, 0);
        quatX.setFromAxisAngle(axisX, this.rotationX);

        const quatY = new CANNON.Quaternion();
        const axisY = new CANNON.Vec3(0, 1, 0);
        quatY.setFromAxisAngle(axisY, this.rotationY);

        const quatZ = new CANNON.Quaternion();
        const axisZ = new CANNON.Vec3(0, 0, 1);
        quatZ.setFromAxisAngle(axisZ, this.rotationZ);
        
        const combinedQuat = quatX.mult(quatY).mult(quatZ);
        this.cannonBody.quaternion = combinedQuat;

        this.cannonWorld.addBody(this.cannonBody);
    }
}