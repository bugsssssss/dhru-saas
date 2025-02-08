import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard() {
    const { callbacks } = usePage().props;

    const handleView = (id) => {
        window.location.href = `/admin/clients/${id}`;
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            Inertia.delete(`clients/delete/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <h1 className="text-xl font-bold">Заявки</h1>
                            <br />
                            <div className="overflow-x-auto">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    ID
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Name
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Phone
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Text
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Created At
                                                </th>
                                                <th className="border border-gray-200 px-4 py-2 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {callbacks.map((callback) => (
                                                <tr
                                                    key={callback.id}
                                                    className="even:bg-gray-50"
                                                >
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {callback.id}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {callback.name}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {callback.phone_number}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {callback.text}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {callback.created_at.substring(
                                                            0,
                                                            10
                                                        )}{" "}
                                                        |{" "}
                                                        {callback.created_at.substring(
                                                            11,
                                                            16
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {/* <button
                                                        className="text-blue-600 hover:underline mr-4"
                                                        onClick={() => handleView(callback.id)}
                                                    >
                                                        View
                                                    </button> */}
                                                        <button
                                                            className="text-red-600 hover:underline"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    callback.id
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
}
