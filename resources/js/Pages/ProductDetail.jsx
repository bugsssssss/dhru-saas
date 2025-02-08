import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { usePage, Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function ProductForm({
    product = null,
    categories,
    colors,
    sizes,
}) {
    const [productData, setProductData] = useState({
        category_id: product?.category_id || "",
        color_id: product?.color_id || "",
        price: product?.price || "",
        stock_quantity: product?.stock_quantity || "",
    });
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );
    const [translations, setTranslations] = useState(
        product?.translations || []
    );
    const [sizesSelected, setSizesSelected] = useState(product?.sizes || []);
    const [imageFiles, setImageFiles] = useState([]);
    const [newTranslation, setNewTranslation] = useState({
        locale: "",
        name: "",
        description: "",
    });

    // Handle changes to product fields
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle translation changes
    const handleTranslationChange = (locale, field, value) => {
        setTranslations((prev) =>
            prev.map((t) =>
                t.locale === locale ? { ...t, [field]: value } : t
            )
        );
    };

    // Add a new translation
    const handleAddTranslation = () => {
        const { locale, name, description } = newTranslation;

        if (!locale || !name || !description) {
            alert("All fields are required to add a new language.");
            return;
        }

        // Avoid duplicate locales
        if (translations.some((t) => t.locale === locale)) {
            alert("This language already exists.");
            return;
        }

        setTranslations((prev) => [...prev, { locale, name, description }]);

        // Reset form for adding new translation
        setNewTranslation({ locale: "", name: "", description: "" });
    };

    // Handle size selection changes
    const handleSizeChange = (e) => {
        const { value } = e.target;
        setSizesSelected((prev) =>
            prev.includes(value)
                ? prev.filter((size) => size !== value)
                : [...prev, value]
        );
    };

    // Handle file input for images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        setImageFiles((prevFiles) => [...prevFiles, ...files]); // Append new files to existing files
    };

    // Display selected image file names (optional, for user feedback)
    const renderImagePreview = () => {
        return imageFiles.map((file, index) => (
            <div key={index} className="mt-2">
                <img
                    src={URL.createObjectURL(file)} // Create a temporary URL for the file
                    alt={`Image Preview ${index + 1}`}
                    className="w-32 h-32 object-cover"
                />
                <span className="ml-2">{file.name}</span>
            </div>
        ));
    };

    const handleImageDelete = (id) => {
        // const { value } = e.target;
        // setImageFiles((prevFiles) =>
        //     prevFiles.filter((file) => file.name !== value)
        // );
        Inertia.delete("images/" + id, {
            onSuccess: () => alert("Product deleted successfully."),
        });
        // Remove corresponding image from the product's images array
    };

    // Render existing images
    const renderExistingImages = () => {
        if (product?.images?.length > 0) {
            return product.images.map((image, index) => (
                <div key={index} className="mt-2">
                    <img
                        src={`http://127.0.0.1:8080/storage/${image.image_path}`}
                        alt={`Product Image ${index + 1}`}
                        className="w-32 h-32 object-cover"
                    />
                    <span className="ml-2">{image.name}</span>
                    <button onClick={() => handleImageDelete(image.id)}>
                        Delete
                    </button>
                </div>
            ));
        }
        return null;
    };

    // Save or update product
    const handleSave = () => {
        const formData = new FormData();
        formData.append("category_id", productData.category_id);
        formData.append("color_id", productData.color_id);
        formData.append("price", productData.price);
        formData.append("stock_quantity", productData.stock_quantity);
        formData.append("translations", JSON.stringify(translations));
        formData.append("sizes", JSON.stringify(sizesSelected));

        // Add images to formData
        imageFiles.forEach((file) => {
            formData.append("images[]", file);
        });

        const url = product
            ? `/products/${product.id}/update`
            : "/products/store";
        axios
            .post(url, formData)
            .then(() => alert("Product saved successfully"))
            .catch((error) => console.error("Error saving product:", error));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Category Info" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <div className="container mx-auto p-6">
                                <h1 className="text-2xl font-bold">
                                    {product ? "Edit Product" : "New Product"}
                                </h1>

                                {/* Translations */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold">
                                        Translations
                                    </h3>
                                    {translations.map((t) => (
                                        <div key={t.locale} className="mt-4">
                                            <label>
                                                {t.locale.toUpperCase()}:
                                            </label>
                                            <input
                                                type="text"
                                                value={t.name}
                                                onChange={(e) =>
                                                    handleTranslationChange(
                                                        t.locale,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded w-full px-3 py-2"
                                            />
                                            <label className="mt-2">
                                                Description:
                                            </label>
                                            <textarea
                                                value={t.description}
                                                onChange={(e) =>
                                                    handleTranslationChange(
                                                        t.locale,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded w-full px-3 py-2"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Translation */}
                                {translations.length < 3 ? (
                                    <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                        <h3 className="text-lg font-semibold">
                                            Add New Translation
                                        </h3>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                value={newTranslation.locale}
                                                onChange={(e) =>
                                                    setNewTranslation(
                                                        (prev) => ({
                                                            ...prev,
                                                            locale: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                className="border rounded w-full px-3 py-2"
                                                placeholder="Locale (e.g., en)"
                                            />
                                            <input
                                                type="text"
                                                value={newTranslation.name}
                                                onChange={(e) =>
                                                    setNewTranslation(
                                                        (prev) => ({
                                                            ...prev,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                className="border rounded w-full px-3 py-2 mt-2"
                                                placeholder="Name"
                                            />
                                            <textarea
                                                value={
                                                    newTranslation.description
                                                }
                                                onChange={(e) =>
                                                    setNewTranslation(
                                                        (prev) => ({
                                                            ...prev,
                                                            description:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                className="border rounded w-full px-3 py-2 mt-2"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddTranslation}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Add Translation
                                        </button>
                                    </div>
                                ) : (
                                    <div></div>
                                )}

                                {/* Product Information */}
                                <div className="mt-6">
                                    <label>Category:</label>
                                    <select
                                        name="category_id"
                                        value={productData.category_id}
                                        onChange={handleProductChange}
                                        className="border rounded w-full px-3 py-2"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((category) => {
                                            const translation =
                                                category.translations?.find(
                                                    (t) => t.locale === locale
                                                );
                                            return (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {translation?.name ||
                                                        category.slug}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="mt-6">
                                    <label>Color:</label>
                                    <select
                                        name="color_id"
                                        value={productData.color_id}
                                        onChange={handleProductChange}
                                        className="border rounded w-full px-3 py-2"
                                    >
                                        <option value="">Select Color</option>
                                        {colors.map((color) => {
                                            const translation =
                                                color.translations?.find(
                                                    (t) => t.locale === locale
                                                );
                                            return (
                                                <option
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {translation?.name ||
                                                        color.slug}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="mt-6">
                                    <label>Price:</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleProductChange}
                                        className="border rounded w-full px-3 py-2"
                                        placeholder="Price"
                                    />
                                </div>

                                <div className="mt-6">
                                    <label>Stock Quantity:</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={productData.stock_quantity}
                                        onChange={handleProductChange}
                                        className="border rounded w-full px-3 py-2"
                                        placeholder="Stock Quantity"
                                    />
                                </div>

                                {/* Product Sizes */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold">
                                        Select Sizes
                                    </h3>
                                    {sizes.map((size) => (
                                        <label
                                            key={size.id}
                                            className="block mt-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={size.id}
                                                checked={sizesSelected.includes(
                                                    size.id
                                                )}
                                                onChange={handleSizeChange}
                                                className="mr-2"
                                            />
                                            {size.name}
                                        </label>
                                    ))}
                                </div>

                                {/* Existing Images */}
                                {product && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold">
                                            Existing Images
                                        </h3>
                                        {renderExistingImages()}
                                    </div>
                                )}

                                <div className="mt-6">
                                    <label>Add new images:</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        className="border rounded w-full px-3 py-2"
                                    />
                                    {renderImagePreview()}{" "}
                                    {/* Preview the selected image files */}
                                </div>

                                {/* Save/Cancel Buttons */}
                                <div className="mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Save Product
                                    </button>
                                    <Link
                                        href="/products"
                                        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
