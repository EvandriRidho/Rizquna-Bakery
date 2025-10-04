import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
    const { axios, formatRupiah } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const updateStatus = async (id, status, paymentType, currentStatus) => {
        if (currentStatus === "Selesai") {
            toast.error("Pesanan sudah selesai dan tidak bisa diubah lagi");
            return;
        }

        try {
            setUpdatingId(id);

            const payload = { status };

            if (status === "Selesai" && paymentType?.toLowerCase() === "cod") {
                payload.isPaid = true;
            }

            const { data } = await axios.patch(`/api/order/${id}/status`, payload);
            if (data.success) {
                toast.success("Status pesanan diperbarui");
                fetchOrders(); // refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Daftar Order</h2>

                {orders.length === 0 && (
                    <p className="text-gray-500 text-sm">Belum ada pesanan.</p>
                )}

                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="flex flex-col md:flex-row md:items-start gap-6 justify-between p-5 max-w-4xl rounded-md border border-gray-300 bg-white"
                    >
                        {/* 🧱 Kolom 1: Produk */}
                        <div className="flex gap-4 w-full md:w-[220px]">
                            <img
                                className="w-12 h-12 object-cover"
                                src={assets.box_icons_edit}
                                alt="boxIcon"
                            />
                            <div className="space-y-1">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm md:text-base">
                                        <p className="font-medium">
                                            {item.product?.name || "Produk dihapus"}{" "}
                                            <span className="text-primary">x {item.quantity}</span>
                                        </p>

                                        {item.product?.mass && (
                                            <p className="text-gray-500 text-xs">
                                                Berat: {item.product.mass} gram
                                            </p>
                                        )}

                                        {item.product?.expired && (
                                            <p
                                                className={`text-xs ${new Date(item.product.expired) < new Date()
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                Kedaluwarsa:{" "}
                                                {new Date(item.product.expired).toLocaleDateString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 📦 Kolom 2: Alamat */}
                        <div className="text-sm md:text-base text-black/60 w-full md:w-[220px] space-y-0.5">
                            <p className="text-black/80">
                                {order.address.firstName} {order.address.lastName}
                            </p>
                            <p>
                                {order.address.street}, {order.address.city}
                            </p>
                            <p>
                                {order.address.state}, {order.address.zipcode},{" "}
                                {order.address.country}
                            </p>
                            <p>{order.address.phone}</p>
                        </div>

                        {/* 💰 Kolom 3: Harga */}
                        <div className="w-full md:w-[80px] text-left md:text-center">
                            <p className="font-medium text-lg text-primary">
                                {formatRupiah(order.amount)}
                            </p>
                        </div>

                        {/* 💳 Kolom 4: Info Pembayaran */}
                        <div className="flex flex-col text-sm md:text-base text-black/60 w-full md:w-[220px] space-y-0.5">
                            <p>Metode Pembayaran: {order.paymentType}</p>
                            <p>
                                Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID")}
                            </p>
                            <p>
                                Status Pembayaran:{" "}
                                <span
                                    className={`font-medium ${order.isPaid ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {order.isPaid ? "Selesai" : "Belum Dibayar"}
                                </span>
                            </p>
                        </div>

                        {/* 🚚 Kolom 5: Status Order */}
                        <div className="flex flex-col w-full md:w-[220px]">
                            <label className="text-sm font-medium mb-2">Status</label>
                            <select
                                value={order.status}
                                disabled={updatingId === order._id}
                                onChange={(e) =>
                                    updateStatus(
                                        order._id,
                                        e.target.value,
                                        order.paymentType,
                                        order.status
                                    )
                                }
                                className={`border rounded p-2 text-sm transition-all duration-200 ${order.status === "Selesai"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : order.status === "Sedang Dikirim"
                                        ? "border-blue-400 bg-blue-50 text-blue-700"
                                        : order.status === "Sedang Dikemas"
                                            ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                                            : "border-gray-300 bg-gray-50"
                                    } ${updatingId === order._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <option value="Sedang Diproses">Sedang Diproses</option>
                                <option value="Sedang Dikemas">Sedang Dikemas</option>
                                <option value="Sedang Dikirim">Sedang Dikirim</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
