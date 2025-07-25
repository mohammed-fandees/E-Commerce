import { useWishlist } from '@/hooks/useWishlist';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getProductById } from "@/services/apis";

const AccountSidebar = ({ activeSection = 'profile', onSectionChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items } = useWishlist();

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchTitles = async () => {
      const resolved = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.id);
          return { id: item.id, label: product?.title || `#${item.id}` };
        })
      );
      setWishlistItems(resolved);
    };
    if (items?.length) {
      fetchTitles();
    } else {
      setWishlistItems([]);
    }
  }, [items]);

  const limitedWishlistItems = wishlistItems.slice(0, 3);

  const accountSections = [
    {
      title: t('account.manageAccount'),
      items: [
        { id: 'profile', label: t('account.myProfile') },
        { id: 'payment', label: t('account.paymentOptions') },
        { id: 'password', label: t('account.password') },
      ],
    },
    {
      title: t('account.myOrders'),
      items: [
        { id: 'returns', label: t('account.myReturns'), href: "/orders" },
        { id: 'cancellations', label: t('account.myCancellations'), href: "/orders" },
      ],
    },
    {
      title: t('account.myWishList'),
      items: limitedWishlistItems.map(item => ({
        ...item,
        href: "/wishlist" 
      })),
    },
  ];

  const handleItemClick = (itemId) => {
    if (onSectionChange) {
      onSectionChange(itemId);
    }
  };

  return (
    <aside className="col-span-1">
      {accountSections.map((section, idx) => (
        <div key={idx} className="mb-4">
          {section.title && (<h2 className="font-medium mb-2">{section.title}</h2>)}
          <ul className="space-y-1 ps-6">
            {section.items.map((item, index) => (
              <li key={index}>
                <button onClick={() => item.href ? navigate(item.href) : handleItemClick(item.id)}
                  className={`text-sm hover:text-[#db4444] transition-colors ${ activeSection === item.id ? 'text-[#db4444] font-medium' : 'text-[#909090] font-light'}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default AccountSidebar;
