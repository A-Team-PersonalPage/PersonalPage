// routes/comments.js
const express = require("express");
const db = require("../../db");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");

// 모든 댓글 조회
router.get("/", (req, res) => {
  db.query("SELECT * FROM comment", (err, results) => {
    if (err) {
      return res.status(500).send("서버 오류");
    }
    res.json(results);
  });
});

// 특정 댓글 조회
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM comment WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send("서버 오류");
    }
    res.json(result);
  });
});

// 새로운 댓글 추가
router.post("/", authMiddleware, (req, res) => {
  const { place_id, birth_at, content } = req.body;
  const user_id = req.user.id;
  db.query(
    "INSERT INTO comment (user_id, place_id, birth_at, content) VALUES (?, ?, ?, ?)",
    [user_id, place_id, birth_at, content],
    (err, result) => {
      if (err) {
        console.log(err); // 오류를 콘솔에 출력
        return res.status(500).send("서버 오류");
      }
      res.status(201).send("댓글이 추가되었습니다.");
    }
  );
});

// 댓글 수정
router.put("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.query(
    "UPDATE comment SET content = ? WHERE id = ?",
    [content, id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.send("댓글이 수정되었습니다.");
    }
  );
});

// 댓글 삭제
router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM comment WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send("서버 오류");
    }
    res.send("댓글이 삭제되었습니다.");
  });
});

// 댓글 좋아요 추가
router.post("/:comment_id/like", authMiddleware, (req, res) => {
  const { comment_id } = req.params; // 이제 URL 경로에서 comment_id를 받음
  const user_id = req.user.id;

  // 중복 방지를 위한 체크
  db.query(
    "SELECT * FROM comments_like WHERE comment_id = ? AND user_id = ?",
    [comment_id, user_id],
    (err, results) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      if (results.length > 0) {
        return res.status(400).send("이미 좋아요를 누른 상태입니다.");
      }

      db.query(
        "INSERT INTO comments_like (comment_id, user_id) VALUES (?, ?)",
        [comment_id, user_id],
        (err, result) => {
          if (err) {
            return res.status(500).send("서버 오류");
          }
          res.status(201).send("좋아요가 추가되었습니다.");
        }
      );
    }
  );
});

// 댓글 좋아요 취소
router.delete("/:comment_id/like", authMiddleware, (req, res) => {
  const { comment_id } = req.params;
  const user_id = req.user.id;

  db.query(
    "DELETE FROM comments_like WHERE comment_id = ? AND user_id = ?",
    [comment_id, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.send("좋아요가 취소되었습니다.");
    }
  );
});

// 댓글 태그 추가
router.post("/:id/tags", authMiddleware, (req, res) => {
  const { id } = req.params; // comments_id 가져오기
  const { tags_id } = req.body;

  db.query(
    "INSERT INTO comment_tag (comment_id, tag_id) VALUES (?, ?)",
    [id, tags_id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.status(201).send("태그가 추가되었습니다.");
    }
  );
});

// 댓글 태그 삭제
router.delete("/:id/tags/:tag_id", authMiddleware, (req, res) => {
  const { id, tag_id } = req.params; //  comments_id와 tag_id 가져오기

  db.query(
    "DELETE FROM comment_tag WHERE comment_id = ? AND tag_id = ?",
    [id, tag_id],
    (err, result) => {
      if (err) {
        return res.status(500).send("서버 오류");
      }
      res.send("태그가 삭제되었습니다.");
    }
  );
});

module.exports = router;
