import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Products() {
    const { products, sexes, sizes } = usePage().props;
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const handleView = (id) => {
        window.location.href = `/admin/products/${id}`;
    };

    const handleAddingProduct = () => {
        window.location.href = "/admin/products/add";
    };

    const handleEdit = (id) => {
        window.location.href = `/admin/products/${id}/edit`;
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            Inertia.delete(`/admin/products/${id}`, {
                onSuccess: () => alert("Product deleted successfully."),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-bold">
                                    {locale === "en"
                                        ? "Products list"
                                        : "Список продуктов"}
                                </h1>
                                <Button onClick={() => handleAddingProduct()}>
                                    {locale === "en" ? "Add new" : "Добавить"}
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableCaption>
                                        A list of your recent products.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                ID
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Sex</TableHead>
                                            <TableHead>Sizes</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products?.map((product) => {
                                            const translation =
                                                product.translations?.find(
                                                    (t) => t.locale === locale
                                                );

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="even:bg-gray-50"
                                                >
                                                    <TableCell className="font-medium">
                                                        {product.id}
                                                    </TableCell>
                                                    <TableCell
                                                        onClick={() =>
                                                            handleView(
                                                                product.id
                                                            )
                                                        }
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        {translation?.name ||
                                                            "No translation available"}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {product.category?.sex
                                                            ?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {product.sizes
                                                            ?.map(
                                                                (size) =>
                                                                    size.name
                                                            )
                                                            .join(", ") ||
                                                            "N/A"}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {product.created_at?.substring(
                                                            0,
                                                            10
                                                        )}{" "}
                                                        {product.created_at?.substring(
                                                            11,
                                                            16
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <button
                                                            className="text-red-600 hover:underline"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </TableCell>
                                                </tr>
                                            );
                                        })}
                                        {/* <TableRow>
                                            <TableCell className="font-medium">
                                                INV001
                                            </TableCell>
                                            <TableCell>Paid</TableCell>
                                            <TableCell>Credit Card</TableCell>
                                            <TableCell className="text-right">
                                                $250.00
                                            </TableCell>
                                        </TableRow> */}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
