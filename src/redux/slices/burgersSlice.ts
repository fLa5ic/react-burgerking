import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type Burger = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'complited',
  ERROR = 'error',
}

interface BurgersSliceState {
  burgers: Burger[];
  status: Status;
}

const initialState: BurgersSliceState = {
  burgers: [],
  status: Status.LOADING,
};

export type SearchBurgersParams = {
  subCategory: string;
  sortBy: string;
  search: string;
};

export const fetchBurgers = createAsyncThunk<Burger[], SearchBurgersParams>(
  'burgers/fetchBurgersStatus',
  async (params) => {
    const { subCategory, sortBy, search } = params;
    const { data } = await axios.get<Burger[]>(
      `https://90746f9cd0776131.mokky.dev/burgers?${search}&sortBy=${sortBy}&${subCategory}`,
    );

    return data;
  },
);

const burgersSlice = createSlice({
  name: 'burgers',
  initialState,
  reducers: {
    setBurgers(state, action: PayloadAction<Burger[]>) {
      state.burgers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBurgers.pending, (state) => {
        state.status = Status.LOADING;
        state.burgers = [];
      })
      .addCase(fetchBurgers.fulfilled, (state, action) => {
        state.burgers = action.payload;
        state.status = Status.SUCCESS;
      })
      .addCase(fetchBurgers.rejected, (state) => {
        state.status = Status.ERROR;
        state.burgers = [];
      });
  },
});

export const { setBurgers } = burgersSlice.actions;

export default burgersSlice.reducer;
