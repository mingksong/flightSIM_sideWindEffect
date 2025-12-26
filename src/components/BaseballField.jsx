import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// 3D 야구장 컴포넌트
export function BaseballField() {
  return (
    <group>
      {/* 바닥 (잔디) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.01]}>
        <planeGeometry args={[30, 25]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>

      {/* 마운드 */}
      <Mound />

      {/* 홈플레이트 영역 */}
      <HomePlate />

      {/* 스트라이크 존 */}
      <StrikeZone />

      {/* 파울 라인 */}
      <FoulLines />

      {/* 배터 박스 */}
      <BatterBox />
    </group>
  );
}

// 마운드 컴포넌트
function Mound() {
  return (
    <group position={[0, 0, 0]}>
      {/* 마운드 언덕 */}
      <mesh position={[0, 0.127, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.8, 0.254, 32]} />
        <meshStandardMaterial color="#c4a574" />
      </mesh>

      {/* 투수판 */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.61, 0.02, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 홈플레이트 영역
function HomePlate() {
  const plateShape = useMemo(() => {
    const shape = new THREE.Shape();
    // 홈플레이트 모양 (오각형)
    shape.moveTo(0, 0.2159);
    shape.lineTo(0.2159, 0.1079);
    shape.lineTo(0.2159, -0.1079);
    shape.lineTo(0, -0.2159);
    shape.lineTo(-0.2159, -0.1079);
    shape.lineTo(-0.2159, 0.1079);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={[0, 0, 18.44]}>
      {/* 흙 영역 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#c4a574" />
      </mesh>

      {/* 홈플레이트 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <shapeGeometry args={[plateShape]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 스트라이크 존
function StrikeZone() {
  const zoneHeight = 0.6; // 약 60cm (무릎~가슴)
  const zoneWidth = 0.43; // 홈플레이트 너비 (17인치 = 43cm)
  const zoneBottom = 0.5; // 무릎 높이
  const zoneTop = zoneBottom + zoneHeight;
  const zoneCenter = (zoneBottom + zoneTop) / 2;

  // 스트라이크 존 프레임 라인 포인트
  const framePoints = [
    [-zoneWidth/2, zoneBottom, 18.44],
    [zoneWidth/2, zoneBottom, 18.44],
    [zoneWidth/2, zoneTop, 18.44],
    [-zoneWidth/2, zoneTop, 18.44],
    [-zoneWidth/2, zoneBottom, 18.44],
  ];

  return (
    <group>
      {/* 스트라이크 존 프레임 */}
      <Line points={framePoints} color="#ff0000" lineWidth={2} />

      {/* 스트라이크 존 면 (반투명) */}
      <mesh position={[0, zoneCenter, 18.44]}>
        <planeGeometry args={[zoneWidth, zoneHeight]} />
        <meshStandardMaterial
          color="#ff0000"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 파울 라인
function FoulLines() {
  const linePoints1 = useMemo(() => {
    return [
      [0, 0.01, 18.44],
      [-15, 0.01, 0],
    ];
  }, []);

  const linePoints2 = useMemo(() => {
    return [
      [0, 0.01, 18.44],
      [15, 0.01, 0],
    ];
  }, []);

  return (
    <group>
      <Line points={linePoints1} color="#ffffff" lineWidth={2} />
      <Line points={linePoints2} color="#ffffff" lineWidth={2} />
    </group>
  );
}

// 배터 박스
function BatterBox() {
  // 좌타자 박스 프레임
  const leftBoxPoints = [
    [-0.7 - 0.6, 0.02, 18.44 - 0.9],
    [-0.7 + 0.6, 0.02, 18.44 - 0.9],
    [-0.7 + 0.6, 0.02, 18.44 + 0.9],
    [-0.7 - 0.6, 0.02, 18.44 + 0.9],
    [-0.7 - 0.6, 0.02, 18.44 - 0.9],
  ];

  // 우타자 박스 프레임
  const rightBoxPoints = [
    [0.7 - 0.6, 0.02, 18.44 - 0.9],
    [0.7 + 0.6, 0.02, 18.44 - 0.9],
    [0.7 + 0.6, 0.02, 18.44 + 0.9],
    [0.7 - 0.6, 0.02, 18.44 + 0.9],
    [0.7 - 0.6, 0.02, 18.44 - 0.9],
  ];

  return (
    <group>
      {/* 좌타자 박스 */}
      <Line points={leftBoxPoints} color="#ffffff" lineWidth={2} />

      {/* 우타자 박스 */}
      <Line points={rightBoxPoints} color="#ffffff" lineWidth={2} />
    </group>
  );
}

// 궤적 라인 컴포넌트
export function TrajectoryLine({ trajectory, color = '#ff0000', opacity = 1 }) {
  const points = useMemo(() => {
    if (!trajectory || trajectory.length === 0) return [];
    // 좌표계 변환: 물리엔진의 y(전방)를 Three.js의 z로
    return trajectory.map(p => [p.x, p.z, p.y]);
  }, [trajectory]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={3}
      transparent
      opacity={opacity}
    />
  );
}

// 애니메이션 야구공 컴포넌트
export function AnimatedBall({ trajectory, isPlaying, playbackSpeed = 1, onComplete, color = '#ffffff' }) {
  const meshRef = useRef();
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (!isPlaying || !trajectory || trajectory.length === 0 || !meshRef.current) return;

    const totalTime = trajectory[trajectory.length - 1].time;
    progressRef.current += delta * playbackSpeed;

    if (progressRef.current >= totalTime) {
      progressRef.current = totalTime;
      if (onComplete) onComplete();
    }

    // 현재 시간에 해당하는 위치 찾기
    const currentTime = progressRef.current;
    let idx = 0;
    for (let i = 0; i < trajectory.length - 1; i++) {
      if (trajectory[i].time <= currentTime && trajectory[i + 1].time > currentTime) {
        idx = i;
        break;
      }
    }

    if (idx < trajectory.length - 1) {
      const t1 = trajectory[idx].time;
      const t2 = trajectory[idx + 1].time;
      const t = (currentTime - t1) / (t2 - t1);

      // 좌표계 변환: 물리엔진의 y(전방)를 Three.js의 z로
      const px = trajectory[idx].x + (trajectory[idx + 1].x - trajectory[idx].x) * t;
      const py = trajectory[idx].y + (trajectory[idx + 1].y - trajectory[idx].y) * t;
      const pz = trajectory[idx].z + (trajectory[idx + 1].z - trajectory[idx].z) * t;
      meshRef.current.position.set(px, pz, py);
    }
  });

  // 재생 시작 시 위치 초기화
  React.useEffect(() => {
    if (isPlaying && meshRef.current && trajectory && trajectory.length > 0) {
      progressRef.current = 0;
      // 좌표계 변환
      meshRef.current.position.set(trajectory[0].x, trajectory[0].z, trajectory[0].y);
    }
  }, [isPlaying, trajectory]);

  if (!trajectory || trajectory.length === 0) return null;

  // 초기 위치도 변환
  return (
    <mesh ref={meshRef} position={[trajectory[0].x, trajectory[0].z, trajectory[0].y]}>
      <sphereGeometry args={[0.0365, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default BaseballField;
