const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

const validationRules = {
  email: body("user_email")
    .notEmpty()
    .isEmail()
    .withMessage("이메일 형식을 맞춰주세요."),
  password: body("user_pwd")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다.")
    .matches(/[\W_]/)
    .withMessage("비밀번호에 최소 하나의 특수문자가 포함되어야 합니다."),
  new_password: body("new_pwd")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다.")
    .matches(/[\W_]/)
    .withMessage("비밀번호에 최소 하나의 특수문자가 포함되어야 합니다."),
  name: body("user_name")
    .notEmpty()
    .matches(/^[가-힣]+$/)
    .withMessage("이름은 한글로 입력해야 합니다."),
  phone: body("user_phone")
    .notEmpty()
    .isString()
    .matches(/^01[016789]\d{8}$/)
    .withMessage("연락처를 다시 확인해주세요."),
  tag_names: body("tag_names")
    .isArray()
    .withMessage("태그 목록은 배열이어야 합니다."),
};

module.exports = { validate, validationRules };
