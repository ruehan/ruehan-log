import { MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import MovingSphere from '../components/three/MovingSphere';
import Gallery from '../components/three/Gallery';

function App() {
  const characterRef = useRef();
  return (
    <Canvas camera={{ position: [7, 7, 7], fov: 75 }}>
      <color attach="background" args={['#191920']} />

      {/* <gridHelper args={[100, 100]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <Gallery characterRef={characterRef} />
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[150, 150]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={0.3}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.1}
          />
        </mesh>
        <MovingSphere characterRef={characterRef} />
      </Suspense>
    </Canvas>
  );
}

export default App;
