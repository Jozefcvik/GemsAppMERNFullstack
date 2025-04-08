import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="home">
      <h2>{t("welcome")}</h2>
      <p>{t("lorem01")}</p>
      <p>{t("lorem02")}</p>
      <p>{t("lorem03")}</p>
      <nav>
        <NavLink to="gems">{t("currentGemsOffer")}</NavLink>
      </nav>
    </div>
  );
}
