import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { easing } from 'maath';
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  Float,
  Plane,
} from '@react-three/drei';
import useSWR, { mutate } from 'swr';

import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { marked } from 'marked';
import { Html } from '@react-three/drei';

function Gallery() {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const { data: posts, error } = useSWR('/api/get-post');

  if (!posts) {
    return null;
  }

  const selectedText = posts.getPost.find(
    (pair) => pair.title === selectedImageUrl,
  );

  console.log(selectedText);

  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <gridHelper />
      <axesHelper />
      <fog attach="fog" args={['#a79', 8.5, 12]} />
      <ScrollControls pages={4} infinite>
        <Rig selectedText rotation={[0, 0, 0.15]}>
          <Carousel setSelectedImageUrl={setSelectedImageUrl} />
        </Rig>
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
      {selectedText && <TextDisplay text={selectedText} />}
    </Canvas>
  );
}

function Rig(props, selectedText) {
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

const country = [
  '런던',
  '파리',
  '인터라켄',
  '뮌헨',
  '체스키크룸로프',
  '프라하',
  '빈',
  '부다페스트',
  '로마',
  '피렌체',
  '니스',
  '바르셀로나',
];

function Carousel({ radius = 2, count = images.length, setSelectedImageUrl }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={images[i]}
      country={country[i]}
      onClick={setSelectedImageUrl}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

function Card({ url, country, onClick, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  // const [rnd] = useState(() => Math.random());
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    // ref.current.material.zoom =
    //   2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
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
      onClick={() => onClick(country)}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    ></Image>
  );
}

function TextDisplay({ text }) {
  const ref = useRef();
  useFrame((state, delta) => {
    // 예를 들어, 객체를 회전시키는 등의 로직
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <Html fullscreen center>
        <div
          style={{
            width: '700px',
            height: '900px',
            backgroundColor: 'white',
            opacity: 0.9,
            overflow: 'scroll',
            borderRadius: '5%',
          }}
          dangerouslySetInnerHTML={{
            __html: marked.parse(text.content || ''),
          }}
        />
      </Html>
    </mesh>
  );
}

export default Gallery;
