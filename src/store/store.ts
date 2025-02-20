import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/cartSlice';

/**
 * Redux Store 的配置文件
 * 
 * 1. configureStore 的作用：
 *    - 自動組合所有 reducer
 *    - 自動添加開發工具支援（Redux DevTools）
 *    - 自動添加常用中間件（如 redux-thunk）
 */
export const store = configureStore({
  reducer: {
    // 將購物車的 reducer 添加到 store 中
    // 'cart' 將成為狀態樹中的鍵名
    cart: cartReducer,
  },
});

/**
 * 導出 TypeScript 類型定義
 * 
 * 1. RootState：
 *    - 整個應用的狀態類型
 *    - 用於 useSelector 時的類型檢查
 *    - 例如：state.cart.quantity 的類型推斷
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * 2. AppDispatch：
 *    - dispatch 函數的類型
 *    - 包含了異步 action 的類型支援
 *    - 用於 useAppDispatch 自定義 hook
 */
export type AppDispatch = typeof store.dispatch; 