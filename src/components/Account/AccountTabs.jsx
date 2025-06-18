import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AccountTabs = ({ children }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: t('account.editProfile') },
    { id: 'payment', label: t('account.paymentOptions') },
    { id: 'password', label: t('account.changePassword') }
  ];

  const getActiveIndex = () => {
    switch (activeTab) {
      case 'profile': return 0;
      case 'payment': return 1;
      case 'password': return 2;
      default: return 0;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'border-[#db4444] text-[#db4444]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, { isActive: index === getActiveIndex() })
        )}
      </div>
    </div>
  );
};

export default AccountTabs;