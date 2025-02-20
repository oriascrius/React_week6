import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCartData } from '@/store/cartSlice';

// 定義購物車項目的介面
interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  final_total: number;
  product: {
    title: string;
    price: number;
    origin_price: number;
    unit: string;
    imageUrl: string;
  };
}

// 定義購物車資料的介面
interface CartData {
  final_total: number;
  total: number;
  carts: CartItem[];
}

function Cart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cartData, setCartData] = useState<CartData>({
    final_total: 0,
    total: 0,
    carts: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<string>('');

  const API_BASE = import.meta.env.VITE_API_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  // 取得購物車列表
  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('取得購物車失敗:', error);
      setIsLoading(false);
    }
  };

  // 刪除單一品項
  const removeCartItem = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: '確定要刪除此商品嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        const res = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
        if (res.data.success) {
          await getCart();
          await dispatch(fetchCartData());
          Swal.fire({
            icon: 'success',
            title: '商品已刪除',
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error('刪除商品失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '刪除商品失敗',
        text: '請稍後再試',
        timer: 1500
      });
    }
  };

  // 清空購物車
  const clearCart = async () => {
    try {
      const result = await Swal.fire({
        title: '確定要清空購物車嗎？',
        text: '此操作無法復原',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定清空',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
        if (res.data.success) {
          await getCart();
          await dispatch(fetchCartData());
          Swal.fire({
            icon: 'success',
            title: '購物車已清空',
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error('清空購物車失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '清空購物車失敗',
        text: '請稍後再試',
        timer: 1500
      });
    }
  };

  // 更新購物車數量
  const updateCartItem = async (item: CartItem, qty: number) => {
    if (qty < 1) return;
    setIsUpdating(item.id);
    
    try {
      const data = {
        product_id: item.product_id,
        qty
      };
      const res = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${item.id}`, { data });
      
      if (res.data.success) {
        await getCart();
        await dispatch(fetchCartData());
      }
    } catch (error) {
      console.error('更新數量失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '更新數量失敗',
        text: '請稍後再試',
        timer: 1500
      });
    } finally {
      setIsUpdating('');
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  if (isLoading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="text-end">
        <button 
          className="btn btn-outline-danger"
          type="button"
          onClick={clearCart}
          disabled={cartData.carts.length === 0}
        >
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>圖片</th>
            <th>品名</th>
            <th style={{ width: '150px' }}>數量/單位</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          {cartData.carts.map((item) => (
            <tr key={item.id}>
              <td>
                <button 
                  type="button" 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeCartItem(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
              <td style={{ width: '200px' }}>
                <div 
                  style={{ 
                    height: '100px',
                    backgroundImage: `url(${item.product.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              </td>
              <td>{item.product.title}</td>
              <td>
                <div className="d-flex align-items-center">
                  <div className="input-group input-group-sm" style={{ width: '100px' }}>
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => updateCartItem(item, item.qty - 1)}
                      disabled={isUpdating === item.id}
                    >
                      -
                    </button>
                    <div 
                      className="form-control text-center px-1 position-relative"
                      style={{ 
                        width: '40px',
                        minWidth: '40px'
                      }}
                    >
                      {isUpdating === item.id ? (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        item.qty
                      )}
                    </div>
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => updateCartItem(item, item.qty + 1)}
                      disabled={isUpdating === item.id}
                    >
                      +
                    </button>
                  </div>
                  <span className="ms-2 text-muted">{item.product.unit}</span>
                </div>
              </td>
              <td>${item.product.price}</td>
              <td>${item.final_total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="text-end">總計</td>
            <td className="text-end">${cartData.total}</td>
          </tr>
          <tr>
            <td colSpan={5} className="text-end text-success">折扣價</td>
            <td className="text-end text-success">${cartData.final_total}</td>
          </tr>
        </tfoot>
      </table>
      
      <div className="d-flex justify-content-end mt-4">
        <button 
          type="button"
          className="btn btn-danger"
          onClick={() => navigate('/checkout')}
          disabled={cartData.carts.length === 0}
        >
          前往結帳
        </button>
      </div>
    </div>
  );
}

export default Cart; 