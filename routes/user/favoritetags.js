const express = require("express");
const router = express.Router();
const db = require("../../db");
const authMiddleware = require("../../middlewares/authMiddleware");
const { validate, validationRules } = require("../../middlewares/validation");
const { StatusCodes } = require("http-status-codes");
const {
  getUserId,
  NotExistTags,
} = require("../../middlewares/favoriteMiddleware");

// 전체 태그 조회
router.get("/all", authMiddleware, getUserId, (req, res) => {
  const user_id = req.user_id;

  let sql = `
    SELECT 
        tags.tag_name, 
        CASE 
            WHEN tags_likes.user_id IS NOT NULL THEN true 
            ELSE false 
        END AS is_selected
    FROM tags
    LEFT JOIN tags_likes ON tags.id = tags_likes.tag_id AND tags_likes.user_id = ?;
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류", error: err });

    res.status(StatusCodes.OK).json({
      tags: results.map((row) => ({
        tag_name: row.tag_name,
        is_selected: row.is_selected,
      })),
    });
  });
});

// 선호 태그 등록
router.post(
  "/",
  [validationRules.tag_names, validate],
  authMiddleware,
  getUserId,
  NotExistTags,
  (req, res) => {
    const user_id = req.user_id;
    const tagResults = req.tagResults; // 미들웨어에서 가져온 태그 정보
    const tagIds = tagResults.map((tag) => tag.id);

    let checkExistingSql = `SELECT tag_id FROM tags_likes WHERE user_id = ? AND tag_id IN (?)`;

    db.query(checkExistingSql, [user_id, tagIds], (err, existingResults) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "서버 오류", error: err });

      const existingTagIds = new Set(existingResults.map((row) => row.tag_id));
      const newTagIds = tagIds.filter((id) => !existingTagIds.has(id));

      if (newTagIds.length === 0) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "이미 등록된 태그입니다.",
          duplicated_tags: tagResults.map((tag) => tag.tag_name),
        });
      }

      const newTagNames = tagResults
        .filter((tag) => newTagIds.includes(tag.id))
        .map((tag) => tag.tag_name);

      let insertSql = "INSERT INTO tags_likes (tag_id, user_id) VALUES ?";
      const insertValues = newTagIds.map((tag_id) => [tag_id, user_id]);

      db.query(insertSql, [insertValues], (err) => {
        if (err)
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "서버 오류", error: err });

        res.status(StatusCodes.CREATED).json({
          message: "선호 태그가 등록되었습니다.",
          added_tags: newTagNames,
          duplicated_tags: tagResults
            .map((tag) => tag.tag_name)
            .filter((tag) => !newTagNames.includes(tag)),
        });
      });
    });
  }
);

// 선호 태그 조회
router.get("/", authMiddleware, getUserId, (req, res) => {
  const user_id = req.user_id;

  let sql = `
    SELECT tags.tag_name 
    FROM tags_likes
    JOIN tags ON tags_likes.tag_id = tags.id
    WHERE tags_likes.user_id = ?;
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류", error: err });

    const tags = results.map((row) => row.tag_name);
    res.status(StatusCodes.OK).json({ tags });
  });
});

// 선호 태그 취소
router.delete(
  "/",
  [validationRules.tag_names, validate],
  authMiddleware,
  getUserId,
  NotExistTags,
  (req, res) => {
    const user_id = req.user_id;
    const tagResults = req.tagResults; // 미들웨어에서 가져온 태그 정보
    const tagIds = tagResults.map((tag) => tag.id);
    const tagNameMap = new Map(tagResults.map((tag) => [tag.id, tag.tag_name]));

    let checkExistingSql = `SELECT tag_id FROM tags_likes WHERE user_id = ? AND tag_id IN (?)`;
    db.query(checkExistingSql, [user_id, tagIds], (err, existingResults) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "서버 오류", error: err });

      const existingTagIds = new Set(existingResults.map((row) => row.tag_id));
      const removableTagIds = tagIds.filter((id) => existingTagIds.has(id));

      if (removableTagIds.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "선호 태그로 등록되지 않은 태그입니다.",
          not_registered_tags: tagResults.map((tag) => tag.tag_name),
        });
      }

      const removableTagNames = removableTagIds.map((id) => tagNameMap.get(id));

      let deleteSql =
        "DELETE FROM tags_likes WHERE tag_id IN (?) AND user_id = ?";
      db.query(deleteSql, [removableTagIds, user_id], (err) => {
        if (err)
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "서버 오류", error: err });

        res.status(StatusCodes.OK).json({
          message: "선호 태그가 삭제되었습니다.",
          deleted_tags: removableTagNames,
          not_registered_tags: tagResults
            .map((tag) => tag.tag_name)
            .filter((tag) => !removableTagNames.includes(tag)),
        });
      });
    });
  }
);

module.exports = router;