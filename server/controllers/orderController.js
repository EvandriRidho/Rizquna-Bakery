import Order from '../models/Order.js'
import Product from '../models/Product.js'
import mongoose from 'mongoose'
import midtransClient from 'midtrans-client'
import crypto from 'crypto'

// Midtrans Snap Client
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
})

// Place Order via Midtrans
export const placeOrderOnline = async (req, res) => {
    try {
        const { userId, items, address, userInfo } = req.body;

        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Alamat dan Produk harus diisi" });
        }

        // Validasi stok untuk semua item
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Produk dengan ID ${item.product} tidak ditemukan` });
            }
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stok untuk "${product.name}" tidak cukup. Sisa stok: ${product.stock}`
                });
            }
        }

        // Hitung total harga (dengan validasi produk ada)
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Produk dengan ID ${item.product} tidak ditemukan`);
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);


        // Buat order
        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
            isPaid: true,
            status: "Sedang Diproses"
        });

        // Kurangi stok produk
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            if (product.stock <= 0) {
                product.stock = 0;
                product.inStock = false;
            }
            await product.save();
        }

        // Midtrans parameter
        const parameter = {
            transaction_details: {
                order_id: order._id.toString(),
                gross_amount: amount,
            },
            customer_details: {
                first_name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone
            },
            callbacks: {
                finish: `${process.env.CLIENT_URL}/my-orders`
            }
        };

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({
            success: true,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            orderId: order._id
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Midtrans Callback
export const midtransCallbackHandler = async (req, res) => {
    try {
        const { order_id, transaction_status, status_code, gross_amount, signature_key } = req.body;

        if (!order_id || !transaction_status || !status_code || !gross_amount || !signature_key) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap" });
        }

        // Validasi ObjectId
        if (!mongoose.Types.ObjectId.isValid(order_id)) {
            return res.status(400).json({ success: false, message: "ID tidak valid" });
        }

        // === Verifikasi Signature ===
        const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
        const raw = order_id + status_code + gross_amount + serverKey;
        const expectedSignature = crypto.createHash('sha512').update(raw).digest('hex');

        if (expectedSignature !== signature_key) {
            return res.status(403).json({ success: false, message: "Signature tidak valid" });
        }

        // Update order jika pembayaran berhasil
        if (['settlement', 'capture'].includes(transaction_status)) {
            const order = await Order.findByIdAndUpdate(
                order_id,
                { isPaid: true, status: 'Sedang Diproses' }, 
                { new: true }
            );

            // Hapus cart user terkait
            await mongoose.connection.collection('carts').deleteOne({ userId: order.userId });
        }

        return res.status(200).json({ success: true, message: "Status diperbarui" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Alamat dan Produk harus diisi" });
        }

        // Validasi stok
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Produk dengan ID ${item.product} tidak ditemukan` });
            }
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stok untuk "${product.name}" tidak cukup. Sisa stok: ${product.stock}`
                });
            }
        }

        // Hitung total harga (dengan validasi produk ada)
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Produk dengan ID ${item.product} tidak ditemukan`);
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);


        // Buat order
        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            status: "Sedang Diproses",
            isPaid: false
        });

        // Kurangi stok
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            if (product.stock <= 0) {
                product.stock = 0;
                product.inStock = false;
            }
            await product.save();
        }

        // Hapus cart user (biar sama seperti online setelah sukses)
        await mongoose.connection.collection('carts').deleteOne({ userId });

        return res.status(201).json({ success: true, message: "Order berhasil dibuat" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat membuat pesanan: " + error.message });
    }
};


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user)

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })

        return res.status(200).json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil daftar pesanan: " + error.message })
    }
}

// Get All Orders ( for admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        return res.status(200).json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Gagal mengambil semua pesanan: " + error.message })
    }
}

// Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isPaid } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
        }

        if (status) order.status = status;
        if (typeof isPaid === "boolean") order.isPaid = isPaid;

        await order.save();

        return res.status(200).json({ success: true, message: "Status order diperbarui", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
