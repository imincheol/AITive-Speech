var express = require('express');
var router = express.Router();

// 번역 요청
router.get('/', function(req, res) {
    res.render('index');
});
module.exports = router;