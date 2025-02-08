import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";

export default function Orders() {
    const { categories } = usePage().props;
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const handleView = (id) => {
        window.location.href = `/admin/categories/${id}`;
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/categories/${id}/edit`;
    };

    const handleAddingCategory = () => {
        window.location.href = "/admin/categories/add";
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            Inertia.delete(`/admin/categories/${id}`, {
                onSuccess: () => alert("Category deleted successfully."),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold">
                                    {locale === "en"
                                        ? "Categories"
                                        : "Категории"}
                                </h1>

                                <Button onClick={() => handleAddingCategory()}>
                                    {locale === "en" ? "Add new" : "Добавить"}
                                </Button>
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
                                    {categories.map((category) => {
                                        const translation =
                                            category.translations?.find(
                                                (t) => t.locale === locale
                                            );

                                        return (
                                            <tr
                                                key={category.id}
                                                className="even:bg-gray-50"
                                            >
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {category.id}
                                                </td>
                                                <td
                                                    onClick={() => {
                                                        handleView(category.id);
                                                    }}
                                                    className="border border-gray-200 px-4 py-2 text-blue-600 hover:underline mr-4"
                                                >
                                                    {translation?.name}
                                                </td>
                                                <td>{category.slug}</td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {/* {category.created_at.substring(
                                                    0,
                                                    10
                                                )}{" "}
                                                |{" "}
                                                {category.created_at.substring(
                                                    11,
                                                    16
                                                )} */}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    <button
                                                        className="text-red-600 hover:underline"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
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
