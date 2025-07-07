import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAdress = async (req, res) => {
    try {
        const { address, userId } = req.body
        await Address.create({ ...address, userId })
        res.status(201).json({ success: true, message: "Alamat berhasil ditambahkan" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan alamat: " + error.message })
    }
}

// get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.user
        const addresses = await Address.find({ userId })
        res.status(200).json({ success: true, addresses, message: "Daftar alamat berhasil diambil." })
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil alamat: " + error.message })
    }
}