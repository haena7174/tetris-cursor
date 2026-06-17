# 테트리스 (교육용)

HTML, CSS, JavaScript만 사용하는 브라우저 테트리스 게임입니다.  
빌드 도구와 외부 라이브러리 없이 동작하며, 프론트엔드 입문 학습용으로 제작되었습니다.

**라이브 데모:** https://haena7174.github.io/tetris-cursor/

## 실행 방법

### 로컬에서 실행

1. 이 저장소를 클론하거나 폴더를 연다.
2. `index.html`을 브라우저에서 연다 (더블클릭 또는 드래그).
3. 게임 보드, 점수, 버튼, 조작법이 표시되면 정상입니다.

### VS Code / Cursor에서 실행

1. `index.html`을 연다.
2. Live Server 확장이 있으면 **Open with Live Server**로 실행하거나,
3. 파일 탐색기에서 브라우저로 연다.

> 별도의 설치·빌드 과정이 필요 없습니다.

## 조작법

| 키 | 동작 |
|----|------|
| `ArrowLeft` (←) | 왼쪽 이동 |
| `ArrowRight` (→) | 오른쪽 이동 |
| `ArrowDown` (↓) | 한 칸 빠르게 내리기 (soft drop) |
| `ArrowUp` (↑) | 블록 회전 |
| `Space` | 즉시 바닥까지 낙하 (hard drop) |

- 모든 조작은 충돌 판정(`canMove`)을 통과할 때만 적용됩니다.
- 회전 후 벽이나 고정 블록과 충돌하면 회전은 취소됩니다.
- **시작** / **재시작** 버튼으로 게임을 초기화할 수 있습니다.

## 구현 기능

| 기능 | 설명 |
|------|------|
| 게임 보드 | 10열 × 20행 CSS Grid |
| 테트로미노 | I, O, T, S, Z, J, L 7종 |
| 자동 낙하 | 0.8초마다 1칸 하강 |
| 충돌 판정 | 벽, 바닥, 고정 블록 |
| 블록 고정 | 착지 시 보드에 기록 후 새 블록 스폰 |
| 라인 클리어 | 가로 한 줄이 가득 차면 삭제 |
| 점수 | 삭제 줄 수에 따라 증가 (아래 표 참고) |
| 게임 오버 | 새 블록을 스폰할 수 없을 때 종료 |
| 키보드 조작 | 이동, 회전, soft/hard drop |

### 점수 규칙

| 한 번에 삭제한 줄 | 점수 |
|-------------------|------|
| 1줄 | 100 |
| 2줄 | 300 |
| 3줄 | 500 |
| 4줄 | 800 |

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 게임 화면 구조 |
| `style.css` | 레이아웃·보드·블록 색상 |
| `script.js` | 게임 로직 전체 |
| `.cursor/commands/` | Cursor 슬래시 명령 (개발용, 배포 불필요) |

## 품질 점검 방법

### 수동 플레이 테스트

1. 브라우저에서 게임을 연다.
2. 자동 낙하, 좌우 이동, 회전, soft drop, hard drop을 확인한다.
3. 한 줄을 가득 채워 삭제·점수 증가를 확인한다.
4. 보드를 가득 채워 게임 오버 메시지를 확인한다.
5. **재시작** 후 보드·점수·낙하가 초기화되는지 확인한다.
6. 개발자 도구(F12) → Console에 에러가 없는지 확인한다.

### Cursor 슬래시 명령 (선택)

프로젝트에 포함된 QA·리뷰 명령을 활용할 수 있습니다.

| 명령 | 용도 |
|------|------|
| `/qa-playtest` | 기능별 테스트 시나리오 점검 |
| `/bug-hunt` | 잠재 버그 탐색 |
| `/code-review` | 코드 리뷰 |
| `/review-game-logic` | 게임 로직 집중 리뷰 |
| `/release-check` | 배포 전 최종 점검 |

## GitHub Pages 배포 방법

### 1. 변경 사항 push

```bash
git add index.html style.css script.js README.md .gitignore
git commit -m "docs: README 보완 및 GitHub Pages 배포 준비"
git push origin main
```

`.cursor/commands/`는 개발 편의용이므로 필요 시에만 커밋합니다.

### 2. GitHub Pages 설정

1. https://github.com/haena7174/tetris-cursor 저장소를 연다.
2. **Settings** → **Pages**로 이동한다.
3. **Build and deployment** → **Source**에서 **Deploy from a branch**를 선택한다.
4. **Branch**를 `main`, 폴더를 `/ (root)`로 설정하고 **Save**한다.
5. 1~2분 후 배포 URL이 표시된다.

### 3. 배포 확인

- 접속 URL: **https://haena7174.github.io/tetris-cursor/**
- 게임이 로드되고, 조작·점수·게임 오버가 정상 동작하는지 확인한다.
- 콘솔에 에러가 없는지 확인한다.

## 다음 단계 (학습용)

- 다음 블록 미리보기
- 낙하 속도 증가 (레벨 시스템)
- 모바일 터치 조작
