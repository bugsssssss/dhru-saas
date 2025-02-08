import { useState, useEffect } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function Category() {
    const { category = null } = usePage().props;

    // States for category details
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );
    const [translations, setTranslations] = useState(
        category?.translations || []
    );
    const [image, setImage] = useState(null);
    const [updatedCategory, setUpdatedCategory] = useState({
        slug: category?.slug || "",
        sex: category?.sex.id || "",
    });

    // States for adding a new language
    const [newTranslation, setNewTranslation] = useState({
        locale: "",
        name: "",
        description: "",
    });

    // Get translation for the current locale
    const translation = translations.find((t) => t.locale === locale) || {};

    const handleCategoryChange = (field, value) => {
        setUpdatedCategory((prev) => ({
            ...prev,
            [field]: value,
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

    // Handle file input for the image
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Save updates to the category
    const handleSave = () => {
        const formData = new FormData();

        formData.append("slug", updatedCategory.slug);
        formData.append("sex_id", parseInt(updatedCategory.sex, 10));
        translations.forEach((translation, index) => {
            formData.append(
                `translations[${index}][locale]`,
                translation.locale
            );
            formData.append(`translations[${index}][name]`, translation.name);
            formData.append(
                `translations[${index}][description]`,
                translation.description
            );
        });

        if (image) formData.append("image", image);

        const url = category
            ? `${category.id}/update`
            : "/admin/categories/store";

        axios
            .post(url, formData)
            .then(() => alert("Category saved successfully"))
            .catch((error) => console.error("Error saving category:", error));
    };

    // Delete category confirmation
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            Inertia.delete(`/admin/categories/${id}`, {
                onSuccess: () => alert("Category deleted successfully."),
            });
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Category Info" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <h1 className="text-xl font-bold">
                                {locale === "en"
                                    ? "Category Info"
                                    : "Категория"}
                            </h1>
                            {/* Translations */}
                            <div className="mt-6">
                                <h2 className="text-lg font-bold">
                                    Translations
                                </h2>
                                {translations.map((t) => (
                                    <div key={t.locale} className="mb-4">
                                        <h3 className="text-sm font-semibold">
                                            {t.locale.toUpperCase()}
                                        </h3>
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
                                            placeholder="Name"
                                        />
                                        <textarea
                                            value={t.description}
                                            onChange={(e) =>
                                                handleTranslationChange(
                                                    t.locale,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded w-full px-3 py-2 mt-2"
                                            placeholder="Description"
                                        />
                                    </div>
                                ))}
                            </div>
                            {translations.length < 3 && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                    <h2 className="text-lg font-bold">
                                        Add New Language
                                    </h2>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newTranslation.locale}
                                            onChange={(e) =>
                                                setNewTranslation((prev) => ({
                                                    ...prev,
                                                    locale: e.target.value,
                                                }))
                                            }
                                            className="border rounded px-3 py-2 w-full"
                                            placeholder="Locale (e.g., en)"
                                        />
                                        <input
                                            type="text"
                                            value={newTranslation.name}
                                            onChange={(e) =>
                                                setNewTranslation((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="border rounded px-3 py-2 w-full"
                                            placeholder="Name"
                                        />
                                        <textarea
                                            value={newTranslation.description}
                                            onChange={(e) =>
                                                setNewTranslation((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            className="border rounded px-3 py-2 w-full"
                                            placeholder="Description"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddTranslation}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Add Language
                                    </button>
                                </div>
                            )}

                            {/* Basic Category Info */}
                            <div className="mt-4">
                                <label>Slug:</label>
                                <input
                                    type="text"
                                    value={updatedCategory.slug}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            "slug",
                                            e.target.value
                                        )
                                    }
                                    className="border rounded w-full px-3 py-2"
                                />
                            </div>

                            <div className="mt-4">
                                <label>Sex:</label>
                                <select
                                    value={updatedCategory.sex}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            "sex",
                                            e.target.value
                                        )
                                    }
                                    className="border rounded w-full px-3 py-2"
                                >
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="mt-4">
                                <label>Edit Image:</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="border rounded w-full px-3 py-2"
                                />
                                {category?.image_path && (
                                    <img
                                        src={`http://127.0.0.1:8080/storage/${category.image_path}`}
                                        alt="Category"
                                        className="mt-4 w-32 h-32 object-cover"
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                {category && (
                                    <button
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                )}
                                <Link
                                    href="/admin/categories"
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
