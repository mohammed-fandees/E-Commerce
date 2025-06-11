import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, WishList, Contact, SignUp, NotFound, Login, ProductDetailsPage, Cart, CheckOut, About, Account } from './pages';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (  
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My React App</h1>
          <p>
            Count: {count}
          </p>
          <button onClick={() => setCount(count + 1)}>
            Increment Count
          </button>
        </header>
      </div>
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
    </Router>
  )
}

export default App
