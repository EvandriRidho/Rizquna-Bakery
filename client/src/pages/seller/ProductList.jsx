import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
    const { products, axios, fetchProducts, formatRupiah } = useAppContext();

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.put("/api/product/stock", { id, inStock });

            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Semua Produk</h2>

                <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Produk</th>
                                <th className="px-4 py-3 font-semibold truncate">Kategori</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Harga Jual</th>
                                <th className="px-4 py-3 font-semibold truncate">Jumlah Stok</th>
                                <th className="px-4 py-3 font-semibold truncate">Ketersediaan</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                            <div className="border border-gray-300 rounded p-2 bg-white">
                                                <img
                                                    src={product.image?.[0] || "/placeholder.png"}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            </div>
                                            <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 max-sm:hidden">
                                            {formatRupiah(product.offerPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-left">
                                            {product.stock ?? 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    onChange={() => toggleStock(product._id, !product.inStock)}
                                                    checked={product.inStock}
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        Tidak ada produk
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
