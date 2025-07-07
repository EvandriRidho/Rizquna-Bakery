import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ success: false, message: "Anda tidak memiliki akses" })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDecode.id) {
            req.user = tokenDecode.id
        } else {
            return res.status(403).json({ success: false, message: "Token tidak valid" })
        }
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: "Token tidak sah atau telah kedaluwarsa." })
    }
}

export default authUser
