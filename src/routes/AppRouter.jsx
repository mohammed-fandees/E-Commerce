import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, WishList, Contact, SignUp, NotFound, Login, ProductDetailsPage, Cart, CheckOut, About, Account } from '../pages';
import { Banner, Header } from '../components';
import Footer from '@/components/layout/Footer';

export default function AppRouter() {
  return (
    <Router>
      <Banner />
      <Header />
      <div className='container mx-auto px-4 max-w-[1440px]'>
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
      </div>
      <Footer />
    </Router>
  )
}
