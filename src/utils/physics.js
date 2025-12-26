/**
 * 야구 투구 물리 엔진
 * 마그누스 효과, 공기저항, 바람 영향을 계산
 */

// 상수 정의
export const CONSTANTS = {
  BALL_MASS: 0.145,           // kg (145g)
  BALL_DIAMETER: 0.073,       // m (7.3cm)
  BALL_RADIUS: 0.0365,        // m
  BALL_AREA: Math.PI * 0.0365 * 0.0365, // 단면적 (m²)
  GRAVITY: 9.81,              // m/s²

  // 거리 관련 상수
  MOUND_DISTANCE: 18.44,      // m (60.5피트) - 투수판 ~ 홈플레이트
  RELEASE_DISTANCE: 15.39,    // m (50.5피트) - 실제 릴리스 포인트 ~ 홈플레이트
  RELEASE_EXTENSION: 1.85,    // m (약 6피트) - 투수판에서 릴리스 포인트까지의 거리
  MOUND_HEIGHT: 0.254,        // m (10인치)

  // 스트라이크존 (지면 기준)
  STRIKE_ZONE_BOTTOM: 0.5,    // m - 무릎 높이
  STRIKE_ZONE_TOP: 1.1,       // m - 가슴 높이
  STRIKE_ZONE_CENTER: 0.8,    // m - 스트라이크존 중앙
  STRIKE_ZONE_WIDTH: 0.43,    // m (17인치) - 홈플레이트 너비

  // 공기역학 계수
  DRAG_COEFFICIENT: 0.35,     // 항력계수 (야구공 기준)
  LIFT_COEFFICIENT_BASE: 0.2, // 기본 양력계수
};

// 한국 월별 환경 조건 (평균값)
export const MONTHLY_CONDITIONS = {
  4: { name: '4월', temp: 12.5, humidity: 55, density: 1.235 },
  5: { name: '5월', temp: 18.0, humidity: 62, density: 1.205 },
  6: { name: '6월', temp: 23.5, humidity: 72, density: 1.175 },
  7: { name: '7월', temp: 26.5, humidity: 80, density: 1.155 },
  8: { name: '8월', temp: 27.0, humidity: 78, density: 1.150 },
  9: { name: '9월', temp: 22.5, humidity: 68, density: 1.180 },
  10: { name: '10월', temp: 15.5, humidity: 58, density: 1.220 },
};

// Baseball Savant 데이터 기반 직구 모델 (135-170km 구속대)
export const FASTBALL_MODEL = {
  // 구속별 평균 회전수 (RPM)
  getAvgSpinRate: (velocity) => {
    // 구속이 높을수록 회전수도 증가하는 경향
    const baseRpm = 2100;
    const velocityFactor = (velocity - 145) * 8;
    return Math.round(baseRpm + velocityFactor);
  },

  // 4심 직구 평균 스핀 축
  avgSpinAxis: 200, // 도 (순수 백스핀은 180도)

  // 구속별 평균 무브먼트 (인치)
  getAvgMovement: (velocity, spinRate) => {
    const spinFactor = spinRate / 2200;
    return {
      pfx_x: -0.7 * spinFactor,  // 좌우 무브먼트 (인치)
      pfx_z: 1.35 * spinFactor,  // 상하 무브먼트 (인치)
    };
  }
};

/**
 * 공기 밀도 계산 (온도, 습도 기반)
 * @param {number} temperature - 섭씨 온도
 * @param {number} humidity - 상대 습도 (%)
 * @returns {number} 공기 밀도 (kg/m³)
 */
export function calculateAirDensity(temperature, humidity) {
  const T = temperature + 273.15; // 켈빈 온도
  const P = 101325; // 대기압 (Pa)
  const Rv = 461.5; // 수증기 기체 상수
  const Rd = 287.05; // 건조공기 기체 상수

  // 포화수증기압 계산 (Magnus 공식)
  const es = 611.2 * Math.exp((17.67 * temperature) / (temperature + 243.5));
  const e = (humidity / 100) * es;

  // 공기 밀도
  const density = (P - e) / (Rd * T) + e / (Rv * T);
  return density;
}

/**
 * 마그누스 힘 계산
 * @param {number} velocity - 공의 속도 (m/s)
 * @param {number} spinRate - 회전수 (RPM)
 * @param {number} spinAxis - 회전축 (도, 0-360)
 * @param {number} airDensity - 공기 밀도 (kg/m³)
 * @returns {Object} x, y, z 방향 마그누스 힘 (N)
 */
