import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
    const { products, axios, fetchProducts, formatRupiah } = useAppContext();
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: "", category: "", offerPrice: 0, stock: 0 });

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

    const handleEditClick = (product) => {
        setEditingProduct(product._id);
        setForm({
            name: product.name,
            category: product.category,
            offerPrice: product.offerPrice,
            stock: product.stock
        });
    };

    const handleSave = async (id) => {
        try {
            const { data } = await axios.put(`/api/product/update/${id}`, form);
            if (data.success) {
                toast.success("Produk berhasil diperbarui");
                fetchProducts();
                setEditingProduct(null);
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
                                <th className="px-4 py-3">Produk</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3 hidden md:block">Harga Jual</th>
                                <th className="px-4 py-3">Jumlah Stok</th>
                                <th className="px-4 py-3">Ketersediaan</th>
                                <th className="px-4 py-3">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 flex items-center space-x-3 truncate">
                                            <img
                                                src={product.image?.[0] || "/placeholder.png"}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            {editingProduct === product._id ? (
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                <span>{product.name}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {editingProduct === product._id ? (
                                                <select
                                                    value={form.category}
                                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                    className="border px-2 py-1 rounded w-full"
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    <option value="roti">roti</option>
                                                    <option value="brownies">brownies</option>
                                                    <option value="donat">donat</option>
                                                    <option value="puding">puding</option>
                                                    <option value="anekabolu">anekabolu</option>
                                                </select>
                                            ) : (
                                                product.category
                                            )}

                                        </td>
                                        <td className="px-4 py-3 max-sm:hidden">
                                            {editingProduct === product._id ? (
                                                <input
                                                    type="number"
                                                    value={form.offerPrice}
                                                    onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                formatRupiah(product.offerPrice)
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {editingProduct === product._id ? (
                                                <input
                                                    type="number"
                                                    value={form.stock}
                                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                                    className="border px-2 py-1 rounded w-20"
                                                />
                                            ) : (
                                                product.stock ?? 0
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    onChange={() => toggleStock(product._id, !product.inStock)}
                                                    checked={product.inStock}
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    disabled={editingProduct === product._id}
                                                />
                                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary"></div>
                                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                            </label>
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            {editingProduct === product._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(product._id)}
                                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dull"
                                                    >
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingProduct(null)}
                                                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                    >
                                                        Batal
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dull"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-400">
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
