// routes/postTags.js
const express = require("express");
const db = require("../../db");
const router = express.Router();

// 특정 소개글의 태그 조회
router.get("/:place_id", (req, res) => {
  const { place_id } = req.params;
  db.query(
    "SELECT t.tag_name FROM place_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.place_id = ?",
    [place_id],
    (err, results) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.json(results);
    }
  );
});

// 특정 소개글에 태그 추가
router.post("/:place_id", (req, res) => {
  const { place_id } = req.params;
  const { tag_id } = req.body;

  console.log(place_id);

  db.query(
    "INSERT INTO place_tags (place_id, tag_id) VALUES (?, ?)",
    [place_id, tag_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("서버 오류");
      }
      res.status(201).send("태그가 추가되었습니다.");
    }
  );
});

// 특정 소개글에서 태그 삭제
router.delete("/:place_id/:tag_id", (req, res) => {
  const { place_id, tag_id } = req.params;

  db.query(
    "DELETE FROM place_tags WHERE place_id = ? AND tag_id = ?",
    [place_id, tag_id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.send("태그가 삭제되었습니다.");
    }
  );
});

module.exports = router;
