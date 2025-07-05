import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])


    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState([])

    // Fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth')
            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // Fetch user status, user data, dan cart items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')
            if (data.success) {
                setUser(data.user)

                // 👇 tambahkan konversi array ke object di sini
                const convertCartArrayToObject = (cartArray) => {
                    const result = {};
                    for (const item of cartArray) {
                        result[item.productId] = item.quantity;
                    }
                    return result;
                }

                const cartObject = Array.isArray(data.user.cartItems)
                    ? convertCartArrayToObject(data.user.cartItems)
                    : data.user.cartItems;

                setCartItems(cartObject);
            }
        } catch (error) {
            setUser(null)
            setCartItems({})
        }
    }


    // Fetch Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // add Cart
    const addToCart = (itemId) => {
        setCartItems(prev => {
            const next = { ...prev };
            next[itemId] = (next[itemId] || 0) + 1;
            return next;
        });
        toast.success("Item berhasil ditambah");
    };

    // Update Cart
    const updateCartItem = (itemId, quantity) => {
        setCartItems(prev => ({ ...prev, [itemId]: quantity }));
        toast.success("Item berhasil di‑update");
    };

    // Remove Cart
    const removeCartItem = (itemId) => {
        setCartItems(prev => {
            const next = { ...prev };
            if (next[itemId]) {
                next[itemId] -= 1;
                if (next[itemId] === 0) delete next[itemId];
            }
            return next;
        });
        toast.success("Item berhasil dihapus");
    };

    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0
        for (const item in cartItems) {
            totalCount += cartItems[item]
        }
        return totalCount
    }

    // Get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount);
    };

    // Fungsi formatter Rupiah
    const formatRupiah = (value) => {
        if (!value) return "Rp0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts()
    }, [])

    // Update db cart items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('api/cart/update', { cartItems })
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if (user) {
            updateCart()
        }
    }, [cartItems])


    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeCartItem, cartItems, searchQuery, setSearchQuery, getCartCount, getCartAmount, axios, fetchProducts, setCartItems, formatRupiah }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}