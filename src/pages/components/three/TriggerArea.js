import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function TriggerArea({
  position,
  onEnter,
  onLeave,
  size,
  characterRef,
  country,
  setIsInsideZone,
  // zoneRef,
}) {
  const enteredRef = useRef(false);
  const zoneRef = useRef();

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
      setIsInsideZone(true);
      enteredRef.current = true;
    } else if (!isInside && enteredRef.current) {
      onLeave();
      setIsInsideZone(false);
      enteredRef.current = false;
    }
  });

  return (
    <mesh
      ref={zoneRef}
      position={[position[0], position[1] - 4, position[2] + 40]}
      visible={true}
    >
      <boxGeometry args={[7, 0.1, 8]} />
      <meshBasicMaterial transparent opacity={0.2} color={'red'} />
    </mesh>
  );
}

export default TriggerArea;
