import User from "../models/user";
import OTP from "../models/otp";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OtpGenerator from "otp-generator";

dotenv.config();

export async function register(req: Request, res: Response) {
  try {
    const { username, firstName, lastName, email, password , otp } = req.body;

    if (!username || !firstName || !lastName || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);

    if(recentOtp.length === 0){
      return res.status(400).json({
        success: false,
        message: "No OTP Found",
      });
    }
    else if(recentOtp[0].otp !== otp){
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashPassword,
      image: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
      accountType: "user",
    });

    const token = jwt.sign(
      { id: newUser._id, accountType: newUser.accountType },
      process.env.JWT_SECRET!
    );

    res.cookie("token", token, { httpOnly: true });

    return res.json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error |Register|",
    });
  }
}

export async function login(req: Request, res: Response) {
  try{
    const { username , password } = req.body;

    if(!username || !password){
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findOne({username});

    if(!user){
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const payload = {
      id: user._id,
      username : user.username,
      accountType: user.accountType,
    }

    if(await bcrypt.compare(password , user.password)){
      const token = jwt.sign(payload , process.env.JWT_SECRET! , {expiresIn: '1d'});
    

      const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error |Register|",
    });
  }
}

export async function sendOTP(req: Request, res: Response) {
  try {
    const {email} = req.body;

    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.status(400).json({success : false , error: 'User already exists' });
    }
    
    var otp = OtpGenerator.generate(6, { 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false, 
        specialChars: false 
      });

      const result = await OTP.findOne({otp : otp});
      
      while(result){
        otp = OtpGenerator.generate(6, { 
          upperCaseAlphabets: false, 
          lowerCaseAlphabets: false, 
          specialChars: false 
        });
      }

      const otpPayload = {email , otp};

      const otpBody = await OTP.create(otpPayload);

      return res.status(200).json({
        success : true ,
        otpBody 
      });

  } catch(error){
    console.log(error);
    return res.status(500).json({
        success : false ,
        message: 'Internal Server error' 
      });
  }
};