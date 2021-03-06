import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

type LangKey = "en" | "es" | "pt";

type Resource = { translation: { [key: string]: string } };

type Resources = {
  [key in LangKey]?: Resource;
};

const supportedLngs: LangKey[] = ["en", "es", "pt"];

const languages: [LangKey, string][] = [
  // t("English")
  ["en", "English"],
  // t("Spanish")
  ["es", "Spanish"],
  // t("Portuguese")
  ["pt", "Portuguese"],
];

const resources = supportedLngs.reduce((accu: Resources, languageKey: LangKey) => {
  accu[languageKey] = {
    translation: require(`./locales/${languageKey}/translation.json`),
  } as Resource;
  return accu;
}, {});

i18n.on("languageChanged", (lngWithContry) => {
  const lng = lngWithContry.slice(0, 2);
  const { pathname } = window.location;
  const selectedLngPattern = new RegExp("^/" + lng);
  const isUrlUpdated = selectedLngPattern.test(pathname);

  if (isUrlUpdated) {
    return;
  }

  const lngPattern = new RegExp("^/(" + supportedLngs.join("|") + ")");
  const hasLangInURL = lngPattern.test(pathname);
  let newUrl;

  if (hasLangInURL) {
    newUrl = pathname.replace(lngPattern, `/${lng}`);
  } else {
    newUrl = `/${lng}${pathname}`;
  }

  window.history.replaceState(null, "", newUrl.replace(/\/$/, ""));
});

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    load: "languageOnly",
    supportedLngs,
    fallbackLng: "en",
    resources,
    detection: {
      order: ["path", "localStorage", "navigator"],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export type { LangKey };

export { languages };

export default i18n;
