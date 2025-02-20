import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './AdminHeader.module.css';

const ReactSwal = withReactContent(Swal);
const API_BASE = import.meta.env.VITE_API_URL;

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`);
      if (response.data.success) {
        document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        onLogout();
        ReactSwal.fire({
          title: '登出成功',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          後台管理系統
        </div>
        <nav className={styles.nav}>
          <button 
            className={styles.navButton}
            onClick={() => navigate('/')}
          >
            回到前台
          </button>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            登出
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader; 