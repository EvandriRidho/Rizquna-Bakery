import jwt from 'jsonwebtoken'

// login seller : /api/seller/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ success: true, message: 'Login Berhasil' })
        } else {
            return res.status(401).json({ success: false, message: 'Email atau password salah' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// auth seller : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// logout seller : /api/seller/logout
export const sellerLogut = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({ success: true, message: "Logout Berhasil" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}