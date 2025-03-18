const express = require("express");
const router = express.Router();
const db = require("../../db");
const authMiddleware = require("../../middlewares/authMiddleware");

// 특정 소개글에 좋아요 추가
router.post("/:place_id", authMiddleware, (req, res) => {
  const { place_id } = req.params;
  const user_id = req.user.id;

  // 중복 방지를 위한 체크
  db.query(
    "SELECT * FROM places_likes WHERE place_id = ? AND user_id = ?",
    [place_id, user_id],
    (err, results) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      if (results.length > 0) {
        return res.status(400).send("이미 좋아요를 누른 상태입니다.");
      }

      db.query(
        "INSERT INTO places_likes (place_id, user_id) VALUES (?, ?)",
        [place_id, user_id],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("서버 오류");
          }
          res.status(201).send("좋아요가 추가되었습니다.");
        }
      );
    }
  );
});

// 특정 소개글에서 좋아요 취소
router.delete("/:place_id", authMiddleware, (req, res) => {
  const { place_id } = req.params;
  const user_id = req.user.id;

  db.query(
    "DELETE FROM places_likes WHERE place_id = ? AND user_id = ?",
    [place_id, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.send("좋아요가 취소되었습니다.");
    }
  );
});

module.exports = router;
