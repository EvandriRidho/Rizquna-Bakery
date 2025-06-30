import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.json({ success: false, message: "Anda tidak memiliki akses" })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDecode.id) {
            req.user = tokenDecode.id
        } else {
            return res.json({ success: false, message: "Token tidak valid" })
        }
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default authUser
