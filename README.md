# Football Community - Full-stack Web Service

> **Note:** This project was developed as a term project for the **'Web Application Programming'** course during my **Freshman 2nd Semester (2023)**. 
> (본 프로젝트는 1학년 2학기 '웹응용프로그래밍' 과목의 텀 프로젝트로 제작되었습니다. 당시 학습한 백엔드 기초 역량을 기록하기 위한 아카이브입니다.)

## 📺 시연 영상 (Demo Video)
[![Community Demo](https://img.youtube.com/vi/Ng9taqQ3Phw/0.jpg)](https://youtu.be/Ng9taqQ3Phw)

## 📌 개요 (Overview)
- **과목명:** 웹응용프로그래밍 (Web Application Programming)
- **개발 기간:** 2023.11 - 2023.12
- **주요 내용:** Node.js 기반의 웹 커뮤니티 서비스, 회원가입/로그인 및 게시글/댓글 CRUD 기능을 포함한 풀스택 웹 애플리케이션

## 🛠 기술 스택 (Tech Stack)
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Template Engine:** Nunjucks (Server-side Rendering)
- **Authentication:** Passport.js (Local Strategy), Bcrypt (Password Hashing)
- **Middleware:** Morgan, Cookie-parser, Express-session, Multer (File Upload)

## 🏗 프로젝트 구조 (Structure)
이 프로젝트는 유지보수와 역할 분리를 위해 **MVC(Model-View-Controller) 패턴**을 지향하여 설계되었습니다.

```text
/pnu-football-community-web
  ├── config/
  │    └── config.json (Database connection info)
  ├── controllers/
  │    ├── auth.js (Authentication business logic)
  │    ├── page.js (Page rendering logic)
  │    └── post.js (Post & Comment CRUD logic)
  ├── middlewares/
  │    └── index.js (Auth guards: isLoggedIn, isNotLoggedIn)
  ├── models/
  │    └── index.js (MySQL2 pool connection)
  ├── passport/
  │    ├── index.js (Passport serialize/deserialize)
  │    └── localStrategy.js (Local login logic)
  ├── routes/
  │    ├── auth.js (Auth related routes)
  │    ├── page.js (Page rendering routes)
  │    └── post.js (Post handling routes)
  ├── views/
  │    └── (Nunjucks HTML templates)
  ├── app.js (Server entry point & Middleware config)
  └── README.md
```

## 🚀 실행 방법 (How to Run)

### 1. Prerequisites (사전 준비)
- **MySQL** 서버가 로컬에서 실행 중이어야 합니다.
- **Node.js** 환경이 설치되어 있어야 합니다.

### 2. Database Setup
아래의 **Database Schema** 섹션에 있는 SQL을 사용하여 MySQL에 데이터베이스(football_cafe)와 테이블을 생성하세요.

### 3. Environment Setup
- 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 입력하세요.
  ```env
  COOKIE_SECRET=your_secret_key_here
  PORT=8080
  ```
- config/config.json 파일에 본인의 MySQL 접속 정보(host, user, password, database)를 입력하세요.

### 4. Installation & Execution
  ```bash
  # 1. 의존성 모듈 설치 (express, passport, mysql2, nunjucks 등)
  npm install
  
  # 2. 서버 실행 (nodemon을 통해 app.js 구동)
  npm start
  ```

## 🔑 핵심 기능 (Key Features)
- **사용자 인증 (Authentication)**: Passport.js를 이용한 세션 기반 인증을 구현하였습니다. 회원가입 시 Bcrypt로 비밀번호를 단방향 해싱하여 보안성을 높였습니다.
- **미들웨어 기반 권한 제어**: isLoggedIn과 isNotLoggedIn 커스텀 미들웨어를 사용하여 로그인 여부에 따른 라우터 접근 권한을 관리합니다.
- **게시글 CRUD & 이미지 업로드**: Multer 라이브러리를 통해 uploads/ 폴더에 정적 파일을 저장하고, 게시글 작성 시 이미지 경로를 DB에 연동합니다.
- **댓글 시스템**: 게시글 상세 보기에서 해당 게시물과 연결된 댓글을 조회하고 작성/삭제할 수 있는 기능을 구현하였습니다.

## 🗄 Database Schema (SQL)
```SQL
-- 유저 테이블
CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER NOT NULL auto_increment,
  `email` VARCHAR(40) UNIQUE,
  `nick` VARCHAR(15) NOT NULL,
  `password` VARCHAR(100),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INTEGER NOT NULL auto_increment,
  `subject` VARCHAR(100) NOT NULL,
  `content` VARCHAR(140) NOT NULL,
  `img` VARCHAR(200),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS `comments` (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  comment VARCHAR(100) NOT NULL,
  userId INTEGER,
  postId INTEGER,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

## ✍️ 소감 (Self-Reflection)
백엔드 개발의 전반적인 흐름을 처음으로 이해하게 된 프로젝트입니다.
- **Learning**: 클라이언트의 요청이 라우터와 컨트롤러를 거쳐 DB에 반영되는 과정을 직접 구현하며 서버 사이드 렌더링의 원리를 익혔습니다.
- **Future Growth**: 당시에는 config.json에 DB 정보를 직접 관리했으나, 이후 프로젝트에서는 환경 변수(.env) 관리의 중요성을 깨닫고 보안적인 측면을 보강하게 되었습니다.
