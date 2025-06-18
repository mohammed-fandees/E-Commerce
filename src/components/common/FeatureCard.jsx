import { useTranslation } from "react-i18next"

export default function FeatureCard({ children: icon, title, text, onHover = false }) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col justify-center items-center ${onHover && "hoverable-card"}`}>
      <div className="p-2 bg-black border-10 border-[#D1D4DB] mb-5 rounded-full">{icon}</div>
      <h3 className='text-xl font-semibold'>{t(title)}</h3>
      <p className='text-sm'>{t(text)}</p>
    </div>
  )
}
