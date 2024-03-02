import { MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MovingSphere from '../components/three/MovingSphere';
import Gallery from '../components/three/Gallery';
import useSWR, { mutate } from 'swr';
function App() {
  const characterRef = useRef();
  const [blogPost, setBlogPost] = useState('');
  const [countryName, setCountryName] = useState('');
  const [isInsideZone, setIsInsideZone] = useState(false);
  const { data: posts, error } = useSWR('/api/get-post');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isInsideZone) {
        const filteredPost = posts.getPost.filter(
          (post) => post.title == countryName,
        );

        console.log(filteredPost[0].content);
        setBlogPost('블로그 글 내용이 여기에 표시됩니다.');
      } else if (!isInsideZone && blogPost) {
        console.log('블로그 종료', countryName);
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

      {/* <gridHelper args={[100, 100]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <Gallery
          characterRef={characterRef}
          setIsInsideZone={setIsInsideZone}
          setCountryName={setCountryName}
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
      </Suspense>
    </Canvas>
  );
}

export default App;
