import {
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  Plane,
} from '@react-three/drei';
import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MovingSphere from '../components/three/MovingSphere';
import Gallery from '../components/three/Gallery';
import useSWR, { mutate } from 'swr';
import { marked } from 'marked';
import * as THREE from 'three';

function App() {
  const characterRef = useRef();
  const artworkRef = useRef();
  const planeRef = useRef();
  const [blogPost, setBlogPost] = useState('');
  const [isEntered, setIsEntered] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [isInsideZone, setIsInsideZone] = useState(false);
  const { data: posts, error } = useSWR('/api/get-post');

  const [planeSize, setPlaneSize] = useState([1, 1]);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setPlaneSize([width * 0.01, height * 0.015]);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  console.log(planeSize);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isInsideZone) {
        const filteredPost = posts.getPost.filter(
          (post) => post.title == countryName,
        );
        console.log(characterRef.current.position);

        setBlogPost(filteredPost[0].content);
        setIsEntered(true);
      } else if (!isInsideZone && blogPost) {
        setBlogPost('');
        setIsEntered(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInsideZone]);

  return (
    <Canvas camera={{ position: [7, 7, 7], fov: 75 }}>
      <color attach="background" args={['#191920']} />
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <Gallery
          characterRef={characterRef}
          setIsInsideZone={setIsInsideZone}
          setCountryName={setCountryName}
          artworkRef={artworkRef}
        />
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

        {isInsideZone && isEntered && (
          <mesh>
            <Html
              position={[
                characterRef.current.position.x,
                characterRef.current.position.y - 1,
                characterRef.current.position.z - 1,
              ]}
              rotation={[THREE.MathUtils.degToRad(-25), 0, 0]}
              transform
              style={{
                width: `${planeSize[0] * 40}px`,
                height: `${planeSize[1] * 35}px`,
              }}
            >
              <div
                className={'font-nanum p-4'}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'scroll',
                  backgroundColor: 'white',
                }}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(blogPost || ''),
                }}
              />
            </Html>
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
}

export default App;
