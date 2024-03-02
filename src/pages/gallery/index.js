import {
  MeshReflectorMaterial,
  OrbitControls,
  Reflector,
} from '@react-three/drei';
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import * as THREE from 'three';

const IMAGE_WIDTH = 12; // 기본 이미지 너비
const IMAGE_HEIGHT = 8; // 기본 이미지 높이
const GAP = 0.5; // 이미지 간의 간격s
const ROWS = 6; // 행의 수

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
        {/* {triggerAreaPositions.map((pos, index) => (
          <TriggerArea key={index} position={pos} />
        ))} */}
      </Suspense>
    </Canvas>
  );
}

function MovingSphere({ characterRef }) {
  // const sphereRef = useRef();
  // const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const updatePosition = (state) => {
    const speed = 0.2;
    let direction = new THREE.Vector3();

    if (movement.forward) direction.z -= speed;
    if (movement.backward) direction.z += speed;
    if (movement.left) direction.x -= speed;
    if (movement.right) direction.x += speed;

    // 대각선 이동 시 속도 조정을 위해 정규화
    direction.normalize().multiplyScalar(speed);
    characterRef.current.position.add(direction);

    state.camera.position.x = characterRef.current.position.x;
    state.camera.position.y = characterRef.current.position.y + 5;
    state.camera.position.z = characterRef.current.position.z + 10;
    state.camera.lookAt(characterRef.current.position);
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

  return (
    <mesh ref={characterRef} position={[0, 1, 3]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const images = [
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/e7e0d2b2-a573-410d-2850-0a953d439300/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/ee612a1d-849e-468c-6696-cfdbbdcb8800/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/05c4cd5a-a9cd-440d-57b4-799b30eaf900/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/54306d63-06a9-4a17-8041-78705bf8fc00/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/652cd57b-c0af-45f1-2c75-0d9f1a5ec700/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/2b642ce5-4638-405a-cbcc-cf0aadc17000/public',

  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/97aad9fe-c276-4c0e-203f-3851261c2500/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/8c10bde2-5241-4247-4282-533a83a3e300/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/0f1047d2-1e6f-4862-3ceb-49703e42f100/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/ff25be04-2306-4559-2172-b27694b74b00/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/7041263e-10b3-466b-796c-a9a7149b0500/public',
  'https://imagedelivery.net/CJyrB-EkqcsF2D6ApJzEBg/3278e9b2-7523-4c78-e894-6cd12ef07600/public',
];

const country = [
  '런던',
  '파리',
  '인터라켄',
  '뮌헨',
  '체스키크룸로프',
  '프라하',

  '로마',
  '피렌체',
  '니스',
  '바르셀로나',
  '빈',
  '부다페스트',
];

function Gallery({ characterRef }) {
  const { viewport } = useThree();
  const rowWidth = viewport.width / 2; // 뷰포트 너비를 기준으로 행 너비 계산

  const handleEnterZone = (con) => {
    console.log(con);
    // console.log('Enter Zone');
  };

  const handleLeaveZone = () => {
    // console.log('Leave Zone!');
  };
  return (
    <>
      {images.map((url, index) => {
        const row = index % ROWS;
        const column = Math.floor(index / ROWS);

        const x = (column % 2 === 0 ? 1 : -1) * (rowWidth / 2 - GAP / 2) * 2; // 열에 따라 x 위치 결정
        const y = 4.2; // y 위치는 고정
        const z = -row * (IMAGE_HEIGHT + GAP) * 2; // 행에 따라 z 위치 결정

        return (
          <>
            <Artwork
              key={index}
              url={url}
              position={new THREE.Vector3(x, y, z)}
            />
            <TriggerArea
              key={index}
              country={country[index]}
              position={[x, y, z]}
              onEnter={handleEnterZone}
              onLeave={handleLeaveZone}
              size={{ width: 7, depth: 8 }}
              characterRef={characterRef}
            />
          </>
        );
      })}
    </>
  );
}

function Artwork({ position, url, index, frameWidth = 0.2, frameDepth = 0.1 }) {
  const texture = useLoader(TextureLoader, url);
  const ratio = texture.image.width / texture.image.height;
  const imageWidth = 2;
  const imageHeight = imageWidth / ratio;

  return (
    <group position={[position.x, position.y, position.z + 40]}>
      {/* 이미지 표시 */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
        <planeGeometry args={[IMAGE_HEIGHT * ratio, IMAGE_HEIGHT]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {/* 액자 테두리 */}
      <mesh>
        <boxGeometry
          args={[
            IMAGE_HEIGHT * ratio + frameWidth,
            IMAGE_HEIGHT + frameWidth,
            frameDepth,
          ]}
          // position={[0, 1, 0]}
        />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

function TriggerArea({
  position,
  onEnter,
  onLeave,
  size,
  characterRef,
  country,
}) {
  const { camera } = useThree();
  const zoneRef = useRef();
  const enteredRef = useRef(false);
  console.log(position);

  useFrame(() => {
    if (!characterRef.current) return;

    const characterPosition = characterRef.current.position;
    const zonePosition = zoneRef.current.position;

    const isInside =
      characterPosition.x >= zonePosition.x - size.width / 2 &&
      characterPosition.x <= zonePosition.x + size.width / 2 &&
      characterPosition.z >= zonePosition.z - size.depth / 2 &&
      characterPosition.z <= zonePosition.z + size.depth / 2;

    if (isInside && !enteredRef.current) {
      onEnter(country);
      enteredRef.current = true;
    } else if (!isInside && enteredRef.current) {
      onLeave();
      enteredRef.current = false;
    }
  });

  return (
    <mesh
      ref={zoneRef}
      position={[position[0], position[1] - 4, position[2] + 40]}
      visible={true}
      a
    >
      <boxGeometry args={[7, 0.1, 8]} />
      <meshBasicMaterial transparent opacity={0.2} color={'red'} />
    </mesh>
  );
}

export default App;
