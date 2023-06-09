import { translations } from "../../assets/languages";
import { Language } from "../enums/language.enum";

function useTranslation() {
  const language = Language.English;
  const fallbackLanguage = Language.English;

  const translate = (key: string) => {
    const keys = key.split(".");

    return (
      getNestedTranslation(language, keys) ??
      getNestedTranslation(fallbackLanguage, keys) ??
      key
    );
  };

  return translate;
}

function getNestedTranslation(language: Language, keys: string[]): string {
  return keys.reduce((obj: any, key: string) => {
    return obj?.[key];
  }, translations[language]);
}

export default useTranslation;
