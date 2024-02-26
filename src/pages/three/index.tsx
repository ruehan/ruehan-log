import { Canvas, useThree } from '@react-three/fiber';
import ThreeElement from './ThreeElement';

export default function Three() {
  return (
    <>
      <Canvas>
        <ThreeElement></ThreeElement>
      </Canvas>
    </>
  );
}
