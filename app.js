const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const db = require('./models');     // 최소 개발 기준(DB 사용)
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const passportConfig = require('./passport');       // 최소 개발 기준(로그인 및 인증 관리 파일 가져옴)

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use('/img', express.static(path.join(__dirname, 'uploads')));   // 최소 개발 기준( '/img' 경로로 들어오는 요청에 대해 'uploads' 디렉토리에서 파일을 제공하기 위한 정적 파일 서버를 설정)
app.use(express.json());    // 최소 개발 기준(자동으로 JSON 데이터를 파싱하고 req.body에서 사용할 수 함)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));   // 최소 개발 기준(클라이언트가 쿠키를 포함한 요청을 보낼 때, 이 미들웨어는 쿠키를 파싱하고 req.cookies 객체에서 사용할 수 있게 함)
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.toLocaleString.message = err.statusMessage;
    res.toLocaleString.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중`);
});