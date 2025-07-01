import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORY_LABELS } from '@/data/categoryLabels';
import SectionHeader from '../components/common/SectionHeader';
import Container from '@/routes/Container';
import Breadcrumbs from '@/components/common/Breadcrumbs ';
import CategoriesGrid from '@/components/common/CategoriesGrid';
import FeaturedCategories from '@/components/AllCategories/FeaturedCategories';
import CategoryStats from '@/components/AllCategories/CategoryStats';
import PopularTags from '@/components/AllCategories/PopularTags';
import SearchFilterBar from '@/components/AllCategories/SearchFilterBar';
import Newsletter from '@/components/AllCategories/Newsletter';



export default function AllCategories() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const totalCategories = Object.keys(CATEGORY_LABELS).length;

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleTagClick = (categoryKey) => {
    setSearchTerm('');

    const categoriesSection = document.getElementById('all-categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Container>
      <Breadcrumbs />

      <SectionHeader title={t("home.categories.title")} description={t("home.categories.description")} />


      <CategoryStats t={t} totalCategories={totalCategories} loading={loading} />
      <FeaturedCategories t={t} />
      <PopularTags t={t} onTagClick={handleTagClick} />
      <SearchFilterBar
        t={t}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div id="all-categories" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t("categories.all_categories")}</h2>
          {searchTerm && (
            <div className="text-sm text-gray-600">
              {t("categories.search_results", { term: searchTerm })}
            </div>
          )}
        </div>
        <CategoriesGrid loading={loading} searchTerm={searchTerm} sortBy={sortBy} viewMode={viewMode} t={t} />
      </div>

      <Newsletter t={t} />
    </Container>
  );
}