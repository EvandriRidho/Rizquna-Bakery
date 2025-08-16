import { useAppContext } from "../context/AppContext";
import { CiShoppingCart } from "react-icons/ci";

const ProductCard = ({ product }) => {
    const {
        addToCart,
        updateCartItem,
        removeCartItem,
        navigate,
        cartItems,
        formatRupiah,
        getStockSafe,
    } = useAppContext();

    if (!product) return null;
    const currentQty = cartItems?.[product._id] ?? 0;
    const stock = getStockSafe(product._id);
    const outOfStock = !product.inStock || stock <= 0;

    return (
        <div
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
            }}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-58 max-w-58 w-full"
        >
            <div className="group cursor-pointer flex items-center justify-center px-2 relative">
                {outOfStock && (
                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded bg-red-500 text-white">
                        Habis
                    </span>
                )}
                {!outOfStock && (
                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded bg-primary text-white">
                        Stok: {stock}
                    </span>
                )}
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
                                disabled={outOfStock}
                                className={`flex items-center justify-center gap-1 md:w-[80px] w-[70px] h-[34px] rounded cursor-pointer border ${outOfStock
                                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "bg-primary/10 border-primary/40"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!outOfStock) addToCart(product._id);
                                }}
                            >
                                <CiShoppingCart />
                                <span className="hidden md:block">
                                    {outOfStock ? "Habis" : "Tambah"}
                                </span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                    <button
                                        onClick={() => removeCartItem(product._id)}
                                        className="cursor-pointer text-md px-2 h-full"
                                    >
                                    -
                                </button>
                                    <span className="w-5 text-center">{currentQty}</span>
                                    <button
                                        disabled={currentQty >= stock}
                                        onClick={() =>
                                        updateCartItem(product._id, currentQty + 1)
                                    }
                                        className={`cursor-pointer text-md px-2 h-full ${currentQty >= stock ? "opacity-40 cursor-not-allowed" : ""
                                            }`}
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