export function calculateMagnusForce(velocity, spinRate, spinAxis, airDensity) {
  const { BALL_RADIUS, BALL_AREA, LIFT_COEFFICIENT_BASE } = CONSTANTS;

  // 회전 속도를 rad/s로 변환
  const omega = (spinRate * 2 * Math.PI) / 60;

  // 스핀 파라미터 (무차원)
  const spinParameter = (omega * BALL_RADIUS) / velocity;

  // 양력 계수 (스핀 파라미터에 비례)
  const Cl = LIFT_COEFFICIENT_BASE * spinParameter * 10;

  // 마그누스 힘의 크기
  const magnusMagnitude = 0.5 * airDensity * velocity * velocity * Cl * BALL_AREA;

  // 스핀 축을 라디안으로 변환
  const axisRad = (spinAxis * Math.PI) / 180;

  // 180도 = 순수 백스핀 (위쪽 힘)
  // 90도 = 사이드스핀 (옆쪽 힘)
  // 회전축에 따른 힘의 방향 분해
  const forceZ = magnusMagnitude * Math.cos(axisRad - Math.PI); // 상하
  const forceX = magnusMagnitude * Math.sin(axisRad - Math.PI); // 좌우

  return {
    x: forceX,
    y: 0,
    z: forceZ
  };
}

/**
 * 항력(공기저항) 계산
 * @param {Object} velocity - 속도 벡터 {x, y, z} (m/s)
 * @param {number} airDensity - 공기 밀도 (kg/m³)
 * @returns {Object} x, y, z 방향 항력 (N)
 */
export function calculateDragForce(velocity, airDensity) {
  const { DRAG_COEFFICIENT, BALL_AREA } = CONSTANTS;

  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

  if (speed === 0) return { x: 0, y: 0, z: 0 };

  // 항력의 크기
  const dragMagnitude = 0.5 * airDensity * speed * speed * DRAG_COEFFICIENT * BALL_AREA;

  // 속도의 반대 방향
  return {
    x: -dragMagnitude * (velocity.x / speed),
    y: -dragMagnitude * (velocity.y / speed),
    z: -dragMagnitude * (velocity.z / speed)
  };
}

/**
 * 바람에 의한 힘 계산
 * @param {number} windSpeed - 바람 속도 (m/s)
 * @param {string} windDirection - 바람 방향 ('1to3' 또는 '3to1')
 * @param {Object} ballVelocity - 공의 속도 벡터 (m/s)
 * @param {number} airDensity - 공기 밀도 (kg/m³)
 * @returns {Object} x, y, z 방향 바람에 의한 힘 (N)
 */
export function calculateWindForce(windSpeed, windDirection, ballVelocity, airDensity) {
  const { DRAG_COEFFICIENT, BALL_AREA } = CONSTANTS;

  // 바람 속도 벡터 (측풍이므로 x 방향)
  // 1to3: 1루 → 3루 (우타자에서 좌타자 방향) = -x
  // 3to1: 3루 → 1루 (좌타자에서 우타자 방향) = +x
  const windVelocity = {
    x: windDirection === '1to3' ? -windSpeed : windSpeed,
    y: 0,
    z: 0
  };

  // 공에 대한 상대 바람 속도
  const relativeWind = {
    x: windVelocity.x - ballVelocity.x,
    y: windVelocity.y - ballVelocity.y,
    z: windVelocity.z - ballVelocity.z
  };

  const relativeSpeed = Math.sqrt(
    relativeWind.x ** 2 + relativeWind.y ** 2 + relativeWind.z ** 2
  );

  if (relativeSpeed === 0) return { x: 0, y: 0, z: 0 };

  // 바람에 의한 추가 항력
  const windForceMagnitude = 0.5 * airDensity * relativeSpeed * windSpeed * DRAG_COEFFICIENT * BALL_AREA;

  return {
    x: windDirection === '1to3' ? -windForceMagnitude : windForceMagnitude,
    y: 0,
    z: 0
  };
}

/**
 * 투구 궤적 시뮬레이션
 * @param {Object} params - 투구 파라미터
 * @returns {Array} 궤적 포인트 배열
 */
