import express from 'express'
import { isSellerAuth, login, sellerLogut } from '../controllers/sellerController.js'
import authSeller from '../middlewares/authSeller.js'

const sellerRouter = express.Router()

sellerRouter.post('/login', login)
sellerRouter.get('/is-auth', authSeller, isSellerAuth)
sellerRouter.get('/logout', sellerLogut)

export default sellerRouter