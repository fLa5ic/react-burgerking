import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import filtersAndSortSlice from './slices/filtersAndSortSlice';
import drawer from './slices/drawerSlice';
import burgers from './slices/burgersSlice';

export const store = configureStore({
  reducer: {
    filtersAndSortSlice,
    drawer,
    burgers,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
