import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

function Artwork({
  position,
  url,
  frameWidth = 0.2,
  frameDepth = 0.1,
  IMAGE_HEIGHT,
}) {
  const texture = useLoader(TextureLoader, url);
  const ratio = texture.image.width / texture.image.height;

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
        />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

export default Artwork;
