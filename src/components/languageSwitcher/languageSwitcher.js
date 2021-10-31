import { useTranslation } from "react-i18next";

import { LANGUAGES } from "constants/languages";

import { LanguageButton } from "./languageButton";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  if (!LANGUAGES[i18n.language]) {
    i18n.changeLanguage("us");
  }

  return (
    <div className="dropdown">
      <LanguageButton lng={i18n.language} onClick={null} />
      <ul tabIndex="0" className="menu dropdown-content mt-1">
        <li>
          {Object.keys(LANGUAGES).map((lng) => (
            <LanguageButton
              key={lng}
              lng={lng}
              disabled={lng === i18n.language}
              onClick={() => i18n.changeLanguage(lng)}
            />
          ))}
        </li>
      </ul>
    </div>
  );
};