export function simulatePitch(params) {
  const {
    velocity,      // km/h
    spinRate,      // RPM
    spinAxis,      // 도
    windSpeed = 0, // m/s
    windDirection = '1to3',
    month = 7,     // 월
  } = params;

  const conditions = MONTHLY_CONDITIONS[month];
  const airDensity = conditions.density;

  // 속도를 m/s로 변환
  const velocityMs = velocity / 3.6;

  // 스트라이크존 중앙 높이 (무릎~가슴의 중앙)
  const STRIKE_ZONE_CENTER = 0.8; // m (약 80cm, 지면에서)

  // 초기 위치 (실제 릴리스 포인트)
  // 투수판(0m)에서 약 1.85m 앞쪽에서 공을 놓음
  const releaseHeight = CONSTANTS.MOUND_HEIGHT + 1.8; // 약 2.05m
  let position = {
    x: 0,
    y: CONSTANTS.RELEASE_EXTENSION,  // 릴리스 포인트 (투수판 기준 약 1.85m 앞)
    z: releaseHeight
  };

  // 스트라이크존 중앙을 목표로 하는 릴리스 각도 계산
  // 비행거리: 18.44m - 1.85m = 16.59m (홈플레이트까지)
  // 높이 차이: 릴리스 높이(2.05m) - 스트라이크존 중앙(0.8m) = 1.25m
  const flightDistance = CONSTANTS.MOUND_DISTANCE - CONSTANTS.RELEASE_EXTENSION;
  const heightDrop = releaseHeight - STRIKE_ZONE_CENTER;

  // 단순 직선 각도 (중력과 마그누스 효과는 시뮬레이션에서 처리)
  // 약간 높게 던져서 중력으로 떨어지면서 스트라이크존에 도달하도록
  const releaseAngle = Math.atan2(-heightDrop * 0.6, flightDistance); // 보정 계수 적용

  let vel = {
    x: 0,
    y: velocityMs * Math.cos(releaseAngle),
    z: velocityMs * Math.sin(releaseAngle)
  };

  const trajectory = [];
  const dt = 0.001; // 시간 간격 (1ms)
  let time = 0;

  // 홈플레이트(18.44m)까지 시뮬레이션
  while (position.y < CONSTANTS.MOUND_DISTANCE && time < 2) {
    trajectory.push({
      x: position.x,
      y: position.y,
      z: position.z,
      time: time
    });

    const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);

    // 각 힘 계산
    const magnusForce = calculateMagnusForce(speed, spinRate, spinAxis, airDensity);
    const dragForce = calculateDragForce(vel, airDensity);
    const windForce = calculateWindForce(windSpeed, windDirection, vel, airDensity);

    // 총 가속도 계산
    const acceleration = {
      x: (magnusForce.x + dragForce.x + windForce.x) / CONSTANTS.BALL_MASS,
      y: (magnusForce.y + dragForce.y + windForce.y) / CONSTANTS.BALL_MASS,
      z: (magnusForce.z + dragForce.z + windForce.z) / CONSTANTS.BALL_MASS - CONSTANTS.GRAVITY
    };

    // 속도 업데이트
    vel.x += acceleration.x * dt;
    vel.y += acceleration.y * dt;
    vel.z += acceleration.z * dt;

    // 위치 업데이트
    position.x += vel.x * dt;
    position.y += vel.y * dt;
    position.z += vel.z * dt;

    time += dt;
  }

  // 홈플레이트 도달 시점 보간
  if (trajectory.length > 0) {
    const lastPoint = trajectory[trajectory.length - 1];
    trajectory.push({
      x: position.x,
      y: CONSTANTS.MOUND_DISTANCE,
      z: position.z,
      time: time
    });
  }

  return trajectory;
}

/**
 * 두 궤적 간의 변위 계산
 * @param {Array} trajectoryA - 바람 없는 궤적
 * @param {Array} trajectoryB - 바람 있는 궤적
 * @returns {Object} 변위 정보
 */
export function calculateDisplacement(trajectoryA, trajectoryB) {
  if (!trajectoryA.length || !trajectoryB.length) {
    return { x: 0, y: 0, z: 0, total: 0 };
  }

  const endA = trajectoryA[trajectoryA.length - 1];
  const endB = trajectoryB[trajectoryB.length - 1];

  const dx = (endB.x - endA.x) * 100; // cm로 변환
  const dy = (endB.y - endA.y) * 100;
  const dz = (endB.z - endA.z) * 100;
  const total = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

  return {
    x: dx,
    y: dy,
    z: dz,
    total: total
  };
}

/**
 * 비행 시간 계산
 * @param {Array} trajectory - 궤적 배열
 * @returns {number} 비행 시간 (초)
 */
export function getFlightTime(trajectory) {
  if (!trajectory.length) return 0;
  return trajectory[trajectory.length - 1].time;
}
