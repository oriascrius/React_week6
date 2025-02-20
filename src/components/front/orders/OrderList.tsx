import { useState, useEffect } from 'react';
import axios from 'axios';

interface OrderProduct {
  id: string;
  product_id: string;
  qty: number;
  final_total: number;
  product: {
    title: string;
    price: number;
    unit: string;
  };
}

interface Order {
  id: string;
  create_at: number;
  final_total: number;
  is_paid: boolean;
  message: string;
  user: {
    email: string;
    name: string;
    tel: string;
    address: string;
  };
  products: {
    [key: string]: OrderProduct;
  };
  total?: number;
}

function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const getOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/orders`);
      setOrders(res.data.orders);
    } catch (error) {
      console.error('取得訂單失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">訂單查詢</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">目前沒有訂單記錄</p>
        </div>
      ) : (
        orders.map((order) => {
          // 計算訂單總金額
          const orderTotal = Object.values(order.products || {}).reduce(
            (sum, item) => sum + (item.product?.price * item.qty || 0),
            0
          );

          return (
            <div key={order.id} className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>訂單編號：{order.id}</span>
                <span className={`badge ${order.is_paid ? 'bg-success' : 'bg-warning'}`}>
                  {order.is_paid ? '已付款' : '未付款'}
                </span>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1">訂購時間：{new Date(order.create_at * 1000).toLocaleString()}</p>
                    <p className="mb-1">收件人：{order.user.name}</p>
                    <p className="mb-1">電話：{order.user.tel}</p>
                    <p className="mb-1">地址：{order.user.address}</p>
                    <p className="mb-1">Email：{order.user.email}</p>
                    {order.message && <p className="mb-1">留言：{order.message}</p>}
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3">訂購商品</h5>
                    {Object.values(order.products || {}).map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <span>
                          {item.product?.title} x {item.qty}
                          <span className="text-muted ms-2">
                            (${item.product?.price?.toLocaleString() || 0} / {item.product?.unit})
                          </span>
                        </span>
                        <span>${((item.product?.price * item.qty) || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-top pt-2 mt-2">
                      <div className="d-flex justify-content-between">
                        <strong>總計</strong>
                        <strong>${orderTotal.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default OrderList; 