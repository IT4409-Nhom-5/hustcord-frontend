import {  useDispatch, useSelector } from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Các custom hooks dùng chung trong app.
// useAppDispatch: typed dispatch hook cho Redux.
// useAppSelector: typed selector hook cho Redux.
// Giúp TypeScript hiểu đúng kiểu dữ liệu khi dùng Redux.

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
