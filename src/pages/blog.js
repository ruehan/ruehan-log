import {
  CameraControls,
  MeshPortalMaterial,
  MeshReflectorMaterial,
  Text,
  useCursor,
} from '@react-three/drei';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { easing, geometry } from 'maath';
import useSWR, { mutate } from 'swr';
import * as THREE from 'three';
import GalleryApp from './gallery/index';

extend(geometry);

function Blog() {
  const [isActiveNum, setIsActiveNum] = useState(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {!isActive && isActiveNum == 0 && (
          <color attach="background" args={['#f0f0f0']} />
        )}

        <Frame
          id="01"
          name={`pick\nles`}
          author="Omar Faruq Tawsif"
          bg="#e4cdac"
          position={[-1.15, 0, 0]}
          rotation={[0, 0.5, 0]}
          setIsActiveNum={setIsActiveNum}
          setIsActive={setIsActive}
        ></Frame>
        <Frame
          id="02"
          name="travel"
          author="ruehan"
          setIsActiveNum={setIsActiveNum}
          setIsActive={setIsActive}
        >
          <GalleryApp isActiveNum={isActiveNum} isActive={isActive} />
        </Frame>
        <Frame
          id="03"
          name="still"
          author="Omar Faruq Tawsif"
          bg="#d1d1ca"
          position={[1.15, 0, 0]}
          rotation={[0, -0.5, 0]}
          setIsActiveNum={setIsActiveNum}
          setIsActive={setIsActive}
        ></Frame>
        <Rig isActiveNum={isActiveNum} isActive={isActive} />
      </Canvas>
    </>
  );
}

function Frame({
  id,
  name,
  author,
  bg,
  width = 1,
  height = 1.61803398875,
  children,
  setIsActive,
  setIsActiveNum,
  ...props
}) {
  const portal = useRef();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/blog/item/:id');
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame((state, dt) =>
    easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt),
  );

  return (
    <group {...props}>
      <Text
        // font={suspend(medium).default}
        fontSize={0.3}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        // font={suspend(regular).default}
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        // font={suspend(regular).default}
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={id}
        onDoubleClick={(e) => (
          e.stopPropagation(),
          setLocation('/blog/item/' + e.object.name),
          setIsActiveNum(id),
          setIsActive(true)
        )}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={THREE.DoubleSide}
        >
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}

function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
  isActive,
  isActiveNum,
}) {
  const { controls, scene } = useThree();
  const [, params] = useRoute('/blog/item/:id');
  useEffect(() => {
    const active = scene.getObjectByName(params?.id);
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25));
      active.parent.localToWorld(focus.set(0, 0, -2));
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });
  if (!isActive && isActiveNum == 0) {
    return (
      <CameraControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    );
  } else {
    return null;
  }
}

export default Blog;
