import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { getUserData } from '@/services/user';
import Breadcrumbs from "@/components/common/Breadcrumbs ";
import Container from "@/routes/Container";
import Wrapper from "@/routes/Wrapper";
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileForm } from '@/hooks/useProfileForm';
import { usePasswordForm } from '@/hooks/usePasswordForm';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import AccountTabs from '@/components/Account/AccountTabs';
import ProfileForm from '@/components/Account/ProfileForm';
import PasswordForm from '@/components/Account/PasswordForm';
import PaymentForm from '@/components/Account/PaymentForm';
import AccountSidebar from '@/components/Account/AccountSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Account() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  const profileForm = useProfileForm(user);
  const passwordForm = usePasswordForm();
  const paymentForm = usePaymentForm(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUser(data.user_metadata);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderDesktopContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileForm {...profileForm} />;
      case 'payment':
        return <PaymentForm {...paymentForm} />;
      case 'password':
        return <PasswordForm {...passwordForm} />;
      default:
        return <ProfileForm {...profileForm} />;
    }
  };

  if (isLoading) {
    return (
      <Wrapper prevent="guest">
        <Container>
          <div className="pt-18 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner />
            </div>
          </div>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper prevent="guest">
      <Container>
        <div className="pt-18">
          <div className="flex items-center justify-between mb-8">
            <Breadcrumbs />
            <p className="text-sm">
              {t("account.welcome")} 
              <span className="text-[#db4444] font-medium">
                {" "}{user?.name || 'User'}
              </span>
            </p>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 pb-20">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <AccountSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
            )}

            {/* Main Content */}
            <main className="col-span-1 lg:col-span-3 card [box-shadow:0px_1px_13px_0px_#0000001A] p-6 md:p-8 h-full">
              {isMobile ? (
                <AccountTabs>
                  <ProfileForm {...profileForm} />
                  <PaymentForm {...paymentForm} />
                  <PasswordForm {...passwordForm} />
                </AccountTabs>
              ) : (
                renderDesktopContent()
              )}
            </main>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}