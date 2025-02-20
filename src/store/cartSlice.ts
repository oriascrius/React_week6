import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * 購物車狀態的介面定義
 * - quantity: 購物車商品總數量
 * - items: 購物車內的商品陣列
 * - status: API 請求狀態
 * - error: 錯誤訊息
 */
interface CartState {
  quantity: number;
  items: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

/**
 * 初始狀態
 * 當 Redux store 初始化時使用的預設值
 */
const initialState: CartState = {
  quantity: 0,
  items: [],
  status: 'idle',
  error: null
};

/**
 * 創建異步 action
 * fetchCartData: 用於從 API 獲取購物車數據
 * 
 * createAsyncThunk 會自動創建三個 action：
 * - pending: API 請求開始
 * - fulfilled: API 請求成功
 * - rejected: API 請求失敗
 */
export const fetchCartData = createAsyncThunk<any>(
  'cart/fetchCartData',
  async () => {
    const API_BASE = import.meta.env.VITE_API_URL;
    const API_PATH = import.meta.env.VITE_API_PATH;
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
    return res.data.data.carts;
  }
);

/**
 * 創建 Redux Slice
 * 包含了 reducer 和 action creators
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.fulfilled, (state, action: PayloadAction<any>) => {
        // API 請求成功時更新狀態
        state.status = 'succeeded';
        state.quantity = action.payload.length;
        state.items = action.payload;
      });
  }
});

export default cartSlice.reducer; 