import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about">
      <h2>{t("aboutUs")}</h2>
      <p>{t("lorem05")}</p>
      <p>{t("lorem06")}</p>
      <p>{t("lorem07")}</p>
    </div>
  );
}
