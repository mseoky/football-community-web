const db = require(process.cwd() + '/models');

// 이미지 업로드 후에 호출되는 함수
exports.afterUploadImage = (req, res) => {
    console.log(req.file);  // 업로드된 파일의 정보를 콘솔에 출력
    res.json({ url: `/img/${req.file.filename}` });  // 클라이언트에게 업로드된 이미지의 URL을 응답
};

// 게시글 업로드
exports.uploadPost = async (req, res, next) => {
    try {
        const [postInsertResult] = await db.execute('INSERT INTO posts (subject, content, img, userId) VALUES (?, ?, ?, ?)',
            [req.body.subject, req.body.content, req.body.url, req.user.id]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 게시물 ID를 사용하여 세부 정보 가져오기
exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const [posts] = await db.execute('SELECT * FROM posts WHERE id=?', [postId]);
        const post = posts[0];

        res.render('edit', { user: req.user, post });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 게시물 수정
exports.editPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        // You can retrieve the updated data from the request body
        const updatedSubject = req.body.subject;
        const updatedContent = req.body.content;
        const updatedImg = req.body.img;  // You may need to adjust this depending on your form

        // Update the post in the database
        await db.execute('UPDATE posts SET subject=?, content=?, img=?, updatedAt=now() WHERE id=?',
            [updatedSubject, updatedContent, updatedImg, postId]);

        // Redirect to the edited post's details page or any other desired location
        res.redirect(`/view/${postId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
};


// 게시글 삭제
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        await db.execute('DELETE FROM posts WHERE id=?', [postId]);
        res.end();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 댓글 작성
exports.uploadComment = async (req, res, next) => {
    try {
      const { commentContent, postId, userId } = req.body;
  
      // 댓글 DB에 저장
      const [commentInsertResult] = await db.execute(
        'INSERT INTO comments (comment, postId, userId) VALUES (?, ?, ?)',
        [commentContent, postId, userId]
      );
      
      res.redirect(`/view/${postId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
  
      await db.execute('DELETE FROM comments WHERE id=?', [commentId]);
      res.end();
    } catch (err) {
      console.error(err);
      next(err);
    }
};
