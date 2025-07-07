import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Semua Kolom wajib diisi" })
        }

        const isExistUser = await User.findOne({ email });

        if (isExistUser) {
            return res.status(409).json({ success: false, message: "Email sudah terdaftar" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            cartItems: {}
        })

        user.markModified("cartItems");
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ success: true, user: { email: user.email, name: user.name }, message: "Register Berhasil" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat registrasi: " + error.message })
    }
}

// login user : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Semua Kolom wajib diisi" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Email belum terdaftar" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Email atau password salah" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ success: true, user: { email: user.email, name: user.name }, message: "Login Berhasil" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat login: " + error.message })
    }
}

// check auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId).select("-password");
        return res.status(200).json({ success: true, user })

    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memverifikasi autentikasi: " + error.message })
    }
}

// logout user : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({ success: true, message: "Logout Berhasil" })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat logout: " + error.message })
    }
}