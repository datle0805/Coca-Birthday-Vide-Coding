import { Request, Response } from "express";
import { verifyCredentials, generateToken } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (!verifyCredentials(username, password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(username);

    res.json({
      success: true,
      token,
      user: { username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
};
