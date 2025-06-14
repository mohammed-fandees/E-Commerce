import React from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import { Smartphone, Monitor, Camera, Gamepad, Watch, Headphones } from 'lucide-react';


export default function Categories() {
  const { t } = useTranslation();

  const items = [
    { icon: <Smartphone size={50}/>, label: "home.categories.items.1" },
    { icon: <Monitor size={50}/>, label: "home.categories.items.2" },
    { icon: <Watch size={50}/>, label: "home.categories.items.3" },
    { icon: <Camera size={50}/>, label: "home.categories.items.4" },
    { icon: <Headphones size={50}/>, label: "home.categories.items.5" },
    { icon: <Gamepad size={50}/>, label: "home.categories.items.6" },
  ]
  return (
    <div>
      <SectionHeader title={t("home.categories.title")} description={t("home.categories.description")} action="navigation"></SectionHeader>
      <ul className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-6'>
        {items.map((item, i) => (
          <li key={i}>
            <button className='border-1 hover:border-0 hover:bg-[#DB4444] hover:text-white transition-[background-color, color, border-color] duration-200 border-[#0000004D] p-4 rounded-sm cursor-pointer flex flex-col gap-3 items-center justify-center h-36 shrink-0 w-full'>
              {item.icon}
              {t(item.label)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
