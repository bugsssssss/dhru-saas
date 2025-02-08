import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";

export default function Orders() {
    const { colors } = usePage().props;
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const handleView = (id) => {
        window.location.href = `/admin/colors/${id}`;
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/colors/${id}/edit`;
    };

    const handleAddingColor = () => {
        window.location.href = "/admin/colors/add";
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this color?")) {
            Inertia.delete(`/admin/colors/${id}`, {
                onSuccess: () => alert("Color deleted successfully."),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Colors" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold">
                                    {locale === "en" ? "Colors" : "Цвета"}
                                </h1>
                                <button
                                    onClick={() => handleAddingColor()}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {locale === "en" ? "Add new" : "Добавить"}
                                </button>
                            </div>
                            <br />
                            <br />
                            <table className="min-w-full border-collapse border border-gray-200 text-center">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-200 px-4 py-2">
                                            ID
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2">
                                            Name
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2">
                                            Slug
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
                                    {colors.map((color) => {
                                        const translation =
                                            color.translations?.find(
                                                (t) => t.locale === locale
                                            );

                                        return (
                                            <tr
                                                key={color.id}
                                                className="even:bg-gray-50"
                                            >
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {color.id}
                                                </td>
                                                <td
                                                    onClick={() => {
                                                        handleView(color.id);
                                                    }}
                                                    className="border border-gray-200 px-4 py-2 text-blue-600 hover:underline mr-4"
                                                >
                                                    {translation?.name}
                                                </td>
                                                <td>{color.slug}</td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {/* {color.created_at.substring(
                                                    0,
                                                    10
                                                )}{" "}
                                                |{" "}
                                                {color.created_at.substring(
                                                    11,
                                                    16
                                                )} */}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    <button
                                                        className="text-red-600 hover:underline"
                                                        onClick={() =>
                                                            handleDelete(
                                                                color.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
