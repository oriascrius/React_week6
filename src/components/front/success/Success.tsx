import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  // 如果沒有訂單編號，代表是直接訪問，將其導回產品頁
  if (!orderId) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card text-center">
            <div className="card-body py-5">
              <div className="mb-4">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h3 className="card-title mb-4">訂單建立成功！</h3>
              <p className="card-text mb-4">
                感謝您的購買，您的訂單編號為：
                <br />
                <span className="fw-bold">{orderId}</span>
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/products')}
                >
                  繼續購物
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/orders')}
                >
                  查看訂單
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success; 