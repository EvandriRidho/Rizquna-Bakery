import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "./ProductCard";

// Fungsi formatter Rupiah
const formatRupiah = (value) => {
    if (!value) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0) {
            let productCopy = products.slice();
            productCopy = productCopy.filter((item) => product.category === item.category);
            setRelatedProducts(productCopy.slice(0, 5));
        }
    }, [products])

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product]);

    return product && (
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

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img
                                key={i}
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                                alt="star"
                                className="md:w-4 w-3.5"
                            />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

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

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button
                            onClick={() => addToCart(product._id)}
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Masukkan Ke Keranjang
                        </button>
                        <button
                            onClick={() => {
                                addToCart(product._id);
                                navigate('/cart');
                            }}
                            className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>
            {/* Realated Products */}
            <div className="flex flex-col mt-20 items-center">
                <div className="flex flex-col items-start w-max md:items-end">
                    <p className="text-3xl font-medium">Produk Terkait</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                        {
                            relatedProducts.filter((product) => product.inStock).map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))
                        }
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
    );
};

export default ProductDetails;
