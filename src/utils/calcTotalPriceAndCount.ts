import { DrawerItem } from '../redux/slices/drawerSlice';

export const calcTotalPrice = (items: DrawerItem[]) => {
   return items.reduce((sum, obj) => sum + (obj.price || 0), 0);
};

export const calcTotalCount = (items: DrawerItem[]) => {
   return items.reduce((sum, obj) => sum + (obj.count || 0), 0);
};
