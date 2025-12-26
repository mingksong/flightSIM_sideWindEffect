import React from 'react';
import { MONTHLY_CONDITIONS } from '../utils/physics';

// 바람 속도별 체감 정보
function getWindFeeling(windSpeed) {
  if (windSpeed <= 2) {
    return {
      level: 0,
      emoji: '🍃',
      name: '고요한 바람',
      description: '바람을 거의 느낄 수 없음. 나뭇잎이 거의 움직이지 않음.',
      color: '#a8e6cf',
      warning: null,
      gameImpact: '경기에 영향 없음'
    };
  } else if (windSpeed <= 4) {
    return {
      level: 1,
      emoji: '🌱',
      name: '가벼운 산들바람',
      description: '얼굴에 바람이 느껴짐. 나뭇잎이 살랑거림.',
      color: '#88d8b0',
      warning: null,
      gameImpact: '경기에 거의 영향 없음'
    };
  } else if (windSpeed <= 6) {
    return {
      level: 2,
      emoji: '🍂',
      name: '부드러운 바람',
      description: '나뭇잎과 작은 가지가 흔들림. 깃발이 가볍게 펄럭임.',
      color: '#78c2a4',
      warning: null,
      gameImpact: '투구에 미미한 영향'
    };
  } else if (windSpeed <= 8) {
    return {
      level: 3,
      emoji: '🌾',
      name: '약간 강한 바람',
      description: '나뭇가지가 흔들림. 먼지나 종이가 날아감.',
      color: '#ffeaa7',
      warning: '투구에 영향을 줄 수 있음',
      gameImpact: '투구 궤적에 눈에 띄는 영향'
    };
  } else if (windSpeed <= 11) {
    return {
      level: 4,
      emoji: '💨',
      name: '센 바람',
      description: '작은 나무가 흔들림. 우산 쓰기가 불편함.',
      color: '#fdcb6e',
      warning: '투구 궤적에 상당한 영향',
      gameImpact: '타구 방향/비거리에 상당한 영향'
    };
  } else if (windSpeed <= 14) {
    return {
      level: 5,
      emoji: '🌬️',
      name: '강한 바람',
      description: '큰 나뭇가지가 흔들림. 걷기 힘들어짐.',
      color: '#f39c12',
      warning: '⚠️ 경기 진행에 영향 (풍랑주의보 수준)',
      gameImpact: '경기 진행 어려움 시작'
    };
  } else if (windSpeed <= 17) {
    return {
      level: 6,
      emoji: '⚠️',
      name: '돌풍',
      description: '나무 전체가 흔들림. 바람을 안고 걷기 매우 힘듦.',
      color: '#e74c3c',
      warning: '🚨 경기 진행 어려움',
      gameImpact: '경기 중단 고려 필요'
    };
  } else if (windSpeed <= 21) {
    return {
      level: 7,
      emoji: '🌪️',
      name: '매우 강한 바람',
      description: '작은 나뭇가지가 부러짐. 걷는 것이 위험할 정도.',
      color: '#c0392b',
      warning: '🚨 경기 중단 권고 (강풍경보 수준)',
      gameImpact: '경기 불가능'
    };
  } else if (windSpeed <= 25) {
    return {
      level: 8,
      emoji: '⛈️',
      name: '폭풍 수준',
      description: '나무가 뿌리째 뽑힐 수 있음. 외출이 매우 위험함.',
      color: '#8e44ad',
      warning: '🚨🚨 경기 불가능',
      gameImpact: '야외 활동 금지'
    };
  } else if (windSpeed <= 32) {
    return {
      level: 9,
      emoji: '🌀',
      name: '강한 폭풍 / 태풍급',
      description: '나무들이 쓰러짐. 건물 구조에 피해 발생.',
      color: '#9b59b6',
      warning: '🚨🚨🚨 즉시 대피 필요',
      gameImpact: '재난 상황'
    };
  } else {
    return {
      level: 10,
      emoji: '🌪️💥',
      name: '격렬한 폭풍 / 강력한 태풍',
      description: '광범위한 파괴. 생명이 위협받는 수준.',
      color: '#2c3e50',
      warning: '🚨🚨🚨 생명 위협 - 실내 대피 필수',
      gameImpact: '재난 상황'
    };
  }
}

