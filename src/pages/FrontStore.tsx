import { Routes, Route } from 'react-router-dom';
import Header from '../components/front/layout/Header';
import Footer from '../components/front/layout/Footer';
import ProductList from '../components/front/products/ProductList';
import Cart from '../components/front/cart/Cart';
import CheckoutForm from '../components/front/checkout/CheckoutForm';
import Success from '../components/front/success/Success';
import Order from '../components/front/orders/OrderList'

function FrontStore() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill">
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/success" element={<Success />} />
          <Route path="/orders" element={<Order />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default FrontStore; 