import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User.js";

const generateToken = (user: IUser) => {
  const { _id, email, name } = user;
  return jwt.sign({ id: _id, email, name }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// @desc Register User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);

    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // sameSite: "strict",
    });

    res.status(201).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Login User
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
