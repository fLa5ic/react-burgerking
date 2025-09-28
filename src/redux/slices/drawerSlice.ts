import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIngredient } from '../../components/DrawerItem';
import { getDrawerFromLS } from '../../utils/getDrawerFromLS';
import { calcTotalCount, calcTotalPrice } from '../../utils/calcTotalPriceAndCount';

export type DrawerItem = {
   itemId: number;
   uniqueKey: string | null;
   title: string;
   basePrice: number;
   price: number;
   imageUrl: string;
   count: number;
   addedIngredients: IIngredient[];
   removedIngredients: IIngredient[];
   addedIds: number[];
   removedIds: number[];
   addIngredients: IIngredient[];
   removeIngredients: IIngredient[];
};

interface DrawerSliceState {
   openDrawer: boolean;
   totalPrice: number;
   totalCount: number;
   items: DrawerItem[];
}

const { items, totalPrice, totalCount } = getDrawerFromLS();

const initialState: DrawerSliceState = {
   openDrawer: false,
   totalPrice,
   totalCount,
   items,
};

const drawerSlice = createSlice({
   name: 'drawer',
   initialState,
   reducers: {
      setOpenDrawer(state, action: PayloadAction<boolean>) {
         state.openDrawer = action.payload;
      },

      addItem(state, action: PayloadAction<DrawerItem>) {
         const { itemId, addedIds = [], uniqueKey } = action.payload;

         // Если ингредиенты не выбраны - проверяем только по ID
         if (!uniqueKey) {
            const findItem = state.items.find(
               (obj) =>
                  obj.itemId === itemId &&
                  (!obj.addedIds || obj.addedIds.length === 0) &&
                  (!obj.removedIds || obj.removedIds.length === 0),
            );

            if (findItem) {
               findItem.count += action.payload.count;
               findItem.price = findItem.basePrice * findItem.count;
            } else {
               state.items.push({
                  ...action.payload,
                  price: action.payload.basePrice * action.payload.count,
               });
            }
         }
         // Если есть выбранные ингредиенты - проверяем по уникальному ключу
         else {
            const findItem = state.items.find((obj) => obj.uniqueKey === uniqueKey);

            if (findItem) {
               findItem.count += action.payload.count;
               // Пересчитываем цену с учетом ингредиентов
               findItem.price =
                  findItem.basePrice * findItem.count +
                  (findItem.addedIds || []).reduce((sum, id) => {
                     const ingredient = (findItem.addIngredients || []).find(
                        (ing) => ing.id === id,
                     );
                     return sum + (ingredient ? ingredient.price * findItem.count : 0);
                  }, 0);
            } else {
               // Считаем цену для нового товара с ингредиентами
               const baseTotal = action.payload.basePrice * action.payload.count;
               const ingredientsTotal = (addedIds || []).reduce((sum, id) => {
                  const ingredient = (action.payload.addIngredients || []).find(
                     (ing) => ing.id === id,
                  );
                  return sum + (ingredient ? ingredient.price * action.payload.count : 0);
               }, 0);

               state.items.push({
                  ...action.payload,
                  uniqueKey,
                  price: baseTotal + ingredientsTotal,
               });
            }
         }

         // Обновляем общие суммы
         state.totalPrice = calcTotalPrice(state.items);
         state.totalCount = calcTotalCount(state.items);
      },

      incrementItemDrawer(
         state,
         action: PayloadAction<{ uniqueKey: string | null; itemId: number; addedIds: number[] }>,
      ) {
         const { uniqueKey, itemId } = action.payload;

         // Ищем по uniqueKey (если есть) или по itemId (для старых товаров)
         const findItem = uniqueKey
            ? state.items.find((obj) => obj.uniqueKey === uniqueKey)
            : state.items.find((obj) => obj.itemId === itemId);

         if (findItem) {
            findItem.count++;

            // Пересчитываем цену (учитываем ингредиенты если они есть)
            const baseTotal = findItem.basePrice * findItem.count;
            const ingredientsTotal = (findItem.addedIds || []).reduce((sum, id) => {
               const ingredient = (findItem.addIngredients || []).find((ing) => ing.id === id);
               return sum + (ingredient ? ingredient.price * findItem.count : 0);
            }, 0);

            findItem.price = baseTotal + ingredientsTotal;
         }

         // Обновляем общие суммы
         state.totalPrice = state.items.reduce((sum, obj) => sum + (obj.price || 0), 0);
         state.totalCount = state.items.reduce((sum, obj) => sum + (obj.count || 0), 0);
      },

      decrementItemDrawer(
         state,
         action: PayloadAction<{ uniqueKey: string | null; itemId: number; addedIds: number[] }>,
      ) {
         const { uniqueKey, itemId } = action.payload;

         // Ищем по uniqueKey (если есть) или по itemId (для старых товаров)
         const findItem = uniqueKey
            ? state.items.find((obj) => obj.uniqueKey === uniqueKey)
            : state.items.find((obj) => obj.itemId === itemId);

         if (findItem && findItem.count > 1) {
            findItem.count--;

            // Пересчитываем цену (учитываем ингредиенты если они есть)
            const baseTotal = findItem.basePrice * findItem.count;
            const ingredientsTotal = (findItem.addedIds || []).reduce((sum, id) => {
               const ingredient = (findItem.addIngredients || []).find((ing) => ing.id === id);
               return sum + (ingredient ? ingredient.price * findItem.count : 0);
            }, 0);

            findItem.price = baseTotal + ingredientsTotal;
         }

         // Обновляем общие суммы
         state.totalPrice = state.items.reduce((sum, obj) => sum + (obj.price || 0), 0);
         state.totalCount = state.items.reduce((sum, obj) => sum + (obj.count || 0), 0);
      },

      removeItem(state, action: PayloadAction<{ uniqueKey: string | null; itemId: number }>) {
         const { uniqueKey, itemId } = action.payload;

         // Удаляем по uniqueKey (если есть) или по itemId (для старых товаров)
         state.items = state.items.filter((obj) =>
            uniqueKey ? obj.uniqueKey !== uniqueKey : obj.itemId !== itemId,
         );

         state.totalPrice = state.items.reduce((sum, obj) => sum + (obj.price || 0), 0);
         state.totalCount = state.items.reduce((sum, obj) => sum + (obj.count || 0), 0);
      },

      clearDrawer(state) {
         state.items = [];
         state.totalPrice = 0;
         state.totalCount = 0;
      },
   },
});

export const {
   setOpenDrawer,
   addItem,
   removeItem,
   clearDrawer,
   incrementItemDrawer,
   decrementItemDrawer,
} = drawerSlice.actions;

export default drawerSlice.reducer;
