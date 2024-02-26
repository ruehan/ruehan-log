import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

export default function ThreeElement() {
  const { size, gl, scene, camera } = useThree();
  const boxRef = useRef<THREE.Mesh>(null);

  // Animation Here
  useFrame((state, delta) => {
    boxRef.current.rotation.x += delta;
    boxRef.current.rotation.y += delta;
  });

  return (
    <>
      <directionalLight position={[5, 5, 5]} />
      <mesh
        ref={boxRef}
        rotation={[
          THREE.MathUtils.degToRad(45),
          THREE.MathUtils.degToRad(45),
          0,
        ]}
      >
        <boxGeometry />
        <meshStandardMaterial color={'skyblue'} />
      </mesh>
    </>
  );
}
