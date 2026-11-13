(() => {
    const page = document.body;
    const languageButtons = document.querySelectorAll("[data-language-toggle]");
    const translations = document.querySelectorAll("[data-ar][data-en]");
    const labels = document.querySelectorAll("[data-ar-label][data-en-label]");
    const placeholders = document.querySelectorAll("[data-placeholder-ar][data-placeholder-en]");
    const backToTop = document.createElement("button");

    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "العودة إلى الأعلى");
    backToTop.setAttribute("aria-hidden", "true");
    backToTop.tabIndex = -1;
    document.body.append(backToTop);

    function setLanguage(language, persist = true) {
        const activeLanguage = language === "en" ? "en" : "ar";
        const isEnglish = activeLanguage === "en";

        document.documentElement.lang = activeLanguage;
        document.documentElement.dir = isEnglish ? "ltr" : "rtl";
        backToTop.setAttribute("aria-label", isEnglish ? "Back to top" : "العودة إلى الأعلى");
        window.dispatchEvent(new Event("progzt-language-change"));

        translations.forEach(element => {
            const translatedText = element.dataset[activeLanguage];
            if (element instanceof HTMLImageElement) {
                element.alt = translatedText;
            } else {
                element.textContent = translatedText;
            }
        });

        labels.forEach(element => {
            element.setAttribute("aria-label", element.dataset[`${activeLanguage}Label`]);
        });

        placeholders.forEach(element => {
            element.setAttribute("placeholder", element.dataset[`placeholder${isEnglish ? "En" : "Ar"}`]);
        });

        languageButtons.forEach(button => {
            button.textContent = isEnglish ? "AR" : "EN";
            button.setAttribute("aria-label", isEnglish ? "Switch to Arabic" : "Switch to English");
        });

        if (persist) {
            try {
                localStorage.setItem("progzt-language", activeLanguage);
            } catch {
                // Language switching still works when storage is unavailable.
            }
        }
    }

    let savedLanguage = document.documentElement.lang;
    try {
        savedLanguage = localStorage.getItem("progzt-language") || savedLanguage;
    } catch {
        // Use the document's default language when storage is unavailable.
    }

    setLanguage(savedLanguage, false);

    languageButtons.forEach(button => {
        button.addEventListener("click", () => {
            setLanguage(document.documentElement.lang === "ar" ? "en" : "ar");
        });
    });

    function updateBackToTopVisibility() {
        const isVisible = window.scrollY > 320;
        backToTop.classList.toggle("is-visible", isVisible);
        backToTop.setAttribute("aria-hidden", String(!isVisible));
        backToTop.tabIndex = isVisible ? 0 : -1;
    }

    let backToTopUpdateScheduled = false;
    window.addEventListener("scroll", () => {
        if (backToTopUpdateScheduled) {
            return;
        }

        backToTopUpdateScheduled = true;
        window.requestAnimationFrame(() => {
            backToTopUpdateScheduled = false;
            updateBackToTopVisibility();
        });
    }, { passive: true });
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
    });
    updateBackToTopVisibility();
})();
