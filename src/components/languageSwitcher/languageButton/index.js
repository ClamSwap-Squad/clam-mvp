import ReactCountryFlag from "react-country-flag";

import { LANGUAGES } from "constants/languages";

export const LanguageButton = (props) => {
  const { lng, disabled, onClick } = props;

  return (
    <button className="btn btn-sm w-20" key={lng} onClick={onClick} disabled={disabled}>
      <ReactCountryFlag
        className="mr-2"
        countryCode={LANGUAGES[lng].nativeName}
        svg
        title={LANGUAGES[lng].nativeName}
      />
      <span className="text-white">{LANGUAGES[lng].nativeName}</span>
    </button>
  );
};
