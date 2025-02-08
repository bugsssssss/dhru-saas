import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function AddEditColorForm({ color = null, locale }) {
    const { data, setData, post, processing, errors } = useForm({
        slug: color?.slug || "",
        translations: color?.translations || [],
    });

    const [newTranslation, setNewTranslation] = useState({
        locale: "",
        name: "",
    });

    const handleTranslationChange = (locale, field, value) => {
        setData("translations", (prev) =>
            prev.map((t) =>
                t.locale === locale ? { ...t, [field]: value } : t
            )
        );
    };

    const handleAddTranslation = () => {
        const { locale, name } = newTranslation;

        if (!locale || !name) {
            alert("All fields are required to add a new language.");
            return;
        }

        if (data.translations.some((t) => t.locale === locale)) {
            alert("This language already exists.");
            return;
        }

        if (data.translations.length >= 3) {
            alert("You can only add up to 3 translations.");
            return;
        }

        setData("translations", [...data.translations, { locale, name }]);
        setNewTranslation({ locale: "", name: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const endpoint = color
            ? `/admin/colors/${color.id}/update`
            : "/admin/colors/store";

        post(endpoint, {
            onSuccess: () => {
                alert(
                    color
                        ? "Color updated successfully."
                        : "Color added successfully."
                );
                window.location.href = `/admin/colors/${color?.id || ""}`;
            },
            onError: (errors) => console.error(errors), // Debugging errors
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={color ? "Edit Color" : "Add Color"} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <h1 className="text-xl font-bold mb-6">
                                {color
                                    ? locale === "en"
                                        ? "Edit Color"
                                        : "Редактировать Цвет"
                                    : locale === "en"
                                    ? "Add New Color"
                                    : "Добавить Новый Цвет"}
                            </h1>

                            <form onSubmit={handleSubmit}>
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold">
                                        Translations
                                    </h3>
                                    {data.translations.map((t, index) => (
                                        <div key={index} className="mt-4">
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
                                            {errors[
                                                `translations.${index}.name`
                                            ] && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `translations.${index}.name`
                                                        ]
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {data.translations.length < 3 && (
                                        <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                            <h3 className="text-lg font-semibold">
                                                Add New Translation
                                            </h3>
                                            <div className="mt-4">
                                                <input
                                                    type="text"
                                                    value={
                                                        newTranslation.locale
                                                    }
                                                    onChange={(e) =>
                                                        setNewTranslation({
                                                            ...newTranslation,
                                                            locale: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="border rounded w-full px-3 py-2"
                                                    placeholder="Locale (e.g., en)"
                                                />
                                                <input
                                                    type="text"
                                                    value={newTranslation.name}
                                                    onChange={(e) =>
                                                        setNewTranslation({
                                                            ...newTranslation,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="border rounded w-full px-3 py-2 mt-2"
                                                    placeholder="Name"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddTranslation}
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Add Translation
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <br />

                                <div className="mb-4">
                                    <label
                                        htmlFor="slug"
                                        className="block text-gray-700"
                                    >
                                        {locale === "en" ? "Slug" : "Слаг"}
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    {errors.slug && (
                                        <div className="text-red-500 text-sm">
                                            {errors.slug}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        {processing
                                            ? "Processing..."
                                            : locale === "en"
                                            ? color
                                                ? "Update Color"
                                                : "Add Color"
                                            : color
                                            ? "Обновить Цвет"
                                            : "Добавить Цвет"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
