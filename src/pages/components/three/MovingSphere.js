import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function MovingSphere({ characterRef }) {
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

export default MovingSphere;
