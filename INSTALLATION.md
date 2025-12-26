# Installation Guide

이 문서는 Baseball Pitch Trajectory Simulator를 로컬 환경에서 실행하기 위한 설치 가이드입니다.

---

## Prerequisites (사전 요구사항)

### Node.js 설치

이 프로젝트는 Node.js 18.x 이상이 필요합니다.

#### Windows

1. **Node.js 다운로드**
   - https://nodejs.org/ 접속
   - **LTS 버전** (권장) 다운로드
   - 예: `node-v20.x.x-x64.msi`

2. **설치 실행**
   - 다운로드한 `.msi` 파일 실행
   - 설치 마법사 따라 진행 (기본 옵션 유지)
   - "Add to PATH" 옵션 체크 확인

3. **설치 확인**
   ```cmd
   node --version
   npm --version
   ```

#### macOS

**방법 1: 공식 설치 파일**
1. https://nodejs.org/ 접속
2. **LTS 버전** `.pkg` 파일 다운로드
3. 설치 파일 실행

**방법 2: Homebrew 사용 (권장)**
```bash
# Homebrew 설치 (미설치 시)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node
```

**방법 3: nvm 사용**
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 후
nvm install --lts
nvm use --lts
```

설치 확인:
```bash
node --version
npm --version
```

---

## Project Installation (프로젝트 설치)

### Windows

1. **Git 설치** (미설치 시)
   - https://git-scm.com/download/win 에서 다운로드
   - 설치 진행

2. **프로젝트 클론**
   - 명령 프롬프트(cmd) 또는 PowerShell 실행
   ```cmd
   cd C:\Users\YourName\Projects
   git clone https://github.com/mingksong/flightSIM_sideWindEffect.git
   cd flightSIM_sideWindEffect
   ```

3. **의존성 설치**
   ```cmd
   npm install
   ```

4. **개발 서버 실행**
   ```cmd
   npm run dev
   ```

5. **브라우저 접속**
   - 자동으로 브라우저가 열립니다
   - 또는 수동으로 접속: http://localhost:15000

### macOS

1. **Git 설치** (미설치 시)
   ```bash
   # Xcode Command Line Tools 설치
   xcode-select --install

   # 또는 Homebrew로 설치
   brew install git
   ```

2. **프로젝트 클론**
   ```bash
   cd ~/Projects  # 또는 원하는 디렉토리
   git clone https://github.com/mingksong/flightSIM_sideWindEffect.git
   cd flightSIM_sideWindEffect
   ```

3. **의존성 설치**
   ```bash
   npm install
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저 접속**
   - 자동으로 브라우저가 열립니다
   - 또는 수동으로 접속: http://localhost:15000

---

## Build for Production (프로덕션 빌드)

### Windows / macOS 공통

```bash
# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

---

## Troubleshooting (문제 해결)

### 1. `npm install` 실패

**증상**: 패키지 설치 중 에러 발생

**해결방법**:
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. 포트 충돌

**증상**: "Port 15000 is already in use"

**해결방법**:

Windows:
```cmd
netstat -ano | findstr :15000
taskkill /PID <PID번호> /F
```

macOS:
```bash
lsof -i :15000
kill -9 <PID>
```

또는 `vite.config.js`에서 포트 변경:
```javascript
server: {
  port: 15001,  // 다른 포트로 변경
  open: true
}
```

### 3. Node.js 버전 오류

**증상**: "engine" 관련 에러 또는 ES 모듈 에러

**해결방법**:
```bash
# Node.js 버전 확인
node --version

# v18 이상이 아니면 업그레이드
# Windows: 공식 사이트에서 재설치
# macOS:
nvm install 20
nvm use 20
```

### 4. 3D 렌더링 문제

**증상**: 검은 화면 또는 WebGL 에러

**해결방법**:
- 브라우저 업데이트 (Chrome/Firefox 최신 버전 권장)
- 하드웨어 가속 활성화 확인
- 그래픽 드라이버 업데이트

---

## Quick Start Summary

```bash
# 1. 프로젝트 클론
git clone https://github.com/mingksong/flightSIM_sideWindEffect.git
cd flightSIM_sideWindEffect

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 http://localhost:15000 접속
```

---

## Contact

문제가 해결되지 않으면 GitHub Issues에 문의해주세요:
https://github.com/mingksong/flightSIM_sideWindEffect/issues
