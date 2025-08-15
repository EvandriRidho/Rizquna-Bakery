import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);

    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState([]);

    // ===== helpers =====
    const findProduct = (id) => products.find((p) => p._id === id);
    const getStockSafe = (id) => {
        const p = findProduct(id);
        return typeof p?.stock === "number" ? Math.max(0, p.stock) : (p?.inStock ? 999999 : 0);
    };

    // ===== auth =====
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(!!data.success);
        } catch {
            setIsSeller(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user);
                const convert = (arr) =>
                    arr.reduce((acc, it) => {
                        acc[it.productId] = it.quantity;
                        return acc;
                    }, {});
                const obj = Array.isArray(data.user.cartItems)
                    ? convert(data.user.cartItems)
                    : data.user.cartItems;
                setCartItems(obj || {});
            } else {
                setUser(null);
                setCartItems({});
            }
        } catch {
            setUser(null);
            setCartItems({});
        }
    };

    // ===== products =====
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("api/product/list");
            if (data.success) setProducts(data.products);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ===== cart ops with STOCK GUARD =====
    const addToCart = (itemId) => {
        const stock = getStockSafe(itemId);
        if (stock <= 0) return toast.error("Barang tidak tersedia / stok habis");

        setCartItems((prev) => {
            const nextQty = (prev[itemId] || 0) + 1;
            if (nextQty > stock) {
                toast.error(`Maksimal ${stock} item`);
                return prev;
            }
            const next = { ...prev, [itemId]: nextQty };
            return next;
        });
        toast.success("Item berhasil ditambah");
    };

    const updateCartItem = (itemId, quantity) => {
        const stock = getStockSafe(itemId);
        const q = Math.max(1, Number(quantity) || 1);
        if (stock <= 0) return toast.error("Barang tidak tersedia");
        if (q > stock) {
            toast.error(`Maksimal ${stock} item`);
            setCartItems((prev) => ({ ...prev, [itemId]: stock }));
            return;
        }
        setCartItems((prev) => ({ ...prev, [itemId]: q }));
        toast.success("Item berhasil di-update");
    };

    const removeCartItem = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;
            const nextQty = prev[itemId] - 1;
            const next = { ...prev };
            if (nextQty <= 0) delete next[itemId];
            else next[itemId] = nextQty;
            return next;
        });
        toast.success("Item dikurangi");
    };

    const getCartCount = () =>
        Object.values(cartItems).reduce((sum, n) => sum + (Number(n) || 0), 0);

    const getCartAmount = () =>
        Math.floor(
            Object.entries(cartItems).reduce((sum, [id, qty]) => {
                const p = findProduct(id);
                return p ? sum + p.offerPrice * Number(qty || 0) : sum;
            }, 0)
        );

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));

    const syncCartToServer = async () => {
        try {
            const { data } = await axios.post("/api/cart/update", { cartItems });
            if (!data.success) toast.error(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, []);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeCartItem,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount,
        axios,
        fetchProducts,
        setCartItems,
        formatRupiah,
        syncCartToServer,
        fetchUser,
        fetchSeller,
        getStockSafe,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
