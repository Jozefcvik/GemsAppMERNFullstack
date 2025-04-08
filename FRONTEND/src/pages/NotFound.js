import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('pageNotFound')}</h2>
      <p>{t('lorem08')}</p>

      <p>{t('goToThe')}<NavLink to="/">{t('homepage')}</NavLink>.</p>
    </div>
  )
}
