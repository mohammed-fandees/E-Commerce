import i18n from "../i18n";

// Load language from localStorage on app start
const savedLang = localStorage.getItem("selectedLanguage");
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
  document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = savedLang;
}

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  localStorage.setItem("selectedLanguage", lang);
};

export const getCurrentLanguage = () => i18n.language;