import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
    const {
        products,
        navigate,
        addToCart,
        updateCartItem,
        cartItems,
        formatRupiah,
        getStockSafe,
    } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [qty, setQty] = useState(1);

    const product = useMemo(
        () => products.find((item) => item._id === id),
        [products, id]
    );

    const stock = getStockSafe(id);
    const outOfStock = !product?.inStock || stock <= 0;

    useEffect(() => {
        if (products.length > 0 && product) {
            const productCopy = products
                .filter((item) => product.category === item.category && item._id !== id)
                .slice(0, 5);
            setRelatedProducts(productCopy);
        }
    }, [products, product, id]);

    useEffect(() => {
        setThumbnail(product?.image?.[0] || null);
    }, [product]);

    useEffect(() => {
        // reset qty to 1 when product changes
        setQty(1);
    }, [id]);

    const addWithQty = () => {
        if (outOfStock) return toast.error("Barang tidak tersedia / habis");
        if (qty < 1) return toast.error("Minimal 1");
        if (qty > stock) {
            setQty(stock);
            return toast.error(`Maksimal ${stock}`);
        }

        const current = cartItems?.[id] || 0;
        const target = Math.min(stock, current + qty);
        if (target === current) {
            return toast.error(`Maksimal ${stock}`);
        }
        updateCartItem(id, target);
        toast.success("Ditambahkan ke keranjang");
    };

    return product ? (
        <div className="mt-16">
            <p>
                <Link to="/">Beranda</Link> /
                <Link to="/products"> Produk</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                            >
                                <img src={image} alt={`thumbail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden relative">
                        {outOfStock && (
                            <span className="absolute top-3 left-3 z-10 text-xs px-2 py-0.5 rounded bg-red-500 text-white">
                                Stok Habis
                            </span>
                        )}
                        {!outOfStock && (
                            <span className="absolute top-3 left-3 z-10 text-xs px-2 py-0.5 rounded bg-primary text-white">
                                Stok: {stock}
                            </span>
                        )}
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">
                            Harga: {formatRupiah(product.price)}
                        </p>
                        <p className="text-2xl font-medium">
                            Harga: {formatRupiah(product.offerPrice)}
                        </p>
                        <span className="text-gray-500/70">(Bebas Pajak)</span>
                    </div>

                    <p className="text-base font-medium mt-6">Tentang Produk</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {/* Qty picker */}
                    <div className="mt-8 flex items-center gap-3">
                        <label className="text-sm">Jumlah</label>
                        <input
                            type="number"
                            min={1}
                            max={Math.max(1, stock)}
                            value={qty}
                            onChange={(e) => {
                                const v = Number(e.target.value || 1);
                                if (v < 1) setQty(1);
                                else if (v > stock) setQty(stock);
                                else setQty(v);
                            }}
                            className="w-20 border border-gray-300 rounded px-3 py-2"
                            disabled={outOfStock}
                        />
                        {outOfStock ? (
                            <span className="text-red-500 text-sm">Tidak tersedia</span>
                        ) : (
                            <span className="text-gray-500 text-sm">Sisa stok: {stock}</span>
                        )}
                    </div>

                    <div className="flex items-center mt-6 gap-4 text-base">
                        <button
                            disabled={outOfStock}
                            onClick={addWithQty}
                            className={`w-full py-3.5 cursor-pointer font-medium transition ${outOfStock
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-800/80 hover:bg-gray-200"
                                }`}
                        >
                            Masukkan Ke Keranjang
                        </button>
                        <button
                            disabled={outOfStock}
                            onClick={() => {
                                addWithQty();
                                if (!outOfStock) navigate("/cart");
                            }}
                            className={`w-full py-3.5 cursor-pointer font-medium text-white transition ${outOfStock
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dull"
                                }`}
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>

            {/* Related */}
            <div className="flex flex-col mt-20 items-center">
                <div className="flex flex-col items-start w-max md:items-end">
                    <p className="text-3xl font-medium">Produk Terkait</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                        {relatedProducts
                            .filter((p) => p.inStock)
                            .map((p, index) => (
                                <ProductCard key={index} product={p} />
                            ))}
                    </div>
                    <button
                        className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary-dull/10 transition"
                        onClick={() => {
                            navigate(`/products`);
                            scrollTo(0, 0);
                        }}
                    >
                        Lihat Semua
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default ProductDetails;