// 바람 강도 게이지 바
function WindGauge({ windSpeed }) {
  const maxSpeed = 50;
  const percentage = Math.min((windSpeed / maxSpeed) * 100, 100);
  const feeling = getWindFeeling(windSpeed);

  // 게이지 구간별 색상
  const gradientStops = [
    { pos: 0, color: '#a8e6cf' },
    { pos: 16, color: '#78c2a4' },
    { pos: 22, color: '#ffeaa7' },
    { pos: 28, color: '#fdcb6e' },
    { pos: 34, color: '#e74c3c' },
    { pos: 42, color: '#c0392b' },
    { pos: 64, color: '#8e44ad' },
    { pos: 100, color: '#2c3e50' },
  ];

  return (
    <div className="wind-gauge">
      <div className="gauge-bar">
        <div className="gauge-background" />
        <div
          className="gauge-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: feeling.color
          }}
        />
        <div
          className="gauge-indicator"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="gauge-labels">
        <span>0</span>
        <span className="gauge-mid">14 (주의보)</span>
        <span className="gauge-mid2">21 (경보)</span>
        <span>50 m/s</span>
      </div>
    </div>
  );
}

// 바람 체감 카드
function WindFeelingCard({ windSpeed }) {
  const feeling = getWindFeeling(windSpeed);

  return (
    <div className="wind-feeling-card" style={{ borderColor: feeling.color }}>
      <div className="feeling-header">
        <span className="feeling-emoji">{feeling.emoji}</span>
        <div className="feeling-info">
          <span className="feeling-name" style={{ color: feeling.color }}>{feeling.name}</span>
          <span className="feeling-speed">{windSpeed} m/s ({(windSpeed * 3.6).toFixed(1)} km/h)</span>
        </div>
      </div>
      <p className="feeling-description">{feeling.description}</p>
      <div className="feeling-game-impact">
        <span className="impact-label">야구 경기:</span>
        <span className="impact-value">{feeling.gameImpact}</span>
      </div>
      {feeling.warning && (
        <div className="feeling-warning" style={{
          backgroundColor: feeling.color + '22',
          borderLeft: `3px solid ${feeling.color}`
        }}>
          {feeling.warning}
        </div>
      )}
    </div>
  );
}

