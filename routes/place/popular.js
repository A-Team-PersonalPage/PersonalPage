const express = require('express');
const db = require('../../db');

const router = express.Router();

router.get('/place/korea', (req, res) => {
    let sql = `SELECT p.*, count(pl.place_id) FROM places p 
                JOIN places_likes pl ON  p.geo_id = pl.place_id
                WHERE korea = 1
                GROUP BY pl.place_id
                HAVING COUNT(pl.place_id) > 0
                LIMIT 10;`

    db.execute(sql,(err, rows) => {
        console.log(rows)
        if (err) {
            console.error('국내 장소 검색 실패:', err);
            res.status(500).send({ message: '국내 장소 검색 실패' });
            return;
        }
        if(rows.length == 0){
            console.error('국내 장소 없음');
            res.status(404).send({ message: '국내 장소 없음' });
            return;
        }
        res.status(200).send({ message: '국내 장소 목록', data: rows });
    });
});

router.get('/place/foreign_country', (req, res) => {
    let sql = `SELECT p.*, count(pl.place_id) FROM places p 
                JOIN places_likes pl ON  p.geo_id = pl.place_id
                WHERE korea = 0
                GROUP BY pl.place_id
                HAVING COUNT(pl.place_id) > 0
                LIMIT 10;`

    db.execute(sql,(err, rows) => {
        console.log(rows)
        if (err) {
            console.error('해외 장소 검색 실패:', err);
            res.status(500).send({ message: '해외 장소 검색 실패' });
            return;
        }
        if(rows.length == 0){
            console.error('해외 장소 없음');
            res.status(404).send({ message: '해외 장소 없음' });
            return;
        }
        res.status(200).send({ message: '해외 장소 목록', data: rows });
    });
});

router.get('/tag', (req, res) => {
    let sql = `SELECT t.*, count(tl.tag_id) FROM tags t 
                JOIN tags_likes tl ON t.id = tl.tag_id
                GROUP BY tl.tag_id
                HAVING COUNT(tl.tag_id) > 0
                LIMIT 10;`

    db.execute(sql,(err, rows) => {
        console.log(rows)
        if (err) {
            console.error('장소 검색 실패:', err);
            res.status(500).send({ message: '장소 검색 실패' });
            return;
        }
        if(rows.length == 0){
            console.error('장소 없음');
            res.status(404).send({ message: '장소 없음' });
            return;
        }
        res.status(200).send({ message: '장소 목록', data: rows });
    });
});

module.exports = router;