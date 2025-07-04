import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

// Fungsi untuk memformat Rupiah
const formatRupiah = (value) => {
    if (!value) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

const ProductCard = ({ product }) => {
    const {
        addToCart,
        updateCartItem,
        removeCartItem,
        navigate,
        cartItems
    } = useAppContext();

    return product && (
        <div
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
            }}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-58 max-w-58 w-full"
        >
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img
                    className="group-hover:scale-105 transition max-w-26 md:max-w-36"
                    src={product.image?.[0]}
                    alt={product.name}
                />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">
                    {product.name}
                </p>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {formatRupiah(product.offerPrice)}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                            {formatRupiah(product.price)}
                        </span>
                    </p>
                    <div
                        className="text-primary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!cartItems?.[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[70px] h-[34px] rounded cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product._id);
                                }}
                            >
                                <img src={assets.cart_icon} alt="cart-icon" />
                                <span className="hidden md:block">Tambah</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                    <button
                                        onClick={() => removeCartItem(product._id)}
                                        className="cursor-pointer text-md px-2 h-full"
                                    >
                                    -
                                </button>
                                    <span className="w-5 text-center">
                                        {cartItems?.[product._id] ?? 0}
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateCartItem(
                                            product._id,
                                            (cartItems?.[product._id] ?? 0) + 1
                                            )
                                        }
                                        className="cursor-pointer text-md px-2 h-full"
                                    >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
