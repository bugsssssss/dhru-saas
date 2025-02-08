import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Link } from "@inertiajs/react";

const ClientDetail = ({ client }) => {
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const handleOrderView = (id) => {
        window.location.href = `/admin/orders/${id}`;
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="container mx-auto p-4">
                                <h1 className="text-2xl font-semibold mb-4">
                                    Client #{client.id} Information
                                </h1>

                                <div className="mb-4">
                                    <p>
                                        <strong>ID:</strong> {client.id}
                                    </p>
                                    <p>
                                        <strong>Name:</strong> {client.name}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {client.phone_number}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {client.email}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong>{" "}
                                        {client.created_at.substring(0, 10)} |{" "}
                                        {client.created_at.substring(11, 16)}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Orders history
                                    </h2>
                                    <table className="min-w-full text-center border-collapse border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    ID
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Client ID
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Total Price
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Status
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Payment Status
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Created At
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {client.orders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="even:bg-gray-50"
                                                >
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.id}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.client_id}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.total_price}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.status}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.payment_status ===
                                                        "paid" ? (
                                                            <td className="text-green-500 border-gray-200 px-4 py-2">
                                                                {
                                                                    order.payment_status
                                                                }
                                                            </td>
                                                        ) : (
                                                            <td className="text-red-500 border-gray-200 px-4 py-2 ">
                                                                {
                                                                    order.payment_status
                                                                }
                                                            </td>
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {order.created_at.substring(
                                                            0,
                                                            10
                                                        )}{" "}
                                                        |{" "}
                                                        {order.created_at.substring(
                                                            11,
                                                            16
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        <button
                                                            className="text-blue-600 hover:underline mr-4"
                                                            onClick={() =>
                                                                handleOrderView(
                                                                    order.id
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:underline"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    order.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ClientDetail;
