const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/korea', (req, res) => {
    let sql = `SELECT place_name FROM places WHERE korea = 1;`

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

router.get('/foreign_country', (req, res) => {
    let sql = `SELECT place_name FROM places WHERE korea = 0;`

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


module.exports = router