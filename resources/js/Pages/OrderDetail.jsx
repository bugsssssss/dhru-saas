import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Link } from "@inertiajs/react";

const OrderDetail = ({ order }) => {
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="container mx-auto p-4">
                                <h1 className="text-2xl font-semibold mb-4">
                                    Order #{order.id} Details
                                </h1>

                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Client Information
                                    </h2>
                                    <p>
                                        <strong>ID:</strong> {order.client_id}
                                    </p>
                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {order.client.name}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {order.client.phone_number}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Ordered Items
                                    </h2>
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Product ID
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Product Name
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Quantity
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Unit Price
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Total Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => {
                                                const translation =
                                                    item.product.translations?.find(
                                                        (t) =>
                                                            t.locale === locale
                                                    );

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="even:bg-gray-50 text-center"
                                                    >
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            {item.product.id}
                                                        </td>
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            <Link
                                                                href={`/admin/products/${item.product.id}`}
                                                                className="text-blue-500"
                                                            >
                                                                {
                                                                    translation?.name
                                                                }
                                                            </Link>
                                                        </td>
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            $
                                                            {item.product.price}
                                                        </td>
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            $
                                                            {item.quantity *
                                                                item.product
                                                                    .price}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">
                                        Total Price:{" "}
                                    </h2>
                                    <p className="text-lg font-bold">
                                        ${order.total_price}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">
                                        Order Status
                                    </h2>
                                    <select
                                        name="status"
                                        id="status"
                                        defaultValue={order.status}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">
                                            Delivered
                                        </option>
                                        <option value="canceled">
                                            Canceled
                                        </option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">
                                        Payment status
                                    </h2>
                                    {/* <select name="status" id="status" defaultValue={order.payment_status}>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="returned">Returned</option>
                </select> */}
                                    {order.payment_status === "paid" ? (
                                        <p className="text-green-500">
                                            {order.payment_status}
                                        </p>
                                    ) : (
                                        <p className="text-red-500">
                                            {order.payment_status}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">
                                        Created At
                                    </h2>
                                    <p>
                                        {order.created_at.substring(0, 10)} |{" "}
                                        {order.created_at.substring(11, 16)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default OrderDetail;
