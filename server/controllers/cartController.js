// Update User CartData : /api/cart/update
import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const userId = req.user;
        const { cartItems } = req.body;

        if (!userId || !cartItems) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap" });
        }

        await User.findByIdAndUpdate(userId, { cartItems });

        return res.status(200).json({ success: true, message: "Cart berhasil diupdate" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
