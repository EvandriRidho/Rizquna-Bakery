import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/Product.js'

// add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image"
                })
                return result.secure_url
            })
        )

        await Product.create({ ...productData, image: imagesUrl, stock: productData.stock || 0 })

        res.status(201).json({ success: true, message: "product berhasil ditambahkan" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan produk: " + error.message })
    }
}

// get product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Gagal mengambil daftar produk: " + error.message })
    }
}

// get id product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.status(200).json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Gagal mengambil detail produk: " + error.message })
    }
}


// change product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, { inStock })
        res.status(200).json({ success: true, message: "stock berhasil diubah" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Gagal mengubah status stok: " + error.message })
    }
}

// change stock jumlah produk
export const updateStockQty = async (req, res) => {
    try {
        const { id, stock } = req.body;
        if (stock < 0) {
            return res.status(400).json({ success: false, message: "Stok tidak boleh negatif" });
        }
        await Product.findByIdAndUpdate(id, { stock, inStock: stock > 0 });
        res.status(200).json({ success: true, message: "Jumlah stok berhasil diubah" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengubah jumlah stok: " + error.message });
    }
};
