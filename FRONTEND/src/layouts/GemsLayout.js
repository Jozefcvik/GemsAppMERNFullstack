import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { useTranslation } from "react-i18next";

export default function GemsLayout() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="gems-layout">
        <h2>{t("gems")}</h2>
        <p>{t("lorem04")}</p>
      </div>
      <ScrollToTop />
      <Outlet />
    </div>
  );
}
