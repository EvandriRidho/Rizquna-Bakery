import express from 'express'
import { addProduct, changeStock, productById, productList, updateStockQty } from '../controllers/productController.js'
import { upload } from '../configs/multer.js'
import authSeller from '../middlewares/authSeller.js'

const productRouter = express.Router()


productRouter.post('/add', upload.array(['images']), authSeller, addProduct)
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.put('/stock', authSeller, changeStock)
productRouter.put('/stock-qty', authSeller, updateStockQty);

export default productRouter