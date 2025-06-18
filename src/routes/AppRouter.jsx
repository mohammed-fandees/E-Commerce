import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, WishList, Contact, SignUp, NotFound, Login, ProductDetailsPage, Cart, CheckOut, About, Account } from '../pages';
import { Banner, Header } from '../components';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from '@/components/layout/MobileHeader';

export default function AppRouter() {
  const isMobile = useIsMobile();

  const navLinks = [
    { label: "header.nav.home", path: "/" },
    { label: "header.nav.contact", path: "/contact" },
    { label: "header.nav.about", path: "/about" },
    { label: "header.nav.signup", path: "/signup" },
  ];

  return (
    <Router>
      <Banner />
      {isMobile ? <MobileHeader navLinks={navLinks} /> : <Header navLinks={navLinks} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
      <Footer />
    </Router>
  )
}
