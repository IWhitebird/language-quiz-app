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
exports.me = exports.sendOTP = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const otp_1 = __importDefault(require("../models/otp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const otp_generator_1 = __importDefault(require("otp-generator"));
dotenv_1.default.config();
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, firstName, lastName, email, password, otp } = req.body;
            if (!username || !firstName || !lastName || !email || !password || !otp) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter all the fields",
                });
            }
            const user = yield user_1.default.findOne({ email });
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }
            const recentOtp = yield otp_1.default.find({ email }).sort({ createdAt: -1 }).limit(1);
            if (recentOtp.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No OTP Found",
                });
            }
            else if (recentOtp[0].otp !== otp) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }
            const hashPassword = bcrypt_1.default.hashSync(password, 10);
            const newUser = yield user_1.default.create({
                username,
                firstName,
                lastName,
                email,
                password: hashPassword,
                image: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
                accountType: "user",
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, accountType: newUser.accountType }, process.env.JWT_SECRET);
            res.cookie("token", token, { httpOnly: true });
            return res.json({
                success: true,
                message: "User created successfully",
                data: newUser,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error |Register|",
            });
        }
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter all the fields",
                });
            }
            const user = yield user_1.default.findOne({ email }).populate('recent').populate('quizes')
                .populate({
                path: 'recent',
                populate: {
                    path: 'quiz',
                    model: 'Quiz'
                }
            });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User doesn't exist",
                });
            }
            const payload = {
                id: user._id,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
            };
            if (yield bcrypt_1.default.compare(password, user.password)) {
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                const options = {
                    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie("token", token, options).status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    user,
                    token
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect Password",
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error |Register|",
            });
        }
    });
}
exports.login = login;
function sendOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const checkUserPresent = yield user_1.default.findOne({ email });
            if (checkUserPresent) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            }
            var otp = otp_generator_1.default.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            const result = yield otp_1.default.findOne({ otp: otp });
            while (result) {
                otp = otp_generator_1.default.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false
                });
            }
            const otpPayload = { email, otp };
            const otpBody = yield otp_1.default.create(otpPayload);
            return res.status(200).json({
                success: true,
                otpBody
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server error'
            });
        }
    });
}
exports.sendOTP = sendOTP;
;
function me(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById(req.user.id).select('-password').populate('quizes')
                .populate({
                path: 'recent',
                populate: {
                    path: 'quiz',
                    model: 'Quiz'
                }
            });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User doesn't exist",
                });
            }
            return res.status(200).json({
                success: true,
                user
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server error'
            });
        }
    });
}
exports.me = me;
//# sourceMappingURL=Auth.js.map