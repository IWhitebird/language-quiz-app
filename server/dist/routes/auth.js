"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Auth_1 = require("../controllers/Auth");
const auth_1 = require("../middleware/auth");
router.post("/register", Auth_1.register);
router.post("/login", Auth_1.login);
router.get('/me', auth_1.auth, Auth_1.me);
router.post("/sendOTP", Auth_1.sendOTP);
exports.default = router;
