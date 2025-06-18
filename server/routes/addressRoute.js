import express from 'express'
import { addAdress, getAddress } from '../controllers/addressController.js'
import authUser from '../middlewares/authUser.js'

const addressRouter = express.Router()

addressRouter.post('/add', authUser, addAdress)
addressRouter.post('/get', authUser, getAddress)

export default addressRouter