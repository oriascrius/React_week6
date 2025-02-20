import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 自定義 dispatch hook
// 這個 hook 提供了類型安全的 dispatch 函數
// 它知道我們的 store 中所有可能的 action 類型
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 自定義 selector hook
// 這個 hook 提供了類型安全的方式來訪問 Redux store 狀態
// 它知道我們的 store 中所有可能的狀態類型
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * 為什麼需要這個文件？
 * 
 * 1. 類型安全：
 *    - 普通的 useDispatch 不知道我們的 store 具體有哪些 action
 *    - 普通的 useSelector 不知道我們的 store 具體有哪些狀態
 * 
 * 2. 開發體驗：
 *    - 使用這些自定義 hook 時，TypeScript 會提供更好的自動補全
 *    - 可以在編寫代碼時就發現類型錯誤，而不是在運行時才發現
 * 
 * 3. 維護性：
 *    - 集中管理 Redux 相關的類型定義
 *    - 如果需要修改類型定義，只需要修改這一個地方
 */ 