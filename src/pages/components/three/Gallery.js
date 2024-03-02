import { useThree } from '@react-three/fiber';
import Artwork from './ArtWork';
import TriggerArea from './TriggerArea';
import * as THREE from 'three';

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

const IMAGE_HEIGHT = 8; // 기본 이미지 높이
const GAP = 0.5; // 이미지 간의 간격s
const ROWS = 6; // 행의 수

function Gallery({ characterRef, setIsInsideZone, setCountryName }) {
  const { viewport } = useThree();
  const rowWidth = viewport.width / 2; // 뷰포트 너비를 기준으로 행 너비 계산

  const handleEnterZone = (con) => {
    console.log(con);
    setCountryName(con);
  };

  const handleLeaveZone = () => {};
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
              IMAGE_HEIGHT={8}
            />
            <TriggerArea
              key={`${index}s`}
              country={country[index]}
              position={[x, y, z]}
              onEnter={handleEnterZone}
              onLeave={handleLeaveZone}
              size={{ width: 7, depth: 8 }}
              characterRef={characterRef}
              setIsInsideZone={setIsInsideZone}
            />
          </>
        );
      })}
    </>
  );
}

export default Gallery;
