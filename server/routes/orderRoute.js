import express from 'express'
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderOnline, midtransCallbackHandler } from '../controllers/orderController.js'
import authUser from '../middlewares/authUser.js'
import authSeller from '../middlewares/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/online', authUser, placeOrderOnline)
orderRouter.post('/midtrans/callback', midtransCallbackHandler);
orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)

export default orderRouter