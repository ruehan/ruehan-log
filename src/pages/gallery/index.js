import { OrbitControls } from '@react-three/drei';
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import * as THREE from 'three';

function App() {
  return (
    <Canvas camera={{ position: [0, 10, 10], fov: 75 }}>
      <gridHelper args={[100, 100]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Gallery />
        <MovingSphere />
      </Suspense>
    </Canvas>
  );
}

function MovingSphere() {
  // const sphereRef = useRef();
  const ref = useRef();
  // const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const updatePosition = (state) => {
    const speed = 0.1;
    let direction = new THREE.Vector3();

    if (movement.forward) direction.z -= speed;
    if (movement.backward) direction.z += speed;
    if (movement.left) direction.x -= speed;
    if (movement.right) direction.x += speed;

    // 대각선 이동 시 속도 조정을 위해 정규화
    direction.normalize().multiplyScalar(speed);
    ref.current.position.add(direction);

    state.camera.position.x = ref.current.position.x;
    state.camera.position.y = ref.current.position.y + 10;
    state.camera.position.z = ref.current.position.z + 10;
    state.camera.lookAt(ref.current.position);
  };

  useFrame((state) => {
    updatePosition(state);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setMovement((m) => ({
        ...m,
        forward: e.key === 'w' || m.forward,
        backward: e.key === 's' || m.backward,
        left: e.key === 'a' || m.left,
        right: e.key === 'd' || m.right,
      }));
    };

    const handleKeyUp = (e) => {
      setMovement((m) => ({
        ...m,
        forward: e.key === 'w' ? false : m.forward,
        backward: e.key === 's' ? false : m.backward,
        left: e.key === 'a' ? false : m.left,
        right: e.key === 'd' ? false : m.right,
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  // useFrame((state) => {
  //   // console.log(sphereRef.current.position.x);
  //   sphereRef.current.position.x += velocity.x;
  //   sphereRef.current.position.z += velocity.z;

  //   state.camera.position.x = sphereRef.current.position.x;
  //   state.camera.position.y = sphereRef.current.position.y + 10;
  //   state.camera.position.z = sphereRef.current.position.z + 10;
  //   state.camera.lookAt(sphereRef.current.position);
  // });

  // window.onkeydown = (e) => {
  //   switch (e.key) {
  //     case 'ArrowUp':
  //       setVelocity({ x: 0, z: -0.1 });
  //       break;
  //     case 'ArrowDown':
  //       setVelocity({ x: 0, z: 0.1 });
  //       break;
  //     case 'ArrowLeft':
  //       setVelocity({ x: -0.1, z: 0 });
  //       break;
  //     case 'ArrowRight':
  //       setVelocity({ x: 0.1, z: 0 });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // window.onkeyup = () => setVelocity({ x: 0, z: 0 });

  return (
    <mesh ref={ref} position={[0, 1, 3]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Gallery() {
  const images = [
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/e7e0d2b2-a573-410d-2850-0a953d439300/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/ee612a1d-849e-468c-6696-cfdbbdcb8800/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/05c4cd5a-a9cd-440d-57b4-799b30eaf900/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/54306d63-06a9-4a17-8041-78705bf8fc00/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/652cd57b-c0af-45f1-2c75-0d9f1a5ec700/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/2b642ce5-4638-405a-cbcc-cf0aadc17000/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/7041263e-10b3-466b-796c-a9a7149b0500/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/3278e9b2-7523-4c78-e894-6cd12ef07600/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/97aad9fe-c276-4c0e-203f-3851261c2500/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/8c10bde2-5241-4247-4282-533a83a3e300/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/0f1047d2-1e6f-4862-3ceb-49703e42f100/public',
    'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/ff25be04-2306-4559-2172-b27694b74b00/public',
  ];

  return (
    <>
      {images.map((url, index) => (
        <Artwork key={index} position={[index * 7 - 10, 3, 0]} url={url} />
      ))}
    </>
  );
}

function Artwork({ position, url }) {
  const texture = useLoader(TextureLoader, url);
  return (
    <mesh position={position}>
      <planeGeometry args={[4, 6]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default App;
