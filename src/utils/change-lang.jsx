import i18n from "../i18n";

export const changeLanguage = (lang) => {

  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
};

export const getCurrentLanguage = () => i18n.language;