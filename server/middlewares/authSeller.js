import jwt from "jsonwebtoken"

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies

    if (!sellerToken) {
        return res.json({ success: false, message: "Anda tidak memiliki akses" })
    }

    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next()
        } else {
            return res.json({ success: false, message: "Token tidak valid" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default authSeller