function ResultPanel({ result, params }) {
  if (!result) {
    return (
      <div className="result-panel">
        <h2>분석 결과</h2>
        <div className="no-result">
          <p>시뮬레이션을 시작하면</p>
          <p>결과가 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  const { displacement, flightTime, trajectoryNoWind, trajectoryWithWind } = result;
  const conditions = MONTHLY_CONDITIONS[params.month];
  const feeling = getWindFeeling(params.windSpeed);

  // 홈플레이트 도착 위치
  const endNoWind = trajectoryNoWind[trajectoryNoWind.length - 1];
  const endWithWind = trajectoryWithWind[trajectoryWithWind.length - 1];

  return (
    <div className="result-panel">
      <h2>바람 영향 분석 결과</h2>

      {/* 바람 체감 정보 */}
      <div className="result-section wind-feeling-section">
        <h3>바람 체감</h3>
        <WindFeelingCard windSpeed={params.windSpeed} />
        <WindGauge windSpeed={params.windSpeed} />
      </div>

      {/* 바람 조건 */}
      <div className="result-section">
        <h3>바람 조건</h3>
        <div className="result-row">
          <span className="label">방향:</span>
          <span className="value">
            {params.windDirection === '1to3' ? '1루 → 3루' : '3루 → 1루'}
          </span>
        </div>
        <div className="result-row">
          <span className="label">속도:</span>
          <span className="value">{params.windSpeed} m/s ({(params.windSpeed * 3.6).toFixed(1)} km/h)</span>
        </div>
      </div>

      {/* 환경 조건 */}
      <div className="result-section">
        <h3>환경 조건</h3>
        <div className="result-row">
          <span className="label">월:</span>
          <span className="value">{conditions.name}</span>
        </div>
        <div className="result-row">
          <span className="label">기온:</span>
          <span className="value">{conditions.temp}°C</span>
        </div>
        <div className="result-row">
          <span className="label">습도:</span>
          <span className="value">{conditions.humidity}%</span>
        </div>
        <div className="result-row">
          <span className="label">공기밀도:</span>
          <span className="value">{conditions.density.toFixed(3)} kg/m³</span>
        </div>
      </div>

      {/* 투구 파라미터 */}
      <div className="result-section">
        <h3>투구 파라미터</h3>
        <div className="result-row">
          <span className="label">구속:</span>
          <span className="value">{params.velocity} km/h</span>
        </div>
        <div className="result-row">
          <span className="label">회전수:</span>
          <span className="value">{params.spinRate} RPM</span>
        </div>
        <div className="result-row">
          <span className="label">회전축:</span>
          <span className="value">{params.spinAxis}°</span>
        </div>
      </div>

      {/* 비행 정보 */}
      <div className="result-section">
        <h3>비행 정보</h3>
        <div className="result-row">
          <span className="label">실제 비행거리:</span>
          <span className="value">15.39m (50.5ft)</span>
        </div>
        <div className="result-row">
          <span className="label">비행 시간:</span>
          <span className="value highlight">{flightTime.toFixed(3)} 초</span>
        </div>
        <div className="result-row">
          <span className="label">릴리스 높이:</span>
          <span className="value">2.05m (6.7ft)</span>
        </div>
      </div>

      {/* 바람에 의한 변위 */}
      <div className="result-section displacement">
        <h3>바람에 의한 변위</h3>
        <div className="result-row">
          <span className="label">좌우 (X축):</span>
          <span className={`value ${displacement.x > 0 ? 'positive' : displacement.x < 0 ? 'negative' : ''}`}>
            {displacement.x >= 0 ? '+' : ''}{displacement.x.toFixed(1)} cm
          </span>
        </div>
        <div className="result-row">
          <span className="label">전후 (Y축):</span>
          <span className={`value ${displacement.y > 0 ? 'positive' : displacement.y < 0 ? 'negative' : ''}`}>
            {displacement.y >= 0 ? '+' : ''}{displacement.y.toFixed(1)} cm
          </span>
        </div>
        <div className="result-row">
          <span className="label">상하 (Z축):</span>
          <span className={`value ${displacement.z > 0 ? 'positive' : displacement.z < 0 ? 'negative' : ''}`}>
            {displacement.z >= 0 ? '+' : ''}{displacement.z.toFixed(1)} cm
          </span>
        </div>
        <div className="result-row total">
          <span className="label">총 변위:</span>
          <span className="value highlight">{displacement.total.toFixed(1)} cm</span>
        </div>
      </div>

      {/* 도착 위치 비교 */}
      <div className="result-section">
        <h3>홈플레이트 도착 위치</h3>
        <table className="position-table">
          <thead>
            <tr>
              <th></th>
              <th>바람 없음</th>
              <th>바람 적용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>좌우 (X)</td>
              <td>{(endNoWind.x * 100).toFixed(1)} cm</td>
              <td>{(endWithWind.x * 100).toFixed(1)} cm</td>
            </tr>
            <tr>
              <td>높이 (Z)</td>
              <td>{(endNoWind.z * 100).toFixed(1)} cm</td>
              <td>{(endWithWind.z * 100).toFixed(1)} cm</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 분석 코멘트 */}
      <div className="result-section analysis">
        <h3>분석</h3>
        <p className="analysis-text">
          {feeling.emoji}{' '}
          {params.windSpeed >= 10 ? (
            <>
              <strong style={{ color: feeling.color }}>{feeling.name}</strong> 조건에서 공이{' '}
              {params.windDirection === '1to3' ? '3루 방향' : '1루 방향'}으로{' '}
              <strong>{Math.abs(displacement.x).toFixed(1)}cm</strong> 이동했습니다.
              {displacement.total > 10 && ' 이는 스트라이크 존 폭(약 43cm)의 상당 부분에 해당합니다.'}
            </>
          ) : params.windSpeed >= 5 ? (
            <>
              <strong style={{ color: feeling.color }}>{feeling.name}</strong> 조건에서 공이{' '}
              {params.windDirection === '1to3' ? '3루 방향' : '1루 방향'}으로{' '}
              <strong>{Math.abs(displacement.x).toFixed(1)}cm</strong> 이동했습니다.
            </>
          ) : params.windSpeed > 0 ? (
            <>
              <strong style={{ color: feeling.color }}>{feeling.name}</strong> 조건으로 궤적에 미치는 영향이 미미합니다.
              (총 변위: {displacement.total.toFixed(1)}cm)
            </>
          ) : (
            <>
              바람이 없는 조건입니다. 바람 속도를 조절하여 영향을 확인해보세요.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default ResultPanel;
