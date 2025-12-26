import React from 'react';
import { MONTHLY_CONDITIONS, FASTBALL_MODEL } from '../utils/physics';

function ControlPanel({
  params,
  setParams,
  onStart,
  onReset,
  onReplay,
  isPlaying,
  hasResult
}) {
  const handleVelocityChange = (value) => {
    const velocity = Number(value);
    const avgSpinRate = FASTBALL_MODEL.getAvgSpinRate(velocity);
    setParams(prev => ({
      ...prev,
      velocity,
      spinRate: avgSpinRate
    }));
  };

  return (
    <div className="control-panel">
      <h2>투구 파라미터</h2>

      {/* 구속 */}
      <div className="control-group">
        <label>
          구속: <span className="value">{params.velocity} km/h</span>
        </label>
        <input
          type="range"
          min="120"
          max="170"
          value={params.velocity}
          onChange={(e) => handleVelocityChange(e.target.value)}
          className="slider"
        />
        <div className="range-labels">
          <span>120</span>
          <span>145</span>
          <span>170</span>
        </div>
      </div>

      {/* 회전수 */}
      <div className="control-group">
        <label>
          회전수: <span className="value">{params.spinRate} RPM</span>
        </label>
        <input
          type="range"
          min="1500"
          max="3000"
          step="10"
          value={params.spinRate}
          onChange={(e) => setParams(prev => ({ ...prev, spinRate: Number(e.target.value) }))}
          className="slider"
        />
        <div className="range-labels">
          <span>1500</span>
          <span>2250</span>
          <span>3000</span>
        </div>
      </div>

      {/* 회전축 */}
      <div className="control-group">
        <label>
          회전축: <span className="value">{params.spinAxis}°</span>
          <span className="hint">
            {params.spinAxis === 180 ? ' (순수 백스핀)' :
              params.spinAxis < 180 ? ' (슬라이더 성향)' : ' (커터 성향)'}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={params.spinAxis}
          onChange={(e) => setParams(prev => ({ ...prev, spinAxis: Number(e.target.value) }))}
          className="slider"
        />
        <div className="range-labels">
          <span>0°</span>
          <span>180° (백스핀)</span>
          <span>360°</span>
        </div>
      </div>

      <h2>바람 설정</h2>

      {/* 바람 속도 */}
      <div className="control-group">
        <label>
          바람 속도: <span className="value">{params.windSpeed} m/s</span>
          <span className="hint">
            ({(params.windSpeed * 3.6).toFixed(1)} km/h)
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="0.5"
          value={params.windSpeed}
          onChange={(e) => setParams(prev => ({ ...prev, windSpeed: Number(e.target.value) }))}
          className="slider"
        />
        <div className="range-labels">
          <span>0</span>
          <span>25</span>
          <span>50</span>
        </div>
      </div>

      {/* 바람 방향 */}
      <div className="control-group">
        <label>바람 방향</label>
        <div className="radio-group">
          <label className={`radio-label ${params.windDirection === '1to3' ? 'active' : ''}`}>
            <input
              type="radio"
              name="windDirection"
              value="1to3"
              checked={params.windDirection === '1to3'}
              onChange={(e) => setParams(prev => ({ ...prev, windDirection: e.target.value }))}
            />
            <span className="radio-text">1루 → 3루</span>
            <span className="radio-hint">(우→좌)</span>
          </label>
          <label className={`radio-label ${params.windDirection === '3to1' ? 'active' : ''}`}>
            <input
              type="radio"
              name="windDirection"
              value="3to1"
              checked={params.windDirection === '3to1'}
              onChange={(e) => setParams(prev => ({ ...prev, windDirection: e.target.value }))}
            />
            <span className="radio-text">3루 → 1루</span>
            <span className="radio-hint">(좌→우)</span>
          </label>
        </div>
      </div>

      <h2>환경 조건</h2>

      {/* 월별 선택 */}
      <div className="control-group">
        <label>월 선택</label>
        <select
          value={params.month}
          onChange={(e) => setParams(prev => ({ ...prev, month: Number(e.target.value) }))}
          className="select"
        >
          {Object.entries(MONTHLY_CONDITIONS).map(([month, data]) => (
            <option key={month} value={month}>
              {data.name} (기온: {data.temp}°C, 습도: {data.humidity}%)
            </option>
          ))}
        </select>
        <div className="condition-info">
          <span>공기 밀도: {MONTHLY_CONDITIONS[params.month].density.toFixed(3)} kg/m³</span>
        </div>
      </div>

      {/* 재생 속도 */}
      <div className="control-group">
        <label>
          재생 속도: <span className="value">{params.playbackSpeed}x</span>
        </label>
        <div className="speed-buttons">
          {[0.25, 0.5, 1, 2].map(speed => (
            <button
              key={speed}
              className={`speed-btn ${params.playbackSpeed === speed ? 'active' : ''}`}
              onClick={() => setParams(prev => ({ ...prev, playbackSpeed: speed }))}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={onStart}
          disabled={isPlaying}
        >
          시작
        </button>
        <button
          className="btn btn-secondary"
          onClick={onReplay}
          disabled={isPlaying || !hasResult}
        >
          다시보기
        </button>
        <button
          className="btn btn-danger"
          onClick={onReset}
        >
          리셋
        </button>
      </div>

      {/* 범례 */}
      <div className="legend">
        <h3>궤적 범례</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff4444' }}></span>
          <span>바람 없음</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4444ff' }}></span>
          <span>바람 적용</span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
