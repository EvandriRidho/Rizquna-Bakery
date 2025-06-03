import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets, dummyOrders } from '../assets/assets'

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const { currency } = useAppContext()

    const fetchMyOrders = async () => {
        setMyOrders(dummyOrders)
    }

    useEffect(() => {
        fetchMyOrders()
    }, [])

    return (
        <div className='mt-16 pb-16 px-4 mx-auto max-w-5xl'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>Orderan Saya</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>
            {
                myOrders.map((order, index) => (
                    <div
                        key={index}
                        className='border border-gray-300 rounded-lg mb-10 p-4 py-5'
                    >
                        <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                            <span>OrderId: {order._id}</span>
                            <span>Pembayaran: {order.paymentType}</span>
                            <span>Harga Total: {currency}{order.amount}</span>
                        </p>
                        {
                            order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 grid md:grid-cols-[auto,1fr,auto] items-center gap-4 md:gap-8 p-4 py-5`}
                                >
                                    {/* Kolom 1: Gambar + Nama Produk */}
                                    <div className='flex items-center'>
                                        <div className='bg-primary/10 p-4 rounded-lg'>
                                            <img src={item.product.image[0]} alt='' className='w-16 h-16' />
                                        </div>
                                        <div className='ml-4'>
                                            <h2 className='text-xl font-medium text-gray-800'>{item.product.name}</h2>
                                            <p>Kategori : {item.product.category}</p>
                                        </div>
                                    </div>

                                    {/* Kolom 2: Detail */}
                                    <div className='text-sm md:text-lg space-y-1'>
                                        <p>Jumlah : {item.quantity || "1"}</p>
                                        <p>Status : {order.status}</p>
                                        <p>Tanggal : {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    {/* Kolom 3: Harga */}
                                    <p className='text-primary text-lg font-semibold text-right md:text-left'>
                                        Harga : {currency}{item.product.offerPrice * item.quantity}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default MyOrders
