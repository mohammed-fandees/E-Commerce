import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, FileText, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import { 
  downloadOrdersCSV, 
  downloadMultipleInvoices, 
  downloadOrdersJSON 
} from '@/utils/exportUtils';
import { getOrdersFromLocalStorage, formatOrderForDisplay } from '@/utils/orderUtils';
import { toast } from 'sonner';
import FormField from '../Account/FormField';

const OrdersHeader = ({ searchQuery, onSearchChange, totalOrders }) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleDownloadInvoices = async () => {
    setIsExporting(true);
    try {
      const orders = getOrdersFromLocalStorage().map(formatOrderForDisplay);
      
      if (orders.length === 0) {
        toast.error(t('orders.export.noOrders'));
        return;
      }

      // Limit to recent orders to prevent too many popups
      const recentOrders = orders.slice(0, 5);
      
      if (orders.length > 5) {
        toast.info(t('orders.export.limitedInvoices', { count: 5 }));
      }

      await downloadMultipleInvoices(recentOrders, {
        companyName: 'Your E-Commerce Store',
        companyAddress: '123 Business Street, City, State 12345',
        companyPhone: '(555) 123-4567',
        companyEmail: 'support@yourstore.com'
      });

      toast.success(t('orders.export.invoicesGenerated'));
    } catch (error) {
      console.error('Error downloading invoices:', error);
      toast.error(t('orders.export.invoiceError'));
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportOrdersCSV = async () => {
    setIsExporting(true);
    try {
      const orders = getOrdersFromLocalStorage().map(formatOrderForDisplay);
      
      if (orders.length === 0) {
        toast.error(t('orders.export.noOrders'));
        return;
      }

      await downloadOrdersCSV(orders);
      toast.success(t('orders.export.csvSuccess'));
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error(t('orders.export.csvError'));
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportOrdersJSON = async () => {
    setIsExporting(true);
    try {
      const orders = getOrdersFromLocalStorage();
      
      if (orders.length === 0) {
        toast.error(t('orders.export.noOrders'));
        return;
      }

      await downloadOrdersJSON(orders);
      toast.success(t('orders.export.jsonSuccess'));
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error(t('orders.export.jsonError'));
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

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
        {/* Quick Actions */}
        <div className="header-actions">
          <div className="relative">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || totalOrders === 0}
              variant="outline"
              className="btn-responsive flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{t('orders.actions.export')}</span>
            </Button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleDownloadInvoices}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t('orders.actions.downloadInvoices')}</div>
                      <div className="text-xs text-gray-500">{t('orders.export.invoicesDesc')}</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleExportOrdersCSV}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <Download className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t('orders.actions.exportCSV')}</div>
                      <div className="text-xs text-gray-500">{t('orders.export.csvDesc')}</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportOrdersJSON}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <Download className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{t('orders.actions.exportJSON')}</div>
                      <div className="text-xs text-gray-500">{t('orders.export.jsonDesc')}</div>
                    </div>
                  </button>
                </div>

                {totalOrders > 10 && (
                  <div className="px-4 py-2 border-t border-gray-200 bg-yellow-50">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-700">
                        {t('orders.export.largeExportWarning', { count: totalOrders })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Close menu when clicking outside */}
          {showExportMenu && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowExportMenu(false)}
            />
          )}
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