import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCartData } from '@/store/cartSlice';

// 定義表單資料的介面
interface FormData {
  email: string;
  name: string;
  tel: string;
  address: string;
  message: string;
}

function CheckoutForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const API_BASE = import.meta.env.VITE_API_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        data: {
          user: {
            email: data.email,
            name: data.name,
            tel: data.tel,
            address: data.address
          },
          message: data.message
        }
      };

      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, submitData);
      
      if (res.data.success) {
        await dispatch(fetchCartData());
        
        Swal.fire({
          icon: 'success',
          title: '訂單建立成功',
          text: '感謝您的購買！',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate('/success', { 
            state: { 
              orderId: res.data.orderId 
            } 
          });
        });
      }
    } catch (error) {
      console.error('訂單建立失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '訂單建立失敗',
        text: '請稍後再試',
        confirmButtonText: '確定'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container py-5">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email*</label>
        <input 
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          {...register('email', {
            required: '請輸入 Email',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '請輸入有效的 Email 格式'
            }
          })}
        />
        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">姓名*</label>
        <input 
          id="name"
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          {...register('name', {
            required: '請輸入姓名',
            minLength: {
              value: 2,
              message: '姓名至少需要 2 個字'
            }
          })}
        />
        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="tel" className="form-label">電話*</label>
        <input 
          id="tel"
          type="tel"
          className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
          {...register('tel', {
            required: '請輸入電話',
            minLength: {
              value: 8,
              message: '電話號碼至少需要 8 位數'
            }
          })}
        />
        {errors.tel && <div className="invalid-feedback">{errors.tel.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label">地址*</label>
        <input 
          id="address"
          type="text"
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          {...register('address', {
            required: '請輸入地址'
          })}
        />
        {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label">留言</label>
        <textarea 
          id="message"
          className="form-control"
          rows={3}
          {...register('message')}
        />
      </div>

      <div className="text-end">
        <button 
          type="submit" 
          className="btn btn-danger"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              處理中...
            </>
          ) : '送出訂單'}
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm; 