import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, WishList, Contact, SignUp, NotFound, Login, ProductDetailsPage, Cart, CheckOut, About, Account, Products, Orders, CategoryProducts, AllCategories, UserReviewsPage } from '../pages';
import { Banner, Header } from '../components';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from '@/components/layout/MobileHeader';
import ScrollToTop from '@/components/common/ScrollToTop';
import { useContext } from 'react';
import { SessionContext } from '@/store/SessionContext';
import { UserPlus, User, Home, Phone, Info } from 'lucide-react';


export default function AppRouter() {
  const isMobile = useIsMobile();
  const { session } = useContext(SessionContext);

  const navLinks = [
    { label: "header.nav.home", path: "/", icon: Home },
    { label: "header.nav.contact", path: "/contact", icon: Phone },
    { label: "header.nav.about", path: "/about", icon: Info },
    { label: session ? "header.nav.account" : "header.nav.signup", path: session ? "/account" : "/signup", icon: session ? User : UserPlus },
  ];

  return (
    <Router>
      <ScrollToTop />
      <Banner />
      {isMobile ? <MobileHeader navLinks={navLinks} /> : <Header navLinks={navLinks} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/products" element={<Products />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/categories/:category" element={<CategoryProducts />} />
        <Route path="/reviews" element={<UserReviewsPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}
