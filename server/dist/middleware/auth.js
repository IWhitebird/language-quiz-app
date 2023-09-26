"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function auth(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token, authorization denied",
                });
            }
            try {
                const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.user = decode;
                next();
            }
            catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Token is not valid",
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Middleware Error",
            });
        }
    });
}
exports.auth = auth;
function isAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.user.accountType !== "admin") {
                return res.status(401).json({
                    success: false,
                    message: "Not an admin",
                });
            }
            next();
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Middleware Error |Admin|",
            });
        }
    });
}
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map