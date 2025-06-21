import Breadcrumbs from "@/components/common/Breadcrumbs ";
import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import Form from "@/components/Contact/Form";
import Container from "@/routes/Container";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Container>
      <Breadcrumbs />
      <div className="pt-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 pb-20">
          <div className="col-span-1">
            <div className="card [box-shadow:0px_1px_13px_0px_#0000001A] p-6 md:p-8 h-full">
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-[#db4444] rounded-full flex justify-center items-center">
                  <Phone size="20" color="white" />
                </div>
                <p className="my-auto">{t("contact.info.callUs")}</p>
              </div>
              <p className="mb-3 text-sm">{t("contact.info.available")}</p>
              <p className="[dir:ltr] text-sm">{t("contact.info.phone")}: +8801611112222</p>
              <hr className="my-6" />
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-[#db4444] rounded-full flex justify-center items-center">
                  <Mail size="20" color="white" />
                </div>
                <p className="my-auto">{t("contact.info.writeToUs")}</p>
              </div>
              <p className="mb-3 text-sm">{t("contact.info.tips")}</p>
              <ul>
                <li className="mb-2 text-sm">{t("contact.info.emails")}: customer@exclusive.com</li>
                <li className="mb-2 text-sm">{t("contact.info.emails")}: support@exclusive.com</li>
              </ul>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="card [box-shadow:0px_1px_13px_0px_#0000001A] p-6 md:p-8 h-full">
              <Form />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
