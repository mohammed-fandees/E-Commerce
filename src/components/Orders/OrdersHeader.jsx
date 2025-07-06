import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, FileText, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import FormField from '../Account/FormField';

const OrdersHeader = ({ searchQuery, onSearchChange, totalOrders }) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">        
        {/* Search Bar */}
        <div className="search-section flex-1">
          <div className="search-input-container">
            <div className="relative">
              <div className="absolute inset-y-0 end-3 ps-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <FormField
                type="text"
                placeholder={t('orders.search.placeholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="!pe-10 w-full search-input focusable"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('orders.search.help')}
            </p>
          </div>
        </div>
      </div>

      {/* Export Status */}
      {isExporting && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">
              {t('orders.export.processing')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHeader;