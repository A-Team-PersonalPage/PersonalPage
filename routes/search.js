const express = require('express');
const { param, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// ✅ 데이터 검증 미들웨어
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(400).json({ errors: errors.array() });
    }
};

// ✅ [수정] Geonames API 제거 & DB에서 직접 조회
router.get('/place/:name',  
    [
        param('name').notEmpty().isString().withMessage('도시 이름을 입력하세요.'),
        validate
    ],
    (req, res) => {
    const placesname = decodeURIComponent(req.params.name); // ✅ 한글 URL 디코딩
    console.log(`🔍 요청된 장소: ${placesname}`);

    // ✅ DB에서 직접 검색 (geo_id 대신 place_name 기준)
    const query = `SELECT * FROM places WHERE place_name = ?`;

    db.execute(query, [placesname], (err, rows) => {
        if (err) {
            console.error('장소 검색 실패:', err);
            return res.status(500).json({ message: '장소 검색 실패' });
        }
        if (rows.length === 0) {
            console.warn(`🚨 해당 도시 정보 없음: ${placesname}`);
            return res.status(404).json({ message: '해당 도시 정보가 없습니다.' });
        }

        console.log(`✅ 검색된 장소:`, rows[0]);
        res.status(200).json({ message: '장소 목록', data: rows });
    });
});

// ✅ 기존 태그 검색 라우트 유지
router.get('/tag/:tag_name',
    [
        param('tag_name').notEmpty().isString().withMessage('태그 이름을 입력하세요.'),
        validate
    ],
    (req, res) => {
    const tag_name = req.params.tag_name;

    let sql = `SELECT p.* FROM places p 
                JOIN place_tags pt ON p.geo_id = pt.place_id 
                JOIN tags t ON pt.tag_id = t.id 
                WHERE t.tag_name = ?;`;

    db.execute(sql, [tag_name], (err, rows) => {
        console.log(rows);
        if (err) {
            console.error('장소 검색 실패:', err);
            return res.status(500).json({ message: '장소 검색 실패' });
        }
        if (rows.length === 0) {
            console.warn('🚨 장소 없음');
            return res.status(404).json({ message: '장소 없음' });
        }
        res.status(200).json({ message: '장소 목록', data: rows });
    });
});

module.exports = router;
