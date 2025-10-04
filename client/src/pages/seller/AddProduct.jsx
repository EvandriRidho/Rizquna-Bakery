import { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [stock, setStock] = useState("");
    const [mass, setMass] = useState("");
    const [expired, setExpired] = useState(""); 
    const [loading, setLoading] = useState(false);

    const { axios, formatRupiah } = useAppContext();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Validasi harga
        if (Number(offerPrice) > Number(price)) {
            toast.error("Harga promo tidak boleh lebih besar dari harga normal");
            return;
        }

        if (!stock || Number(stock) <= 0) {
            toast.error("Stok harus lebih dari 0");
            return;
        }

        if (!mass || Number(mass) <= 0) {
            toast.error("Massa produk harus lebih dari 0");
            return;
        }

        try {
            setLoading(true);

            const productData = {
                name,
                description: description.split("\n"),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                stock: Number(stock),
                mass: Number(mass),
                expired: expired || null, 
            };

            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }

            const { data } = await axios.post("/api/product/add", formData);
            if (data.success) {
                toast.success(data.message);
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setStock("");
                setMass("");
                setExpired("");
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                {/* Upload Gambar */}
                <div>
                    <p className="text-base font-medium">Gambar Produk</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill("").map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                    accept="image/*"
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                />
                                <img
                                    className="max-w-24 cursor-pointer"
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                    alt="uploadArea"
                                    width={100}
                                    height={100}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Nama Produk */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Nama Produk</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id="product-name"
                        type="text"
                        placeholder="Nama Produk"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Deskripsi Produk</label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id="product-description"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Deskripsi Produk"
                    ></textarea>
                </div>

                {/* Kategori */}
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Kategori</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        id="category"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                {/* Harga & Promo */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Harga</label>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            id="product-price"
                            type="number"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                        <p className="text-sm text-gray-500">{formatRupiah(price)}</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Harga Promo</label>
                        <input
                            onChange={(e) => setOfferPrice(e.target.value)}
                            value={offerPrice}
                            id="offer-price"
                            type="number"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        />
                        <p className="text-sm text-gray-500">{formatRupiah(offerPrice)}</p>
                    </div>
                </div>

                {/* Massa Produk */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="mass">Berat Produk (gram)</label>
                    <input
                        onChange={(e) => setMass(e.target.value)}
                        value={mass}
                        id="mass"
                        type="number"
                        placeholder="contoh: 250"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Tanggal Kedaluwarsa */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="expired">Tanggal Kedaluwarsa</label>
                    <input
                        onChange={(e) => setExpired(e.target.value)}
                        value={expired}
                        id="expired"
                        type="date"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                {/* Stok */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-stock">Stok Produk</label>
                    <input
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                        id="product-stock"
                        type="number"
                        placeholder="0"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className={`px-8 py-2.5 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dull"} text-white font-medium rounded`}
                >
                    {loading ? "Mengirim..." : "Tambah Produk"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
