import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight, ChevronDown, Globe, User, ShoppingBag, CircleX, Star, LogOut, SoapDispenserDroplet, UserIcon, Banana, Smartphone, Armchair, Glasses, Dumbbell, LaptopMinimal } from "lucide-react";
import { changeLanguage, getCurrentLanguage } from "../../utils/change-lang";
import supabase from "@/services/supabase/supabaseClient";
import { SessionContext } from "@/store/SessionContext";
import Face4OutlinedIcon from '@mui/icons-material/Face4Outlined';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';

export default function MobileSidebar({ isOpen, onClose, navLinks }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = getCurrentLanguage() === "ar";
  const sidebarRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const { session } = useContext(SessionContext);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsClosing(false);
      // Small delay to ensure DOM is ready, then trigger animation
      const timer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Navigation data
  const categories = [
    { trigger: "sidebar.one", icon: Face4OutlinedIcon },
    { trigger: "sidebar.two", icon: FaceOutlinedIcon },
    { trigger: "sidebar.three", icon: Smartphone },
    { trigger: "sidebar.four", icon: Armchair },
    { trigger: "sidebar.five", icon: Glasses },
    { trigger: "sidebar.six", icon: Dumbbell },
    { trigger: "sidebar.seven", icon: LaptopMinimal },
    { trigger: "sidebar.eight", icon: Banana },
    { trigger: "sidebar.nine", icon: SoapDispenserDroplet },
  ];

  const languageOptions = [
    { text: "banner.menu.en", code: "en", flag: "🇺🇸" },
    { text: "banner.menu.ar", code: "ar", flag: "🇸🇦" },
  ];

  const handleClose = useCallback(() => {
    setIsAnimatingIn(false);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setMounted(false);
      setIsClosing(false);
      setExpandedCategory(null);
      setShowLanguageMenu(false);
      setShowAccountMenu(false);
    }, 350);
  }, [onClose]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setExpandedCategory(null);
      setShowLanguageMenu(false);
      setShowAccountMenu(false);

      handleClose();
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [handleClose, navigate]);
  const accountItems = [
    { text: "header.menu.manage", icon: User, func: () => navigate("/account") },
    { text: "header.menu.order", icon: ShoppingBag, func: () => navigate("/orders") },
    { text: "header.menu.cancellations", icon: CircleX, func: () => navigate("/cancellations") },
    { text: "header.menu.reviews", icon: Star, func: () => navigate("/reviews") },
    { text: "header.menu.logout", icon: LogOut, func: signOut, danger: true },
  ];


  // Enhanced handlers
  const handleCategoryClick = useCallback((index) => {
    setExpandedCategory(prev => prev === index ? null : index);
  }, []);

  const handleLinkClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleLanguageChange = useCallback((code) => {
    changeLanguage(code);
    handleClose();
    setIsAnimatingIn(false);
  }, [handleClose]);

  const isActive = useCallback((path) => location.pathname === path, [location]);

  // Don't render if not mounted
  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isAnimatingIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose} style={{ visibility: mounted ? 'visible' : 'hidden' }}
      />

      <aside
        ref={sidebarRef}
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transition-all duration-[200ms] ease-in transform ${isAnimatingIn
          ? 'translate-x-0 scale-100' : isRTL ? 'translate-x-full' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.menu")}
      >
        <header className="bg-black text-white p-4 shadow-lg">
          <div className={`flex items-center justify-between`}>
            <div className={`flex items-center gap-3 transform transition-all duration-[500ms] ease-in`}
            >
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-lg block">{t("header.title")}</span>
                <span className="text-sm text-gray-300 opacity-90">{t("header.welcome")}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-2.5 hover:bg-white/20 rounded-full transition-all duration-[300ms] ease-in transform hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/30`}
              aria-label={t("header.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content with proper height calculation */}
        <div className="flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
          <nav className={`flex-1 overflow-y-auto overscroll-contain transform transition-all duration-[500ms] ease-in`}>

            {/* Account Section */}
            {session &&
              <section className="border-b border-gray-100">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className={`w-full p-4 flex items-center justify-between hover:bg-red-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group `}
                  aria-expanded={showAccountMenu}
                >
                  <div className={`flex items-center gap-3 `}>
                    <div className="p-2 rounded-lg group-hover:bg-[#db4444] group-hover:text-white transition-all duration-200" style={{ backgroundColor: '#fef2f2' }}>
                      <User className="w-5 h-5" style={{ color: '#db4444' }} />
                    </div>
                    <span className="font-medium text-gray-800">{t("pages.account")}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${showAccountMenu ? 'rotate-180' : ''
                    } ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${showAccountMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="bg-red-50/30">
                    {accountItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            item.func();
                            if (!item.danger) handleLinkClick();
                          }}
                          className={`w-full p-3 ps-12 flex items-center gap-3 hover:bg-white/70 text-left transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                          } ${item.danger ? 'text-red-600 hover:bg-red-100' : 'text-gray-700'}`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{t(item.text)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            }
            {/* Main Navigation */}
            <section className="border-b border-gray-100">
              <h3 className="p-4 font-semibold text-gray-800 bg-red-50/30 text-sm uppercase tracking-wide">
                {t("header.navigation")}
              </h3>
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 p-4 hover:bg-red-50 border-b border-gray-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group 
                       ${isActive(link.path) ? "bg-red-100 text-red-600 font-semibold" : "hover:bg-red-50 text-gray-700"} `}
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:text-white transition-all duration-200" style={{ backgroundColor: '#fef2f2' }}>
                      <IconComponent className="w-4 h-4 group-hover:text-white" style={{ color: '#db4444' }} />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{t(link.label)}</span>
                  </Link>
                );
              })}
            </section>

            {/* Categories */}
            <section className="border-b border-gray-100">
              <h3 className="p-4 font-semibold text-gray-800 bg-red-50/30 text-sm uppercase tracking-wide">
                {t("home.categories.title")}
              </h3>
              {categories.map((category, index) => {
                const IconComponent = category.icon || Star;
                return (
                  <div key={index}>
                    <Link to={`/products`}>
                      <button
                        onClick={() => handleCategoryClick(index)}
                        className={`w-full p-4 flex items-center justify-between hover:bg-red-50 border-b border-gray-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group `}
                      >
                        <div className={`flex items-center gap-3 `}>
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:text-white transition-all duration-200" style={{ backgroundColor: '#fef2f2' }}>
                            <IconComponent className="!w-4 !h-4 group-hover:text-white" style={{ color: '#db4444' }} />
                          </div>
                          <span className="font-medium text-gray-700">{t(category.trigger)}</span>
                        </div>
                        {category.subs && (
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${expandedCategory === index ? 'rotate-90' : ''
                            } ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    </Link>

                    <div className={`overflow-hidden transition-all duration-300 ease-out ${category.subs && expandedCategory === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      {category.subs && (
                        <div className="bg-red-50/30">
                          {category.subs.map((sub, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={handleLinkClick}
                              className={`w-full p-3 pl-12 hover:bg-white/70 text-left border-b border-gray-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isRTL ? 'pr-12 pl-3 text-right' : ''
                                }`}
                            >
                              <span className="text-sm font-medium text-gray-600 hover:text-gray-800">{sub}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Language Settings */}
            <section className="pb-4">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`w-full p-4 flex items-center justify-between hover:bg-red-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group `}
                aria-expanded={showLanguageMenu}
              >
                <div className={`flex items-center gap-3 `}>
                  <div className="p-2 rounded-lg group-hover:text-white transition-all duration-200" style={{ backgroundColor: '#fef2f2' }}>
                    <Globe className="w-5 h-5 group-hover:text-white" style={{ color: '#db4444' }} />
                  </div>
                  <span className="font-medium text-gray-800">{t("header.language")}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${showLanguageMenu ? 'rotate-180' : ''
                  } ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-out ${showLanguageMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="bg-red-50/30">
                  {languageOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleLanguageChange(option.code)}
                      className={`w-full p-3 ps-12 hover:bg-white/70 text-left transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center gap-3 ${getCurrentLanguage() === option.code
                        ? 'text-white font-semibold' : 'text-gray-700'}`}
                      style={{
                        backgroundColor: getCurrentLanguage() === option.code ? '#db4444' : 'transparent'
                      }}
                    >
                      <span className="text-lg">{option.flag}</span>
                      <span className="text-sm font-medium">{t(option.text)}</span>
                      {getCurrentLanguage() === option.code && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </nav>

          <footer className={`p-4 bg-red-50/30 border-t border-gray-100 mt-auto transform transition-all duration-[500ms] ease-in`}>
            <p className="text-xs text-gray-500 text-center">
              © 2025 {t("app.name")} - {t("app.version")}
            </p>
          </footer>
        </div>
      </aside>
    </>
  );
}