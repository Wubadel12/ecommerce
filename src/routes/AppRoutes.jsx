import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AccountLayout from '../layouts/AccountLayout'
import CheckoutLayout from '../layouts/CheckoutLayout'

// Each page is its own chunk, downloaded only when the route is first visited.
const Home = lazy(() => import('../pages/Home'))
const Shop = lazy(() => import('../pages/Shop'))
const Categories = lazy(() => import('../pages/Categories'))
const Category = lazy(() => import('../pages/Category'))
const SearchResults = lazy(() => import('../pages/SearchResults'))
const ProductDetails = lazy(() => import('../pages/ProductDetails'))
const Cart = lazy(() => import('../pages/Cart'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const NotFound = lazy(() => import('../pages/NotFound'))
const StoreInfo = lazy(() => import('../pages/StoreInfo'))

const AccountProfile = lazy(() => import('../pages/account/AccountProfile'))
const AccountDashboard = lazy(() => import('../pages/account/AccountDashboard'))
const AccountOrders = lazy(() => import('../pages/account/AccountOrders'))
const AccountOrderDetail = lazy(() => import('../pages/account/AccountOrderDetail'))
const AccountWishlist = lazy(() => import('../pages/account/AccountWishlist'))
const AccountAddresses = lazy(() => import('../pages/account/AccountAddresses'))
const AccountSettings = lazy(() => import('../pages/account/AccountSettings'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="privacy" element={<StoreInfo type="privacy" />} />
        <Route path="terms" element={<StoreInfo type="terms" />} />
        <Route path="404" element={<NotFound />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />

        <Route path="account" element={<AccountLayout />}>
          <Route index element={<AccountDashboard />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="orders/:orderId" element={<AccountOrderDetail />} />
          <Route path="wishlist" element={<AccountWishlist />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<CheckoutLayout />}>
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  )
}
