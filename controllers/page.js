const db = require(process.cwd() + '/models');

// 회원가입 페이지
exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - FootballCafe' });
};

// 게시글 작성 페이지
exports.renderWrite = (req, res) => {
    res.render('write', { title: '카페글쓰기 - FootballCafe'});
};

// 메인 페이지
exports.renderMain = async (req, res, next) => {
    try {
        const [posts] = await db.execute(`
            SELECT p.*, u.id as userId, u.nick as userNick
            FROM posts p
            JOIN users u ON p.userId = u.id
            ORDER BY p.createdAt DESC
        `);

        res.render('main', {
            title: 'FootballCafe',
            list: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 게시글 상세보기 페이지
exports.renderPostDetailView = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        // 게시물 조회수 증가
        await db.execute('UPDATE posts SET hit = hit + 1, updatedAt = updatedAt WHERE id = ?', [postId]);

        // 업데이트된 조회수를 반영한 게시물 가져오기
        const [post] = await db.execute(`
            SELECT p.*, u.nick as userNick
            FROM posts p
            JOIN users u ON p.userId = u.id
            WHERE p.id = ?
        `, [postId]);

        if (post.length === 0) {
            // 게시물을 찾지 못한 경우 처리
            res.redirect('/');
            return;
        }

        // 해당 게시물에 대한 댓글 가져오기
        const [comments] = await db.execute(`
            SELECT c.*, u.nick as userNick
            FROM comments c
            JOIN users u ON c.userId = u.id
            WHERE c.postId = ?
        `, [postId]);

        res.render('view', {
            title: '게시물 상세보기 - FootballCafe',
            post: post[0],
            comments: comments || [],  // 댓글이 없으면 빈 배열 전달
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 제목 검색 기능
exports.renderSearch = async (req, res, next) => {
    const query = req.query.search;
    if (!query) {
        return res.redirect('/');
    }

    try {
        const [posts] = await db.execute(`
            SELECT p.*, u.id userId, u.nick userNick
            FROM posts p
            JOIN users u ON p.userId = u.id
            WHERE p.subject LIKE ?
            ORDER BY p.createdAt DESC
        `, [`%${query}%`]);

        res.render('main', {
            title: `${query} | FootballCafe`,
            list: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
