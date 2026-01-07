const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderJoin, renderMain, renderPostDetailView, renderSearch, renderWrite } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 최소 개발 기준(REST API)

// GET /page/join
router.get('/join', isNotLoggedIn, renderJoin);
// GET /page/write
router.get('/write', isLoggedIn, renderWrite);
// GET /page/search
router.get('/search', renderSearch);
// GET /page/view/:postId
router.get('/view/:postId', renderPostDetailView);
// GET /page
router.get('/', renderMain);

module.exports = router;