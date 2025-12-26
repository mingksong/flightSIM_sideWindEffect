import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import { BaseballField, TrajectoryLine, AnimatedBall } from './BaseballField';

function Scene3D({
  trajectoryNoWind,
  trajectoryWithWind,
  isPlaying,
  playbackSpeed,
  onAnimationComplete
}) {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        {/* 카메라 설정 - 측면 뷰 (x: 좌우, y: 상하, z: 전후) */}
        <PerspectiveCamera
          makeDefault
          position={[15, 5, 9.22]}
          fov={50}
        />

        {/* 조명 */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, 10, -10]} intensity={0.3} />

        {/* 야구장 */}
        <BaseballField />

        {/* 궤적 라인 */}
        {trajectoryNoWind && trajectoryNoWind.length > 0 && (
          <TrajectoryLine
            trajectory={trajectoryNoWind}
            color="#ff4444"
            opacity={0.8}
          />
        )}
        {trajectoryWithWind && trajectoryWithWind.length > 0 && (
          <TrajectoryLine
            trajectory={trajectoryWithWind}
            color="#4444ff"
            opacity={0.8}
          />
        )}

        {/* 애니메이션 공 */}
        {isPlaying && trajectoryNoWind && (
          <AnimatedBall
            trajectory={trajectoryNoWind}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            color="#ff6666"
          />
        )}
        {isPlaying && trajectoryWithWind && (
          <AnimatedBall
            trajectory={trajectoryWithWind}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onComplete={onAnimationComplete}
            color="#6666ff"
          />
        )}

        {/* 거리 표시 */}
        <DistanceMarkers />

        {/* 카메라 컨트롤 */}
        <OrbitControls
          target={[0, 1, 9.22]}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
}

// 거리 마커 컴포넌트
function DistanceMarkers() {
  const RELEASE_POINT = 1.85; // 릴리스 포인트 (투수판에서 앞으로 1.85m)

  return (
    <group>
      {/* 마운드(투수판) 위치 표시 */}
      <Text
        position={[2.5, 0.5, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Rubber (0m)
      </Text>

      {/* 릴리스 포인트 표시 */}
      <Text
        position={[2.5, 2.2, RELEASE_POINT]}
        fontSize={0.25}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        Release (50.5ft)
      </Text>

      {/* 릴리스 포인트 마커 */}
      <mesh position={[0, 2.05, RELEASE_POINT]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#00ff88" />
      </mesh>

      {/* 홈플레이트 위치 표시 */}
      <Text
        position={[2.5, 0.5, 18.44]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Home (60.5ft)
      </Text>

      {/* 실제 비행거리 표시 */}
      <Text
        position={[0, 0.3, 9.5]}
        fontSize={0.2}
        color="#88ccff"
        anchorX="center"
        anchorY="middle"
      >
        Flight: 15.39m (50.5ft)
      </Text>

      {/* 1루/3루 방향 표시 */}
      <Text
        position={[-4, 0.5, 18.44]}
        fontSize={0.3}
        color="#ffaa00"
        anchorX="center"
        anchorY="middle"
      >
        3B
      </Text>
      <Text
        position={[4, 0.5, 18.44]}
        fontSize={0.3}
        color="#ffaa00"
        anchorX="center"
        anchorY="middle"
      >
        1B
      </Text>
    </group>
  );
}

export default Scene3D;
