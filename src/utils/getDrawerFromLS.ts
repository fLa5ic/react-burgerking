import { calcTotalPrice, calcTotalCount } from './calcTotalPriceAndCount';

export const getDrawerFromLS = () => {
   const data = localStorage.getItem('drawer');
   const items = data ? JSON.parse(data) : [];
   const totalPrice = calcTotalPrice(items);
   const totalCount = calcTotalCount(items);

   return {
      items,
      totalPrice,
      totalCount,
   };
};
