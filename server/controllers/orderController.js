import Order from '../models/Order.js'
import Product from '../models/Product.js'
import mongoose from 'mongoose'

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Alamat dan Produk harus diisi" })
        }
        // itung total harga
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        await Order.create({ userId, items, address, amount, paymentType: "COD" })

        return res.json({ success: true, message: "Order berhasil dibuat" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        console.log("🔍 USER dari req.user.id:", req.user?.id)

        const userId = new mongoose.Types.ObjectId(req.user)


        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })

        console.log("📦 ORDER YANG DIAMBIL:", orders)

        return res.json({ success: true, orders })
    } catch (error) {
        console.log("❌ ERROR:", error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get All Orders ( for admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        return res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}