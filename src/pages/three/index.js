import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { easing } from 'maath';
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  useTexture,
} from '@react-three/drei';

import * as THREE from 'three';

function Gallery() {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <fog attach="fog" args={['#a79', 8.5, 12]} />
      <ScrollControls pages={4} infinite>
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel />
        </Rig>
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
}

function Rig(props) {
  const ref = useRef(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
    state.events.update();
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={ref} {...props}></group>;
}

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

function Carousel({ radius = 2, count = images.length }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={images[i]}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

function Card({ url, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(
      ref.current.material,
      'radius',
      hovered ? 0.25 : 0.1,
      0.2,
      delta,
    );
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
  });
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      {/* <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} /> */}
    </Image>
  );
}

export default Gallery;
