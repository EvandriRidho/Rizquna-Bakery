import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";

const Cart = () => {
    const {
        products,
        cartItems,
        removeCartItem,
        getCartCount,
        navigate,
        updateCartItem,
        getCartAmount,
        axios,
        user,
        setCartItems,
        formatRupiah,
        getStockSafe,
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const buildCart = () => {
        const list = [];
        for (const id in cartItems) {
            const product = products.find((p) => p._id === id);
            if (product) {
                const stock = getStockSafe(id);
                const qty = Math.min(Number(cartItems[id] || 0), Math.max(0, stock));
                // auto-clamp if melebihi stok
                if (qty !== cartItems[id]) updateCartItem(id, qty || 1);
                list.push({
                    ...product,
                    quantity: qty,
                    _stock: stock,
                });
            }
        }
        setCartArray(list);
    };

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get("/api/address/get");
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const itemsPayload = useMemo(
        () =>
            cartArray.map((item) => ({
                product: item._id,
                quantity: item.quantity,
            })),
        [cartArray]
    );

    const placeOrder = async () => {
        try {
            if (!selectedAddress) return toast.error("Pilih Alamat");

            // Final guard sebelum submit
            for (const it of cartArray) {
                if (it.quantity < 1) return toast.error("Jumlah tidak boleh 0");
                if (it.quantity > it._stock)
                    return toast.error(`"${it.name}" melebihi stok (${it._stock})`);
            }

            const clearCartAndRefresh = async () => {
                await axios.post("/api/cart/update", {
                    userId: user._id,
                    cartItems: []
                });
                setCartItems({});
                // Refresh produk biar stok baru muncul
                if (typeof fetchProducts === "function") await fetchProducts();
            };

            if (paymentOption === "COD") {
                const { data } = await axios.post("/api/order/cod", {
                    userId: user._id,
                    items: itemsPayload,
                    address: selectedAddress,
                });
                if (data.success) {
                    toast.success(data.message);
                    await clearCartAndRefresh();
                    navigate("/my-orders");
                } else toast.error(data.message);
            }

            if (paymentOption === "Online") {
                const { data } = await axios.post("/api/order/online", {
                    userId: user._id,
                    items: itemsPayload,
                    address: selectedAddress,
                    userInfo: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    },
                });

                if (data.success) {
                    const script = document.createElement("script");
                    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
                    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
                    script.onload = () => {
                        window.snap.pay(data.token, {
                            onSuccess: async () => {
                                toast.success("Pembayaran berhasil");
                                await clearCartAndRefresh();
                                navigate("/my-orders");
                            },
                            onPending: () => toast("Menunggu pembayaran..."),
                            onError: () => toast.error("Terjadi kesalahan saat pembayaran"),
                            onClose: () => toast.error("Pembayaran dibatalkan"),
                        });
                    };
                    document.body.appendChild(script);
                } else toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    useEffect(() => {
        if (products.length > 0 && cartItems && Object.keys(cartItems).length > 0)
            buildCart();
        else setCartArray([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, cartItems]);

    useEffect(() => {
        if (user) getUserAddress();
    }, [user]);

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Keranjang Belanja{" "}
                    <span className="text-sm text-primary">{getCartCount()} Barang</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Detail Produk</p>
                    <p className="text-center">Jumlah</p>
                    <p className="text-center">Aksi</p>
                </div>

                {cartArray.map((product) => {
                    const maxQty = Math.max(1, product._stock);
                    const warn = product.quantity > product._stock || product._stock === 0;

                    return (
                        <div
                            key={product._id}
                            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
                        >
                            <div className="flex items-center md:gap-6 gap-3">
                                <div
                                    onClick={() => {
                                        navigate(
                                            `/products/${product.category.toLowerCase()}/${product._id}`
                                        );
                                        scrollTo(0, 0);
                                    }}
                                    className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                                >
                                    <img
                                        className="max-w-full h-full object-cover"
                                        src={product.image[0]}
                                        alt={product.name}
                                    />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold">{product.name}</p>
                                    <div className="font-normal text-gray-500/70">
                                        <p>
                                            Stok:{" "}
                                            <span className={product._stock ? "" : "text-red-500"}>
                                                {product._stock}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p>Jumlah:</p>
                                            <select
                                                onChange={(e) =>
                                                    updateCartItem(product._id, Number(e.target.value))
                                                }
                                                className={`outline-none border rounded px-2 py-1 ${warn ? "border-red-400" : "border-gray-300"
                                                    }`}
                                                value={product.quantity}
                                            >
                                                {Array.from(
                                                    { length: Math.min(99, maxQty) },
                                                    (_, i) => i + 1
                                                ).map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                            {warn && (
                                                <span className="text-xs text-red-500">
                                                    Sisa stok {product._stock}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center">
                                {formatRupiah(product.offerPrice * product.quantity)}
                            </p>

                            <button
                                className="cursor-pointer mx-auto text-primary"
                                onClick={() => removeCartItem(product._id)}
                            >
                                <span className="inline-block w-6 h-6">X</span>
                            </button>
                        </div>
                    );
                })}

                <button
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                    onClick={() => {
                        navigate("/");
                        scrollTo(0, 0);
                    }}
                >
                    <span className="group-hover:-translate-x-1 transition">
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
                        <p className="text-gray-500">
                            {selectedAddress
                                ? `${selectedAddress.street}, ${selectedAddress.city}`
                                : "No address found"}
                        </p>
                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-primary hover:underline cursor-pointer"
                        >
                            Ubah
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index) => (
                                    <p
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowAddress(false);
                                        }}
                                        className="text-gray-500 p-2 hover:bg-gray-100"
                                    >
                                        {address.street}, {address.city}
                                    </p>
                                ))}
                                <p
                                    onClick={() => navigate("/add-address")}
                                    className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                                >
                                    Tambah Alamat
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Metode Pembayaran</p>
                    <select
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Bayar di Tempat</option>
                        <option value="Online">Bayar Online</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Harga</span>
                        <span>{formatRupiah(getCartAmount())}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Pengiriman</span>
                        <span className="text-primary">Free</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total:</span>
                        <span>{formatRupiah(getCartAmount())}</span>
                    </p>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 font-medium transition text-white bg-primary hover:bg-primary-dull"
                    disabled={
                        cartArray.length === 0 ||
                        cartArray.some((it) => it.quantity < 1 || it.quantity > it._stock)
                    }
                >
                    {paymentOption === "COD" ? "Bayar di Tempat" : "Bayar Online"}
                </button>
            </div>
        </div>
    ) : null;
};

export default Cart;
