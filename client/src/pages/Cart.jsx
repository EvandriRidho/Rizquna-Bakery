import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"
import { FaArrowLeftLong } from "react-icons/fa6";

const Cart = () => {
    const { products, cartItems, removeCartItem, getCartCount, navigate, updateCartItem, getCartAmount, axios, user, setCartItems, formatRupiah }
        = useAppContext()

    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            if (product) {
                tempArray.push({
                    ...product,
                    quantity: cartItems[key]
                })
            } else {
                console.warn("Produk tidak ditemukan untuk ID:", key)
            }
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get')
            if (data.success) {
                setAddresses(data.addresses)
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error('Pilih Alamat');
            }

            const itemsPayload = cartArray.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: itemsPayload,
                    address: selectedAddress
                });

                if (data.success) {
                    toast.success(data.message);
                    await axios.post("/api/cart/update", { cartItems: {} });
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            }

            if (paymentOption === "Online") {
                const { data } = await axios.post('/api/order/online', {
                    userId: user._id,
                    items: itemsPayload,
                    address: selectedAddress,
                    userInfo: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                });

                if (data.success) {
                    const script = document.createElement("script");
                    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
                    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

                    script.onload = () => {
                        window.snap.pay(data.token, {
                            onSuccess: async () => {
                                toast.success("Pembayaran berhasil");

                                setCartItems({});
                                await axios.post("/api/cart/update", { cartItems: {}, userId: user._id });

                                navigate("/my-orders");
                            },
                            onPending: () => {
                                toast("Menunggu pembayaran...");
                            },
                            onError: () => {
                                toast.error("Terjadi kesalahan saat pembayaran");
                            },
                            onClose: () => {
                                toast.error("Pembayaran dibatalkan");
                            }
                        });
                    };

                    document.body.appendChild(script);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        if (products.length > 0 && cartItems && Object.keys(cartItems).length > 0) {
            getCart()
        } else {
            setCartArray([])
        }
    }, [products, cartItems])

    useEffect(() => {
        if (user) {
            getUserAddress()
        }
    }, [user])

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Keranjang Belanja <span className="text-sm text-primary">{getCartCount()} Barang</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Detail Produk</p>
                    <p className="text-center">Jumlah Sementara</p>
                    <p className="text-center">Aksi</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div
                                onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                    scrollTo(0, 0);
                                }}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Berat: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Jumlah:</p>
                                        <select onChange={(e) => updateCartItem(product._id, Number(e.target.value))} className='outline-none' value={cartItems[product._id]}>
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{formatRupiah(product.offerPrice * product.quantity)}</p>
                        <button
                            className="cursor-pointer mx-auto text-primary"
                            onClick={() => removeCartItem(product._id)}
                        >
                            <span className="inline-block w-6 h-6">
                                X
                            </span>
                        </button>
                    </div>
                ))}

                <button
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                    onClick={() => {
                        navigate("/products");
                        scrollTo(0, 0);
                    }}
                >
                    <span
                        className="group-hover:-translate-x-1 transition"
                    >
                        <FaArrowLeftLong />
                    </span>
                    Lanjut Belanja
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Ringkasan Belanja</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Alamat</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : "No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Ubah
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index) => (
                                    <p key={index} onClick={() => {
                                        setSelectedAddress(address)
                                        setShowAddress(false)
                                    }}
                                        className="text-gray-500 p-2 hover:bg-gray-100"
                                    >
                                        {address.street}, {address.city}
                                    </p>
                                ))}
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                                    Tambah Alamat
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Metode Pembayaran</p>

                    <select onChange={(e) => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Bayar di Tempat</option>
                        <option value="Online">Bayar Online</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Harga</span><span>{formatRupiah(getCartAmount())}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Pengiriman</span><span className="text-primary">Free</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total:</span><span>{formatRupiah(getCartAmount())}</span>
                    </p>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 font-medium transition text-white bg-primary hover:bg-primary-dull"
                >
                    {paymentOption === "COD" ? "Bayar di Tempat" : "Bayar Online"}
                </button>
            </div>
        </div>
    ) : null
}

export default Cart
