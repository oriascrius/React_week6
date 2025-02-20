import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import '@/assets/layout/header.css';
import { useSelector } from 'react-redux';
import { fetchCartData } from '@/store/cartSlice';
import type { RootState } from '@/store/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';

function Header() {
  const dispatch = useAppDispatch();
  // 從 Redux store 中獲取購物車數量
  const cartQuantity = useSelector((state: RootState) => state.cart.quantity);

  useEffect(() => {
    // 組件掛載時獲取購物車數據
    dispatch(fetchCartData());
  }, [dispatch]);

  return (
    <nav className="navbar navbar-expand-lg bg-light py-4">
      <div className="container">
        <Link className="navbar-brand fs-3" to="/">六角購物商城</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/products">產品列表</Link>
            </li>
            <li className="nav-item mx-2">
              <div className="position-relative">
                <Link to="/cart" className="nav-link">
                  <i className="bi bi-cart3 fs-3" style={{ color: '#8B7355' }}></i>
                  <AnimatePresence>
                    {cartQuantity > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="cart-badge"
                      >
                        {cartQuantity}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/admin">後台管理</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
