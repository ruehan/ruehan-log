import { UNDEFINED } from 'swr/_internal';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as CANNON from 'cannon-es';
import { AnyObject } from 'three/examples/jsm/nodes/core/constants';

export class MeshObject {
    name: string;
    width: number;
    height: number;
    depth: number;
    color?: string;
    mesh!: THREE.Mesh;
    x: number;
    y: number;
    z: number;
    differenceY?: string;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    mass?: any;
    cannonBody?: any;
    cannonMaterial?: any;
    cannonWorld?: any;
    scaleX: any;
    scaleY: any;
    scaleZ: any;
    cannonShape?: any;
    transparentMesh: any;

    constructor(info: {name: string, width: number, height: number, depth: number, 
        color?: string, scene: THREE.Scene, x?: number, y?: number, z?: number, modelSrc?: string, loader?: any,
        differenceY?: string, rotationX?: any, rotationY?: any, rotationZ?: any, mapSrc?: string,
        mass?: any, cannonMaterial?: any, cannonWorld?: any, scaleX?: any, scaleY?: any, scaleZ?: any,
        cannonShape?: AnyObject, geometry?: any}) {
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

        this.cannonShape = info.cannonShape || new CANNON.Box(new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2))

        this.mass = info.mass || 0;
        this.cannonMaterial = info.cannonMaterial;
        this.cannonWorld = info.cannonWorld;

        if(info.modelSrc){
            info.loader.load(
                info.modelSrc,
                (glb: any) => {
                    console.log(glb)
                    glb.scene.traverse((child: { isMesh: any; castShadow: boolean; }) => {
                        if(child.isMesh){
                            child.castShadow = true;
                        }
                    })
                    this.mesh = glb.scene;
                    this.mesh.name = this.name;
                    this.mesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
                    this.mesh.position.set(this.x, this.y, this.z)
                    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
                    info.scene.add(this.mesh);

                    // Transparent Mesh for Raycasting
                    const geometry = info.geometry || new THREE.BoxGeometry(this.width, this.height, this.depth);
                    this.transparentMesh = new THREE.Mesh(
                        geometry,
                        new THREE.MeshBasicMaterial({
                            color: 'yellow',
                            transparent: true,
                            opacity: 0,
                        })
                    )
                    this.transparentMesh.name = this.name;
                    this.transparentMesh.position.set(this.x, this.y, this.z);
                    info.scene.add(this.transparentMesh);

                    this.setCannonBody();
                },
                (xhr: any) => {
                    console.log('loading..')
                },
                (error: any) => {
                    console.log('error')
                }
                );
        }else if (info.mapSrc) 
        {
            const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
            info.loader.load(
                info.mapSrc,
                (texture: any) => {
                    const material = new THREE.MeshLambertMaterial({
                        map: texture
                    });
                    this.mesh = new THREE.Mesh(geometry, material);
                    this.mesh.name = this.name;
                    this.mesh.castShadow = true;
                    this.mesh.receiveShadow = true;
                    this.mesh.position.set(this.x ,this.y, this.z)
                    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
                    info.scene.add(this.mesh);

                    this.setCannonBody();
                }
            )
        }
        else{
            const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
            const material = new THREE.MeshLambertMaterial({
            color: this.color,
            // side: THREE.DoubleSide
            });

            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.name = this.name;
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.x ,this.y, this.z)
            this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
            info.scene.add(this.mesh);

            this.setCannonBody();
        }     
    }

    setCannonBody(){
        this.cannonBody = new CANNON.Body({
            mass: this.mass,
            position: new CANNON.Vec3(this.x, this.y, this.z),
            shape: this.cannonShape,
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