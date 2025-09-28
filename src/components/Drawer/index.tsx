import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenDrawer, clearDrawer } from '../../redux/slices/drawerSlice';
import DrawerItem, { IIngredient } from '../DrawerItem';
import styles from './Drawer.module.scss';
import { RootState } from '../../redux/store';

const Drawer: React.FC = () => {
   const dispatch = useDispatch();
   const { openDrawer, items, totalCount, totalPrice } = useSelector(
      (state: RootState) => state.drawer,
   );

   const [isVisible, setIsVisible] = React.useState(false);
   const [isClosing, setIsClosing] = React.useState(false);

   const handleCloseDrawer = () => {
      setIsClosing(true);
      setTimeout(() => {
         dispatch(setOpenDrawer(false));
         setIsClosing(false);
         setIsVisible(false);
      }, 300);
   };

   const onClickClear = () => {
      if (window.confirm('Ты действительно хочешь удалить все товары?')) {
         dispatch(clearDrawer());
         handleCloseDrawer();
      }
   };

   React.useEffect(() => {
      if (openDrawer) {
         setIsVisible(true);
      }
   }, [openDrawer]);

   React.useEffect(() => {
      if (openDrawer && items.length === 0) {
         handleCloseDrawer();
      }
   }, [openDrawer, items.length]);

   if (!openDrawer && !isVisible) {
      return null;
   }

   return (
      <div className={`${styles.drawer} ${isClosing ? styles.closing : ''}`}>
         {/* 🔥 Затемнение фона */}
         <div className={styles.overlay} onClick={handleCloseDrawer} />

         <svg
            onClick={handleCloseDrawer}
            className={styles.closeDrawer}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="32px"
            height="32px"
            fill="#502314">
            <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="m16 17.887 7.543 7.543a1.333 1.333 0 0 0 1.885-1.886l-7.543-7.543 7.543-7.542a1.333 1.333 0 0 0-1.885-1.885L16 14.116 8.457 6.574a1.333 1.333 0 0 0-1.884 1.885l7.542 7.543-7.543 7.542a1.333 1.333 0 1 0 1.885 1.886L16 17.887Z"
               fill="#F5EBDC"></path>
         </svg>

         <div className={styles.drawerInner}>
            <div className={styles.drawerItems}>
               <div className={styles.header}>
                  <div className={styles.title}>Мой заказ</div>
                  <button onClick={onClickClear} className={styles.deleteAllBtn}>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20px"
                        height="20px"
                        fill="#502314">
                        <path
                           d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07A1.01 1.01 0 0 1 4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2h4.559Zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929L17.997 7ZM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1Zm.28-6H9.72l-.333 1h5.226l-.333-1Z"
                           fill="#502314"></path>
                     </svg>
                     Убрать всё
                  </button>
               </div>
               {items.map((item) => (
                  <DrawerItem
                     key={item.uniqueKey || item.itemId}
                     {...item}
                     addedIngredients={
                        item.addIngredients?.filter((ing) => item.addedIds?.includes(ing.id)) || []
                     }
                     removedIngredients={
                        item.removeIngredients?.filter((ing: IIngredient) =>
                           item.removedIds?.includes(ing.id),
                        ) || []
                     }
                     addIngredients={item.addIngredients}
                  />
               ))}
            </div>
            <div className={styles.bottom}>
               <div className={styles.total}>
                  <div className={styles.products}>{totalCount} товаров на сумму</div>
                  <div className={styles.price}>{totalPrice.toFixed(2)} руб.</div>
               </div>
               <button className={styles.placeOrder}>
                  Оформить заказ - {totalPrice.toFixed(2)} руб.
               </button>
            </div>
         </div>
      </div>
   );
};

export default Drawer;
