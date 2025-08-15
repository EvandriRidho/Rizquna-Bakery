import User from "../models/User.js";
import Product from "../models/Product.js";

export const updateCart = async (req, res) => {
    try {
        const userId = req.user || req.body.userId;
        const { cartItems } = req.body;

        if (!userId || (!Array.isArray(cartItems) && typeof cartItems !== 'object')) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap atau format salah" });
        }

        // Cek stok tiap produk
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan` });
            }

            if (item.qty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stok untuk "${product.name}" tidak cukup. Sisa stok: ${product.stock}`
                });
            }
        }

        // Kalau semua aman → update keranjang
        await User.findByIdAndUpdate(userId, { cartItems });

        return res.status(200).json({ success: true, message: "Keranjang berhasil diupdate" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui keranjang: " + error.message
        });
    }
};
