import { useState, useEffect } from "react";

export default function localeSwitcher() {
    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "en"
    );

    const changeLocale = (locale) => {
        setLocale(locale);
        localStorage.setItem("locale", lang);
        // Optionally trigger a re-fetch or re-render logic
    };

    const handleLanguageChange = (lang) => {
        setLocale(lang);
        localStorage.setItem("locale", lang);
        // Optionally trigger an API call or page reload
        window.location.reload(); // To fetch localized data
    };

    useEffect(() => {
        // Optional: Set a header or make a request to update backend preference
        console.log("Language switched to:", locale);
    }, [locale]);

    const [showingDropdown, setShowingDropdown] = useState(false);

    return (
        <div className="relative">
            <button
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 shadow-sm hover:text-gray-700"
                onClick={() => setShowingDropdown(!showingDropdown)}
            >
                Language: {locale.toUpperCase()}
            </button>
            {showingDropdown && (
                <div className="absolute right-0 mt-2 w-32 rounded-md bg-white shadow-lg">
                    <ul className="py-1">
                        {["en", "ru", "uz"].map((lang) => (
                            <li
                                key={lang}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleLanguageChange(lang)}
                            >
                                {lang.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
