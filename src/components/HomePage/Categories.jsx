import React, { useState, useEffect } from 'react'
import SectionHeader from '../common/SectionHeader'
import { useTranslation } from 'react-i18next'
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import CategoriesGrid from '../common/CategoriesGrid';

export default function Categories() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // simulate loading delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <SectionHeader title={t("home.categories.title")} description={t("home.categories.description")} />
      <CategoriesGrid loading={loading} limit={6} />
      <Link to="/categories" className='text-center block'>
        <Button>
          {t("common.viewAll")}
        </Button>
      </Link>
    </div>
  );
}
