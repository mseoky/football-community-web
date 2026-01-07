const passport = require('passport');
const local = require('./localStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
    // 사용자 객체를 세션에 저장 시 호출, 사용자의 id를 세션에 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 세션에서 사용자를 복원 시 호출, 세션에 저장된 사용자 id를 받아 해당 사용자 정보를 데이터베이스에서 조회하여 복원
    passport.deserializeUser(async (id, done) => {
        try {
            // 데이터베이스에서 사용자 정보 조회
            const [rows] = await db.execute('SELECT id, nick FROM users WHERE id=?', [id]);

            // 조회된 정보가 있으면 해당 사용자 객체를 구성하여 done 콜백에 전달
            if (rows.length > 0) {
                const user = rows[0];
                done(null, user);
            } else {
                // 조회된 정보가 없으면 done 콜백에 null 전달
                done(null);
            }
        } catch (err) {
            // 조회 중 에러가 발생하면 콘솔에 에러를 출력하고 done 콜백에 에러를 전달
            console.error(err);
            done(err);
        }
    });

    // localStrategy 모듈 실행
    local();
};
