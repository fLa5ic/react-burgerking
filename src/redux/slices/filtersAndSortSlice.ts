import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SelectedSortTypeEnum {
  PRICE_DESC = 'price',
  PRICE_ASC = '-price',
  TITLE_DESC = 'title',
  TITLE_ASC = '-title',
}

export type SelectedSortType = {
  name: string;
  sortProperty: SelectedSortTypeEnum;
};

interface FiltersAndSortSliceState {
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  searchValue: string;
  selectedSort: SelectedSortType;
}

const initialState: FiltersAndSortSliceState = {
  categoryId: 3,
  categoryName: 'Бургеры',
  subCategoryId: 3,
  searchValue: '',
  selectedSort: {
    name: 'цене (DESC)',
    sortProperty: SelectedSortTypeEnum.PRICE_DESC,
  },
};

const filtersAndSortSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryIdAndName(state, action: PayloadAction<{ id: number; name: string }>) {
      state.categoryId = action.payload.id;
      state.categoryName = action.payload.name;
    },
    setSubCategoryId(state, action: PayloadAction<number>) {
      state.subCategoryId = action.payload;
    },
    setSelectedSort(state, action: PayloadAction<SelectedSortType>) {
      state.selectedSort = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setFilters(state, action: PayloadAction<{
      categoryId: number;
      subCategoryId: number; 
      selectedSort: SelectedSortType;
    }>) {
      state.categoryId = action.payload.categoryId;
      state.subCategoryId = action.payload.subCategoryId;
      state.selectedSort = action.payload.selectedSort;
    },
  },
});

export const {
  setCategoryIdAndName,
  setSubCategoryId,
  setSelectedSort,
  setSearchValue,
  setFilters,
} = filtersAndSortSlice.actions;

export default filtersAndSortSlice.reducer;
