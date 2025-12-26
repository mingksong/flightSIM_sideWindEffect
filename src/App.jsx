import React, { useState, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import ResultPanel from './components/ResultPanel';
import {
  simulatePitch,
  calculateDisplacement,
  getFlightTime,
  FASTBALL_MODEL
} from './utils/physics';

const DEFAULT_PARAMS = {
  velocity: 145,
  spinRate: FASTBALL_MODEL.getAvgSpinRate(145),
  spinAxis: 200,
  windSpeed: 5,
  windDirection: '1to3',
  month: 7,
  playbackSpeed: 0.5
};

function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [trajectoryNoWind, setTrajectoryNoWind] = useState(null);
  const [trajectoryWithWind, setTrajectoryWithWind] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 시뮬레이션 시작
  const handleStart = useCallback(() => {
    // 바람 없는 궤적 계산
    const trajNoWind = simulatePitch({
      velocity: params.velocity,
      spinRate: params.spinRate,
      spinAxis: params.spinAxis,
      windSpeed: 0,
      windDirection: params.windDirection,
      month: params.month
    });

    // 바람 있는 궤적 계산
    const trajWithWind = simulatePitch({
      velocity: params.velocity,
      spinRate: params.spinRate,
      spinAxis: params.spinAxis,
      windSpeed: params.windSpeed,
      windDirection: params.windDirection,
      month: params.month
    });

    // 변위 계산
    const displacement = calculateDisplacement(trajNoWind, trajWithWind);
    const flightTime = getFlightTime(trajWithWind);

    setTrajectoryNoWind(trajNoWind);
    setTrajectoryWithWind(trajWithWind);
    setResult({
      displacement,
      flightTime,
      trajectoryNoWind: trajNoWind,
      trajectoryWithWind: trajWithWind
    });
    setIsPlaying(true);
  }, [params]);

  // 다시보기
  const handleReplay = useCallback(() => {
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  }, []);

  // 리셋
  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setTrajectoryNoWind(null);
    setTrajectoryWithWind(null);
    setResult(null);
    setIsPlaying(false);
  }, []);

  // 애니메이션 완료
  const handleAnimationComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <div className="app">
      <ControlPanel
        params={params}
        setParams={setParams}
        onStart={handleStart}
        onReset={handleReset}
        onReplay={handleReplay}
        isPlaying={isPlaying}
        hasResult={!!result}
      />

      <div className="scene-container">
        <div className="title-bar">
          <h1>야구 투구 궤적 시뮬레이터</h1>
          <p>바람 영향 분석</p>
        </div>

        <Scene3D
          trajectoryNoWind={trajectoryNoWind}
          trajectoryWithWind={trajectoryWithWind}
          isPlaying={isPlaying}
          playbackSpeed={params.playbackSpeed}
          onAnimationComplete={handleAnimationComplete}
        />

        <div className="camera-hint">
          마우스 드래그로 시점 회전 | 스크롤로 확대/축소
        </div>
      </div>

      <ResultPanel
        result={result}
        params={params}
      />
    </div>
  );
}

export default App;
