import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";

const Orders = () => {
    const { currency } = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        setOrders(dummyOrders);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Daftar Order</h2>
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-start gap-6 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
                    >
                        {/* Kolom 1: Produk */}
                        <div className="flex gap-4 w-full md:w-[220px]">
                            <img
                                className="w-12 h-12 object-cover"
                                src={assets.box_icon}
                                alt="boxIcon"
                            />
                            <div className="space-y-1">
                                {order.items.map((item, i) => (
                                    <p key={i} className="font-medium text-sm md:text-base">
                                        {item.product.name}{" "}
                                        <span className="text-primary">x {item.quantity}</span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Kolom 2: Alamat */}
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

                        {/* Kolom 3: Harga */}
                        <div className="w-full md:w-[80px] text-left md:text-center">
                            <p className="font-medium text-lg text-black/80">
                                {currency}
                                {order.amount}
                            </p>
                        </div>

                        {/* Kolom 4: Info Pembayaran */}
                        <div className="flex flex-col text-sm md:text-base text-black/60 w-full md:w-[220px] space-y-0.5">
                            <p>Metode Pembayaran: {order.paymentType}</p>
                            <p>
                                Tanggal: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                Status Pembayaran:{" "}
                                {order.isPaid ? "Selesai" : "Menunggu Pembayaran"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
