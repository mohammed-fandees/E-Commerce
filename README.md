## 🛒 Exclusive E-Commerce

[Live Demo](https://exclusive-xi.vercel.app/) &nbsp;|&nbsp; [GitHub Repo](https://github.com/mohammed-fandees/e-commerce)

A modern, feature-rich, and responsive E-commerce web application built using React, Next.js, Redux, and Tailwind CSS. Designed for seamless shopping experiences, robust admin management, and scalable code architecture.

---

## ✨ Features

- **User Authentication & Authorization**
  - Secure login & registration
  - Login and register with Google

- **Shopping Cart & Checkout**
  - Add/remove items to/from cart
  - Cart quantity management
  - Secure checkout flow

- **Order Management (saved on real database)**
  - Order creation and processing 
  - View order history
  - Admin dashboard for orders
  - Generate Invoice for order

- **Wishlist (saved on real database)**
  - Add or remove products to wishlist
  - Move all products on wishlist to cart

- **Responsive UI**
  - Works seamlessly across devices
  - Modern design with Tailwind CSS

- **Performance & SEO**
  - Optimized image loading
  - Fast, server-rendered pages (React.js)
  - SEO-optimized meta tags

- **Notifications & Alerts**
  - Toast notifications for actions (add to cart, login, etc.)

- **Products Review System (saved on real database)**
  - Review any product you bought
  - Manage your reviews from reviews page

- **Search Algorithm**
  - Search for any product, category, etc.
  - Trending products
  - search history (saved on localStorage)
---

## 🛠️ Tech Stack

| Frontend      | Backend/API    | State Management | Database     | Styling        | Other         |
|---------------|---------------|------------------|--------------|---------------|--------------|
| React.js       | Supabase    | Redux Toolkit    | Supabase | Tailwind CSS  | Vercel (host)|
| Vite         | Google authentication       |                  |  Shadcn UI     |      |              |

---

## 📂 File Structure

```
e-commerce/
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── LICENSE
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── assets/
│   │   ├── app-store.png
│   │   ├── apple-logo.png
│   │   ├── auth-page-img.jpg
│   │   ├── bKash.png
│   │   ├── employees/
│   │   │   ├── ceo.png
│   │   │   ├── co-founder.png
│   │   │   ├── coo.png
│   │   │   ├── cto.png
│   │   │   ├── delevery-stuff-manager.png
│   │   │   └── hr.png
│   │   ├── google-play.png
│   │   ├── Icon-Google.png
│   │   ├── master-card.png
│   │   ├── QrCode.jpg
│   │   ├── visa.png
│   │   └── what.png
│   ├── favicon.svg
│   └── products/
│       ├── gucci-perfume.avif
│       ├── iphone.avif
│       ├── jbl-outdoor-speaker.avif
│       ├── playstation-device.avif
│       └── stereo-speakers.avif
├── README.md
├── src/
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── Account/
│   │   │   ├── AccountSidebar.jsx
│   │   │   ├── AccountTabs.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── PasswordForm.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── PaymentMethodCard.jsx
│   │   │   └── ProfileForm.jsx
│   │   ├── AllCategories/
│   │   │   ├── CategoryStats.jsx
│   │   │   ├── FeaturedCategories.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   ├── PopularTags.jsx
│   │   │   └── SearchFilterBar.jsx
│   │   ├── Cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── EmptyCart.jsx
│   │   │   └── MobileCartItem.jsx
│   │   ├── Checkout/
│   │   │   ├── BillingForm.jsx
│   │   │   ├── CouponSection.jsx
│   │   │   ├── OrderItem.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── PaymentMethods.jsx
│   │   │   └── PriceSummary.jsx
│   │   ├── common/
│   │   │   ├── Breadcrumbs .jsx
│   │   │   ├── Button.jsx
│   │   │   ├── CategoriesGrid.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductsSwiper.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── SearchResultRow.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SidebarItems.jsx
│   │   │   └── VirtualProductCard.jsx
│   │   ├── Contact/
│   │   │   └── Form.jsx
│   │   ├── HomePage/
│   │   │   ├── Categories.jsx
│   │   │   ├── Featured.jsx
│   │   │   ├── LimitedOffers.jsx
│   │   │   ├── MonthProducts.jsx
│   │   │   └── Products.jsx
│   │   ├── index.js
│   │   ├── layout/
│   │   │   ├── Banner.jsx
│   │   │   ├── common/
│   │   │   │   ├── Account.jsx
│   │   │   │   ├── DropdownMenuItems.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MobileHeader.jsx
│   │   │   └── MobileSidebar.jsx
│   │   ├── Orders/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderItemCard.jsx
│   │   │   ├── OrdersEmpty.jsx
│   │   │   ├── OrdersFilters.jsx
│   │   │   ├── OrdersHeader.jsx
│   │   │   ├── OrdersList.jsx
│   │   │   └── OrderStatusBadge.jsx
│   │   ├── ProductDetails/
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── ProductInfo.jsx
│   │   │   ├── ProductReviews.jsx
│   │   │   └── RelatedProducts.jsx
│   │   └── ui/
│   │       ├── dropdown-menu.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── navigation-menu.jsx
│   ├── config/
│   │   └── Swiper.config.js
│   ├── data/
│   │   ├── categoryLabels.js
│   │   └── products.json
│   ├── hooks/
│   │   ├── use-countdown.ts
│   │   ├── use-mobile.js
│   │   ├── useCart.js
│   │   ├── useCheckout.js
│   │   ├── useOrders.js
│   │   ├── usePasswordForm.js
│   │   ├── usePaymentForm.js
│   │   ├── useProductDetails.js
│   │   ├── useProductTitle.js
│   │   ├── useProfileForm.js
│   │   └── useWishlist.js
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── ar.json
│   │       └── en.json
│   ├── lib/
│   │   └── utils.js
│   ├── main.jsx
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Account.jsx
│   │   ├── AllCategories.jsx
│   │   ├── Cart.jsx
│   │   ├── CategoryProducts.jsx
│   │   ├── CheckOut.jsx
│   │   ├── Contact.jsx
│   │   ├── HomePage.jsx
│   │   ├── index.js
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Orders.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── Products.jsx
│   │   ├── SignUp.jsx
│   │   ├── UserReviewsPage.jsx
│   │   └── WishList.jsx
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── Container.jsx
│   │   └── Wrapper.jsx
│   ├── services/
│   │   ├── apis.js
│   │   ├── cartApi.js
│   │   ├── changePassword.jsx
│   │   ├── ordersApi.js
│   │   ├── supabase/
│   │   │   ├── auth.jsx
│   │   │   └── supabaseClient.js
│   │   ├── user.js
│   │   └── wishlistApi.js
│   ├── store/
│   │   ├── CartContext.jsx
│   │   ├── SessionContext.jsx
│   │   └── WishlistContext.jsx
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   └── utils/
│       ├── change-lang.jsx
│       ├── data-shaping.js
│       ├── exportUtils.js
│       └── insertProductsToSupabase.js
├── vercel.json
└── vite.config.js

```

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammed-fandees/e-commerce.git
   cd e-commerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Main Modules

### 1. **Authentication**
- **Login/Register pages** with protected routes
- JWT token stored in httpOnly cookies
- User roles: User

### 2. **Product Catalog**
- Product fetching from Database
- Search, sort by category
- Responsive product cards

### 3. **Cart & Checkout**
- Add, remove, and update cart items
- Cart state synced with Redux
- Secure checkout, payment (mocked)

### 4. **Order Management**
- Order creation after checkout
- Order history for users


### 6. **Wishlist**
- Add/remove items to wishlist
- Wishlist state in Redux

### 7. **User Profile**
- Profile update
- View past orders, manage addresses

---

## ⚙️ Configuration

- **Environment Variables** (`.env`)
  - `NEXT_PUBLIC_API_URL` – API endpoint
  - `JWT_SECRET` – JWT secret key
  - ...others as needed

---

## 🔒 Security

- Passwords hashed & salted
- JWT httpOnly cookies for auth
- Input validation on server-side

---

## 🧑‍💻 Contributing

1. Fork this repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push and create a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📢 Credits

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

> **Crafted with ❤️ by [Mohammed Fandees](https://github.com/mohammed-fandees)**

---

### *Feel free to copy-paste and customize this README as you see fit! Want to add more? Share details on API, frontend code, screenshots, or anything else.*

---

**If you want even more details (API endpoints, Redux store structure, etc.), let me know!**