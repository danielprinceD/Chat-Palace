const { Router } = require("express");
const authContorller = require("../Controllers/authController");

const router = Router();

router.get("/signup", authContorller.signup_get);
router.get("/login", authContorller.login_get);
router.post("/signup", authContorller.signup_post);
router.post("/login", authContorller.login_get);

module.exports = router;
