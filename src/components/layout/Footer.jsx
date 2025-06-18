import Container from '@/routes/Container';
import { SessionContext } from '@/store/SessionContext';
import { getCurrentLanguage } from '@/utils/change-lang';
import { SendHorizontal } from 'lucide-react';
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router';

export default function Footer() {
  const { t } = useTranslation();
  const { session } = useContext(SessionContext);
  const isRTL = getCurrentLanguage() == "ar";

  return (
    <div className="bg-black">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-15 py-25 text-white">
          <div className="col-span-1">
            <h1 className='text-xl mb-5'>{t("footer.col-1.title")}</h1>
            <h2 className='mb-5 text-xl'>{t("common.subscribe")}</h2>
            <p className='text-sm mb-3'>{t("footer.col-1.discount")}</p>
            <form onSubmit={(e) => e.preventDefault()} className={`input bg-black border-1 border-white rounded ${isRTL && "flex-row-reverse"}`}>
              <input type="email" placeholder={t("footer.col-1.placeholder")} className="" />
              <button type='submit' className='cursor-pointer'>
                <SendHorizontal />
              </button>
            </form>
          </div>
          <div className="col-span-1">
            <h1 className='text-xl mb-5'>{t("footer.col-2.title")}</h1>
            <ul className='space-y-5'>
              <li>{t("footer.col-2.address")}</li>
              <li>exclusive@gmail.com</li>
              <li className='[direction:ltr]'>+88015-88888-9999</li>
            </ul>
          </div>
          <div className="col-span-1">
            <h1 className='text-xl mb-5'>{t("footer.col-3.title")}</h1>
            <ul className='space-y-5'>
              {session ? <li><Link to="">{t("footer.col-3.link-1/1")}</Link></li> : <li><Link to="">{t("footer.col-3.link-1/2")}</Link></li>}
              <li><Link to="">{t("footer.col-3.link-2")}</Link></li>
              <li><Link to="">{t("footer.col-3.link-3")}</Link></li>
              <li><Link to="">{t("footer.col-3.link-4")}</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h1 className='text-xl mb-5'>{t("footer.col-4.title")}</h1>
            <ul className='space-y-5'>
              <li><Link to="">{t("footer.col-4.link-1")}</Link></li>
              <li><Link to="">{t("footer.col-4.link-2")}</Link></li>
              <li><Link to="">{t("footer.col-4.link-3")}</Link></li>
              <li><Link to="">{t("footer.col-4.link-4")}</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h1 className='text-xl mb-5'>{t("footer.col-5.title")}</h1>
            <p className="text-[#FAFAFA] text-sm opacity-80 mb-4">{t("footer.col-5.award")}</p>
            <div className={`flex gap-2 ${isRTL && "flex-row-reverse"}`}>
              <img loading="lazy" src="/assets/QrCode.jpg" alt="qr-code" className="h-20 w-20" />
              <div className="flex flex-col gap-2">
                <a href="https://play.google.com">
                  <img loading="lazy" src="/assets/google-play.png" alt="google-play" className='h-[38px]' />
                </a>
                <a href="https://play.google.com">
                  <img loading="lazy" src="/assets/app-store.png" alt="app-store" className='h-[38px] w-full' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <hr className='opacity-10' />
      <div className="copyright text-white text-center py-3 opacity-20">
        {isRTL ? <span>&copy; جميع الحقوق محفوظة لسنة {new Date().getFullYear()}</span> : <span>&copy; Copyright Rimel {new Date().getFullYear()}. All right reserved</span>}
      </div>
    </div>
  )
}
