import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';  // 引入 Swal 提示訊息
import '@/assets/products/ProductList.css';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCartData } from '@/store/cartSlice';

interface Product {
  id: string;
  title: string;
  category: string;
  origin_price: number;
  price: number;
  unit: string;
  description: string;
  content: string;
  is_enabled: number;
  imageUrl: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<string>(''); // 追蹤正在加入購物車的商品 ID
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});  // 新增：儲存每個商品的數量
  const dispatch = useAppDispatch();  // 使用 useAppDispatch

  const API_BASE = import.meta.env.VITE_API_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(res.data.products);
      // 初始化每個商品的數量為 1
      const initialQuantities: { [key: string]: number } = {};
      res.data.products.forEach((product: Product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('取得商品列表失敗:', error);
    }
  };

  // 更新商品數量
  const handleQuantityChange = (productId: string, value: number) => {
    if (value < 1) return;  // 防止數量小於 1
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // 加入購物車
  const addToCart = async (id: string) => {
    setIsAddingToCart(id);
    
    // 創建動畫效果
    const button = document.querySelector(`button[data-product-id="${id}"]`);
    const cart = document.querySelector('.bi-cart3');
    
    if (button && cart) {
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();
      
      // 創建動畫點
      const dot = document.createElement('div');
      dot.className = 'flying-dot';
      document.body.appendChild(dot);
      
      // 設置起始位置
      dot.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
      dot.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
      
      // 添加動畫
      const animation = dot.animate([
        { 
          top: `${buttonRect.top + buttonRect.height / 2}px`,
          left: `${buttonRect.left + buttonRect.width / 2}px`,
          opacity: 1,
          transform: 'scale(1)'
        },
        { 
          top: `${cartRect.top + cartRect.height / 2}px`,
          left: `${cartRect.left + cartRect.width / 2}px`,
          opacity: 0,
          transform: 'scale(0.5)'
        }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });

      // 當動畫完成後移除元素
      animation.onfinish = () => dot.remove();
    }

    try {
      const data = {
        data: {
          product_id: id,
          qty: quantities[id]
        }
      };
      
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, data);
      
      if (res.data.success) {
        // 使用 dispatch 更新購物車
        await dispatch(fetchCartData());
        
        Swal.fire({
          icon: 'success',
          title: '成功加入購物車',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('加入購物車失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '加入購物車失敗',
        text: '請稍後再試',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setIsAddingToCart('');
    }
  };

  // 查看商品詳細資訊
  const viewProduct = async (id: string) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      if (res.data.success) {
        Swal.fire({
          title: '',  // 移除標題，讓整體更簡潔
          html: `
            <div class="container py-3">
              <div class="row g-4">
                <div class="col-md-6">
                  <img src="${res.data.product.imageUrl}" 
                       class="img-fluid rounded shadow-sm" 
                       alt="${res.data.product.title}"
                       style="width: 100%; height: 350px; object-fit: cover;">
                </div>
                <div class="col-md-6 text-start">
                  <h4 class="mb-3">${res.data.product.title}</h4>
                  <div class="mb-4">
                    <h5 class="text-danger mb-1">售價：$${res.data.product.price}</h5>
                    <p class="text-muted mb-0"><del>原價：$${res.data.product.origin_price}</del></p>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-2">數量</label>
                    <div class="input-group input-group-sm" style="width: 140px;">
                      <button class="btn btn-outline-secondary" type="button" 
                              onclick="if (this.nextElementSibling.value > 1) this.nextElementSibling.value--;">
                        -
                      </button>
                      <input type="text" class="form-control text-center" value="1" id="modalQuantity"
                             style="width: 40px; outline: none; box-shadow: none;" readonly>
                      <button class="btn btn-outline-secondary" type="button" 
                              onclick="this.previousElementSibling.value++;">
                        +
                      </button>
                    </div>
                  </div>
                  <button class="btn btn-danger w-100 mb-4 py-2" id="addToCartBtn" 
                          onclick="addToCartFromModal('${res.data.product.id}')">
                    加入購物車
                  </button>
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="card-title fw-bold mb-3">商品資訊</h6>
                      <div class="mb-3">
                        <p class="fw-bold mb-1">商品描述：</p>
                        <p class="text-muted mb-3">${res.data.product.description}</p>
                        <p class="fw-bold mb-1">商品內容：</p>
                        <p class="text-muted mb-0">${res.data.product.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
          width: 1000,
          padding: '1rem',
          position: 'center',
          showCloseButton: true,
          showConfirmButton: false,
          showCancelButton: false,
          customClass: {
            popup: 'animated fadeIn'
          },
          // didOpen 是 SweetAlert2 的一個生命週期鉤子
          // （lifecycle hook），它在 Modal 視窗完全打開後被觸發
          didOpen: () => {
            // 定義加入購物車函數，使用 window 暫存這個全域函數
            (window as any).addToCartFromModal = async (productId: string) => {
              // 取得加入購物車按鈕元素
              const addToCartBtn = document.getElementById('addToCartBtn') as HTMLButtonElement;
              if (addToCartBtn) {
                // 設置按鈕為載入中狀態
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = `
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  處理中...
                `;
              }

              try {
                // 取得使用者選擇的商品數量
                const quantity = parseInt((document.getElementById('modalQuantity') as HTMLInputElement).value);
                const data = {
                  product_id: productId,
                  qty: quantity
                };
                // 發送加入購物車請求
                const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
                
                if (res.data.success) {
                  // 使用 dispatch 更新購物車
                  await dispatch(fetchCartData());
                  
                  Swal.fire({
                    icon: 'success',
                    title: '成功加入購物車',
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              } catch (error) {
                // 錯誤處理
                console.error('加入購物車失敗:', error);
                Swal.fire({
                  icon: 'error',
                  title: '加入購物車失敗',
                  text: '請稍後再試',
                  showConfirmButton: false,
                  timer: 1500
                });
              } finally {
                // 無論成功失敗，都要恢復按鈕狀態
                if (addToCartBtn) {
                  addToCartBtn.disabled = false;
                  addToCartBtn.innerHTML = '加入購物車';
                }
              }
            };
          },
          // willClose 在 Modal 關閉前執行，用於清理暫存的全域函數
          willClose: () => {
            delete (window as any).addToCartFromModal;
          }
        });
      }
    } catch (error) {
      console.error('取得商品詳細資訊失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '取得商品詳細資訊失敗',
        text: '請稍後再試',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container">
      <div className="mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>數量</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: '200px' }}>
                  <div 
                    style={{ 
                      height: '100px',
                      backgroundImage: `url(${product.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <div className="h5 text-danger mb-0">${product.price}</div>
                  <del className="h6 text-muted">${product.origin_price}</del>
                </td>
                <td style={{ width: '150px' }}>
                  <div className="input-group input-group-sm">
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                    >
                      -
                    </button>
                    <input 
                      type="text"
                      className="form-control text-center"
                      style={{ 
                        width: '30px',
                        outline: 'none',    // 移除 focus 外框
                        boxShadow: 'none'   // 移除 focus 陰影
                      }}
                      value={quantities[product.id] || 1}
                      readOnly
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => viewProduct(product.id)}
                    >
                      查看更多
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-danger"
                      data-product-id={product.id}
                      onClick={() => addToCart(product.id)}
                      disabled={isAddingToCart === product.id}
                    >
                      {isAddingToCart === product.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          處理中...
                        </>
                      ) : '加到購物車'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList; 