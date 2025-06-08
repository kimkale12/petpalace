# 🐾 PetPlace Project

> **반려동물을 위한 호텔 예약 및 결제 시스템**  
> 개발 기간: 2025년 6월 10일 ~ 2025년 6월 24일 (2주간)  
> **개발 인원: 1명 (개인 프로젝트)**

---

## 🧾 프로젝트 개요

**PetPlace**는 반려동물을 위한 호텔 예약 서비스를 제공하는 웹 애플리케이션입니다.  
사용자는 원하는 객실을 선택하여 예약하고, 결제까지 진행할 수 있으며 관리자는 예약 현황과 매출을 실시간으로 관리할 수 있습니다.

---

## 📁 폴더 구조

```
petplace-project/
├── back-end/               # Node.js 기반 Express 서버
│   ├── controllers/        # 요청 처리 로직
│   ├── routes/             # API 라우터
│   ├── models/             # Sequelize 모델 정의
│   ├── dao/                # DB 접근 모듈
│   ├── service/            # 비즈니스 로직
│   ├── config/             # 환경설정 및 DB 연결
│   ├── lib/                # 유틸리티 (로깅 등)
│   └── app.js              # 서버 실행 진입점
│
├── front-end/              # Vue.js 기반 클라이언트
│   ├── src/                # 주요 컴포넌트 및 뷰
│   ├── public/             # 정적 자원
│   ├── index.html          # 진입 HTML
│   └── vite.config.js      # Vite 설정
```

---

## 🛠️ 사용 기술

- **Frontend**: Vue 3, Vite, SCSS, Pinia
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **결제 연동**: Toss Payments API
- **인증**: JWT 기반 인증

---

## 🚀 주요 기능

- 회원가입 / 로그인
- 객실 예약 및 날짜 선택
- 실시간 결제 (Toss API)
- 관리자용 예약 현황 확인
- 예약 완료/결제 완료 UI 제공

---

## 📦 실행 방법

### 백엔드

```bash
cd back-end
npm install
npm run dev
```

`.env` 예시:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petplace
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret
```

### 프론트엔드

```bash
cd front-end
npm install
npm run dev
```

---

## 👨‍💻 개발자

| 이름   | 역할              | GitHub |
|--------|-------------------|--------|
| 김기욱 | 전체 개발 (Fullstack) | [kimkale12](https://github.com/kimkale12) |
