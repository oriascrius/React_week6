import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import FrontStore from './pages/FrontStore';
// import { CartProvider } from '@/contexts/CartContext';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      {/* <CartProvider> */}
        <BrowserRouter basename="/React_week5">
          <Routes>
            {/* 前台路由 */}
            <Route path="/*" element={<FrontStore />} />
            
            {/* 後台路由 */}
            <Route path="/admin/*" element={<AdminLogin />} />
          </Routes>
        </BrowserRouter>
      {/* </CartProvider> */}
    </Provider>
  );
}

export default App;
