import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../assets/style.css";
import { LoginFormData, Product, ApiResponse, PaginationType } from '../types';
import Pagination from "../components/admin/Pagination";
import ProductActions from "../components/admin/ProductActions";
import ViewProduct from "../components/admin/ViewProduct";
import ProductModal from "../components/admin/EditProductModal";
import AddProductModal from "../components/admin/AddProductModal";
import { useForm } from "react-hook-form";
import styles from '../assets/AdminLogin.module.css';
import AdminHeader from '../components/admin/layout/AdminHeader';

// API 基礎網址設定
const API_BASE = import.meta.env.VITE_API_URL;
// API 路徑，需要替換成自己的路徑
const API_PATH = import.meta.env.VITE_API_PATH;

// 創建 ReactSwal 實例
const ReactSwal = withReactContent(Swal);

function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  // 管理登入狀態的 state，true 表示已登入，false 表示未登入
  const [isAuth, setIsAuth] = useState<boolean>(false);

  // 儲存產品列表的 state，初始值為空陣列
  const [products, setProducts] = useState<Product[]>([]);

  // 儲存當前選中產品詳情的 state，初始值為 null
  const [tempProduct, setTempProduct] = useState<Product | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 新增分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType | null>(null);

  // 新增 editingProduct 狀態
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // 取得產品列表的非同步函式
  const getData = async (page = 1) => {
    try {
      const response = await axios.get<ApiResponse>(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      console.error('API 錯誤:', error);
    }
  };

  // 處理表單提交
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
      axios.defaults.headers.common.Authorization = token;
      getData();
      setIsAuth(true);

      ReactSwal.fire({
        title: '登入成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ReactSwal.fire({
          title: '登入失敗',
          text: error.response?.data.message,
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  // 使用 useEffect 在元件載入時檢查登入狀態
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 從 Cookie 中取得 token
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("hexToken="))
          ?.split("=")[1];

        if (!token) {
          setIsAuth(false);
          return;
        }

        // 設定 axios 預設標頭
        axios.defaults.headers.common.Authorization = token;

        // 驗證 token
        const response = await axios.post(`${API_BASE}/api/user/check`);

        if (response.data.success) {
          setIsAuth(true);
          getData();  // 取得產品資料
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error('登入驗證失敗:', error);
        setIsAuth(false);
      }
    };

    checkLoginStatus();
  }, []); // 空依賴陣列表示只在元件首次載入時執行

  // 開啟編輯 Modal
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Modal 關閉時也要清除編輯狀態
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProduct(undefined);
  };

  // 處理頁碼變更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getData(page);
  };

  // 處理登出
  const handleLogout = () => {
    setIsAuth(false);
    // 可以在這裡添加其他清理工作
  };

  // 渲染 UI
  return (
    <>
      {/* 使用條件渲染：已登入顯示產品列表，未登入顯示登入表單 */}
      {isAuth ? (
        <>
          <AdminHeader onLogout={handleLogout} />
          <div className="container p-5">  {/* 改用 container-fluid 讓表格更寬 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>產品列表</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                新增商品
              </button>
            </div>

            {/* 產品列表表格 */}
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>縮圖</th>
                  <th>產品名稱</th>
                  <th>分類</th>
                  <th>單位</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="align-middle">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="img-thumbnail"
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </td>
                    <td className="align-middle">{product.title}</td>
                    <td className="align-middle">{product.category}</td>
                    <td className="align-middle">{product.unit}</td>
                    <td className="align-middle">{product.origin_price}</td>
                    <td className="align-middle">{product.price}</td>
                    <td className="align-middle">
                      <span
                        className={`badge ${product.is_enabled ? 'bg-success' : 'bg-danger'}`}
                        style={{ fontSize: '0.9rem', padding: '8px 12px' }}  // 調整大小和間距
                      >
                        {product.is_enabled ? '啟用' : '未啟用'}
                      </span>
                    </td>
                    <td className="align-middle">
                      <ProductActions
                        product={product}
                        onEdit={handleEdit}
                        onView={(product) => {
                          setTempProduct(product);
                          setShowDetailModal(true);
                        }}
                        onDelete={() => getData()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 商品詳情 Modal */}
            <ViewProduct
              product={tempProduct!}
              show={showDetailModal}
              onClose={() => setShowDetailModal(false)}
            />

            {/* 新增商品 Modal */}
            <AddProductModal
              showModal={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSuccess={() => {
                setShowAddModal(false);
                getData();  // 重新取得資料
              }}
            />

            {/* 編輯商品 Modal */}
            <ProductModal
              showModal={showEditModal}
              onClose={handleCloseModal}
              onSuccess={() => {
                setShowEditModal(false);
                getData();
              }}
              editProduct={editingProduct}
            />

            {/* 在表格下方加入分頁元件 */}
            {pagination && (
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </>
      ) : (
        // 未登入狀態的 UI：登入表單
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>管理員登入</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder=" "
                  {...register("username", {
                    required: "請輸入電子郵件",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "請輸入有效的電子郵件"
                    }
                  })}
                />
                <label className={styles.label}>電子郵件</label>
                {errors.username && (
                  <div className={styles.errorMessage}>
                    {errors.username.message}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="password"
                  className={styles.input}
                  placeholder=" "
                  {...register("password", {
                    required: "請輸入密碼",
                    minLength: {
                      value: 6,
                      message: "密碼至少需要6個字元"
                    }
                  })}
                />
                <label className={styles.label}>密碼</label>
                {errors.password && (
                  <div className={styles.errorMessage}>
                    {errors.password.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                登入
              </button>
            </form>
            <p className={styles.copyright}>&copy; 2024 六角學院</p>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLogin;
