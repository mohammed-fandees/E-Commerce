import { ArrowLeft, ArrowRight } from "lucide-react"

export default function Navigation() {
  const functions = {
    onPrev: () => document.querySelector(`.swiper-button-prev-offers`)?.click(),
    onNext: () => document.querySelector(`.swiper-button-next-offers`)?.click()
  }
  return (
    <>
      {[1, 2].map((btn, i) => (
        <button key={i} onClick={btn == 1 ? functions.onPrev : functions.onNext} className="join-item bg-[#f5f5f5] flex items-center justify-center rounded-full w-[2.9rem] h-[2.9rem] transition-[color, background-color] duration-200  hover:bg-[#DB4444] hover:text-white">
          {btn == 1 ? <ArrowLeft /> : <ArrowRight />}
        </button>
      ))}
    </>
  )
}
