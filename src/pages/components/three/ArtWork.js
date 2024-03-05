import { Text, Text3D } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { TextureLoader } from 'three';

function Artwork({
  position,
  url,
  frameWidth = 0.2,
  frameDepth = 0.1,
  IMAGE_HEIGHT,
  artworkRef,
  country,
  index,
  namePosition,
}) {
  const texture = useLoader(TextureLoader, url);
  const ratio = texture.image.width / texture.image.height;

  return (
    <group position={[position.x, position.y, position.z + 40]}>
      {/* 이미지 표시 */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]} ref={artworkRef}>
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
        />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh>
        <Text
          position={[-5, (IMAGE_HEIGHT + frameWidth) / 2 - 7, 1]}
          fontSize={0.7}
        >
          {country}
        </Text>
      </mesh>
    </group>
  );
}

export default Artwork;
