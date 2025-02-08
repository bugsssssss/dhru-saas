import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Orders() {
    const { orders } = usePage().props;
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const handleView = (id) => {
        window.location.href = `/admin/products/${id}`;
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/products/${id}/edit`;
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this order?")) {
            Inertia.delete(`/admin/orders/${id}`, {
                onSuccess: () => alert("Order deleted successfully."),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <h1 className="text-xl font-bold">
                                {locale === "en"
                                    ? "Orders list"
                                    : "Список заказов"}
                            </h1>
                            <br />
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-200 text-center">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border border-gray-200 px-4 py-2">
                                                ID
                                            </th>
                                            <th className="border border-gray-200 px-4 py-2">
                                                Client ID
                                            </th>
                                            <th className="border border-gray-200 px-4 py-2">
                                                Total price
                                            </th>
                                            <th className="border border-gray-200 px-4 py-2">
                                                Status
                                            </th>
                                            <th className="border border-gray-200 px-4 py-2">
                                                Payment status
                                            </th>
                                            <td className="border border-gray-200 px-4 py-2">
                                                Created At
                                            </td>
                                            <th className="border border-gray-200 px-4 py-2">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
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
                                                {order.payment_status ===
                                                "paid" ? (
                                                    <td className="border border-gray-200 text-green-500">
                                                        {order.payment_status}
                                                    </td>
                                                ) : (
                                                    <td className="border border-gray-200 text-red-500">
                                                        {order.payment_status}
                                                    </td>
                                                )}
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
                                                    <Link
                                                        href={`orders/${order.id}`}
                                                        className="text-blue-600 hover:underline mr-4"
                                                    >
                                                        View
                                                    </Link>
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
        </AuthenticatedLayout>
    );
}
