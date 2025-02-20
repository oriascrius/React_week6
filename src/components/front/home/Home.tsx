import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homeWrapper}>
      {/* 主視覺區域 */}
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>歡迎來到購物網站</h1>
            <p>探索我們精選的商品，享受優質的購物體驗</p>
            <Link to="/products" className={styles.shopNowBtn}>
              立即選購
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 